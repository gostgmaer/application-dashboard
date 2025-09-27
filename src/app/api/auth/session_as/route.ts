// Alternative method: Using a custom API endpoint to update session
// Create this file at: /app/api/auth/update-session/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "No active session" },
        { status: 401 }
      );
    }
    console.log(request);

    const body = await request.json();
    const {
      "2fa_verified": twoFAVerified,
      access_token,
      refresh_token,
      accessTokenExpires
    } = body;

    // Get the current token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found" },
        { status: 401 }
      );
    }

    // Update token properties
    if (twoFAVerified !== undefined) {
      token["2fa_verified"] = twoFAVerified;
    }

    if (access_token) {
      token.accessToken = access_token;
    }

    if (refresh_token) {
      token.refreshToken = refresh_token;
    }

    if (accessTokenExpires) {
      token.accessTokenExpires = accessTokenExpires;
    }

    // Force session update
    const response = NextResponse.json({
      success: true,
      message: "Session updated successfully"
    });

    return response;

  } catch (error) {
    console.error("Update session error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update session" },
      { status: 500 }
    );
  }
}