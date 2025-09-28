// /api/verify-otp/route.ts or /pages/api/verify-otp.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth/authOptions";
import authService from "@/lib/http/authService";
import { authOptions } from "../auth/authOptions";

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 OTP verification API called");
    
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.error("❌ No session found");
      return NextResponse.json(
        {
          success: false,
          message: "No active session",
          error_code: "SESSION_EXPIRED",
        },
        { status: 401 }
      );
    }

    // Check if 2FA is required
    if (!session["2fa_required"]) {
      console.error("❌ 2FA not required for this session");
      return NextResponse.json(
        {
          success: false,
          message: "2FA not required",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const { otp } = await request.json();

    if (!otp) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP is required",
          error_code: "INVALID_OTP",
        },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP must be 6 digits",
          error_code: "INVALID_OTP",
        },
        { status: 400 }
      );
    }

    console.log("📤 Calling backend OTP verification service");

    // Call your backend service to verify OTP
    const verificationResult = await authService.verifyOTPAndLogin({
      otp,
      tempToken: session.tempToken, // Use temp token from session
      email: session.user?.email,
    },session.accessToken);

    if (!verificationResult.success) {
      console.error("❌ Backend OTP verification failed:", verificationResult.message);
      
      // Map backend error codes to frontend error codes
      const errorCodeMapping: Record<string, string> = {
        'INVALID_OTP': 'INVALID_OTP',
        'EXPIRED_OTP': 'EXPIRED_OTP',
        'MAX_ATTEMPTS': 'MAX_ATTEMPTS_EXCEEDED',
        'RATE_LIMITED': 'RATE_LIMITED',
        'ACCOUNT_LOCKED': 'MAX_ATTEMPTS_EXCEEDED',
      };

      const mappedErrorCode = errorCodeMapping[verificationResult.code || ''] || 'INVALID_OTP';

      return NextResponse.json(
        {
          success: false,
          message: verificationResult.message || "OTP verification failed",
          error_code: mappedErrorCode,
          remaining_attempts: verificationResult.data?.remaining_attempts,
          lockout_until: verificationResult.data?.lockout_until,
        },
        { status: 400 }
      );
    }

    console.log("✅ OTP verification successful");

    // Return success response with new tokens
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        tokens: {
          accessToken: verificationResult.data.tokens.accessToken,
          refreshToken: verificationResult.data.tokens.refreshToken,
          accessTokenExpiresAt: verificationResult.data.tokens.accessTokenExpiresAt,
        },
        user: verificationResult.data.user,
      },
    });

  } catch (error) {
    console.error("❌ OTP verification API error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error_code: "NETWORK_ERROR",
      },
      { status: 500 }
    );
  }
}