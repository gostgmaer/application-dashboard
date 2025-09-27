"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { signIn, getSession, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CircleAlert as AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { OTPModal } from "@/components/elements/otp/OTPModal";
import Link from "next/link";

// Enhanced validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

// TypeScript interfaces for API responses
interface OTPVerificationResponse {
  success: boolean;
  message?: string;
  error_code?: 
    | "INVALID_OTP"
    | "EXPIRED_OTP"
    | "MAX_ATTEMPTS_EXCEEDED"
    | "RATE_LIMITED"
    | "SESSION_EXPIRED"
    | "NETWORK_ERROR";
  data?: {
    tokens: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresAt: string;
    };
    user: {
      id: string;
      email: string;
      role?: string;
    };
  };
  remaining_attempts?: number;
  lockout_until?: string;
  wait_seconds?: number;
}

interface ResendOTPResponse {
  success: boolean;
  message?: string;
  error_code?: 
    | "RATE_LIMITED"
    | "MAX_DAILY_LIMIT"
    | "SESSION_EXPIRED"
    | "NETWORK_ERROR";
  wait_seconds?: number;
}

export default function LoginPage() {
  const { data: session, update, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  
  // Component state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpMethod, setOtpMethod] = useState<"totp" | "sms" | "email">("totp");
  const [otpError, setOtpError] = useState("");
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>();
  const [lockoutUntil, setLockoutUntil] = useState<string>();
  const [sessionExpiry, setSessionExpiry] = useState<string>();
  const [isUpdatingSession, setIsUpdatingSession] = useState(false);

  // Refs for cleanup
  const mounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Enhanced error handler
  const handleApiError = useCallback((error: any): string => {
    if (error?.name === "AbortError") {
      return "Request was cancelled";
    }
    if (error?.message?.includes("fetch")) {
      return "Network connection error. Please check your internet and try again.";
    }
    if (error?.message?.includes("timeout")) {
      return "Request timed out. Please try again.";
    }
    return error?.message || "An unexpected error occurred";
  }, []);

  // Safe state setter that checks if component is mounted
  const safeSetState = useCallback((setter: Function, value: any) => {
    if (mounted.current) {
      setter(value);
    }
  }, []);

  const onSubmit = async (data: LoginForm) => {
      console.log(data);
    
    if (!mounted.current) return;
  
    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 Attempting login...");
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!mounted.current) return;

      if (result?.error) {
        console.error("❌ Login failed:", result.error);
        safeSetState(setError, "Invalid email or password. Please try again.");
        return;
      }

      if (result?.ok) {
        console.log("✅ Login successful, checking session...");
        
        // Get the updated session to check 2FA requirement
        const session = await getSession();
        console.log("📋 Session data:", {
          "2fa_required": session?.["2fa_required"],
          "otp_method": session?.otp_method,
        });

        if (!mounted.current) return;

        if (session?.["2fa_required"]) {
          console.log("🔐 2FA required, showing OTP modal");
          
          // Show OTP modal
          safeSetState(setOtpMethod, 
            (session.otp_method as "totp" | "sms" | "email") || "totp"
          );

          // Set session expiry (typically 15 minutes for 2FA)
          const expiryTime = new Date(
            Date.now() + 15 * 60 * 1000
          ).toISOString();
          safeSetState(setSessionExpiry, expiryTime);
          safeSetState(setShowOTPModal, true);
        } else {
          console.log("✅ No 2FA required, redirecting to dashboard");
          // Redirect to dashboard
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      if (mounted.current) {
        safeSetState(setError, handleApiError(error));
      }
    } finally {
      if (mounted.current) {
        safeSetState(setIsLoading, false);
      }
    }
  };

  const handleOTPVerify = async (otp: string): Promise<void> => {
    if (!mounted.current) return;
    
    setIsOTPLoading(true);
    setOtpError("");
    setIsUpdatingSession(false);

    const controller = new AbortController();
    
    // Set timeout for the request
    timeoutRef.current = setTimeout(() => {
      controller.abort();
    }, 30000); // 30 second timeout

    try {
      console.log("🔐 Verifying OTP...");
      
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
        signal: controller.signal,
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: OTPVerificationResponse = await response.json();

      if (!mounted.current) return;

      if (!apiResponse.success) {
        console.error("❌ OTP verification failed:", apiResponse.error_code);
        
        // Handle specific error cases with user-friendly messages
        const errorMessages = {
          INVALID_OTP: "Invalid verification code. Please check and try again.",
          EXPIRED_OTP: "Verification code has expired. Please request a new one.",
          MAX_ATTEMPTS_EXCEEDED: "Too many failed attempts. Account temporarily locked.",
          RATE_LIMITED: "Too many verification attempts. Please wait before trying again.",
          SESSION_EXPIRED: "Your session has expired. Please close this dialog and log in again.",
          NETWORK_ERROR: "Network error. Please check your connection and try again.",
        };

        const errorMessage = apiResponse.error_code 
          ? errorMessages[apiResponse.error_code] 
          : apiResponse.message || "Verification failed. Please try again.";

        safeSetState(setOtpError, errorMessage);

        // Update remaining attempts if provided
        if (apiResponse.remaining_attempts !== undefined) {
          safeSetState(setRemainingAttempts, apiResponse.remaining_attempts);
        }

        // Update lockout time if provided
        if (apiResponse.lockout_until) {
          safeSetState(setLockoutUntil, apiResponse.lockout_until);
        }

        return;
      }

      // ✅ SUCCESS - Handle successful OTP verification
      console.log("✅ OTP verified successfully");
      
      if (!apiResponse.data) {
        throw new Error("Invalid response format: missing data");
      }

      const { data } = apiResponse;
      
      console.log("🔄 Updating session with new tokens...");
      setIsUpdatingSession(true);

      try {
        // ✅ CRITICAL: Update session with correct property names
        const updatePayload = {
          "2fa_verified": true,
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
          accessTokenExpires: data.tokens.accessTokenExpiresAt,
        };

        console.log("📋 Session update payload:", {
          "2fa_verified": updatePayload["2fa_verified"],
          hasAccessToken: !!updatePayload.accessToken,
          hasRefreshToken: !!updatePayload.refreshToken,
          accessTokenExpires: updatePayload.accessTokenExpires,
        });

        // Update the session
        await update(updatePayload);

        console.log("✅ Session updated successfully");

        if (!mounted.current) return;

        // Close modal and redirect
        safeSetState(setShowOTPModal, false);
        
        // Small delay to ensure session is fully updated
        setTimeout(() => {
          if (mounted.current) {
            console.log("🚀 Redirecting to:", callbackUrl);
            router.push(callbackUrl);
          }
        }, 100);

      } catch (sessionError) {
        console.error("❌ Session update failed:", sessionError);
        safeSetState(setOtpError, "Failed to update session. Please try again.");
        return;
      }

    } catch (error:any) {
      console.error("❌ OTP verification error:", error);
      if (mounted.current) {
        if (error.name === "AbortError") {
          safeSetState(setOtpError, "Request timed out. Please try again.");
        } else {
          safeSetState(setOtpError, handleApiError(error));
        }
      }
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (mounted.current) {
        safeSetState(setIsOTPLoading, false);
        safeSetState(setIsUpdatingSession, false);
      }
    }
  };

  const handleOTPResend = async (): Promise<void> => {
    if (!mounted.current) return;
    
    try {
      console.log("📤 Resending OTP...");
      
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method: otpMethod }),
      });

      const apiResponse: ResendOTPResponse = await response.json();

      if (!mounted.current) return;

      if (!apiResponse.success) {
        // Handle specific resend error cases
        const errorMessages = {
          RATE_LIMITED: apiResponse.wait_seconds 
            ? `Please wait ${apiResponse.wait_seconds} seconds before requesting another code.`
            : "Please wait before requesting another code.",
          MAX_DAILY_LIMIT: "Daily resend limit reached. Please try again tomorrow.",
          SESSION_EXPIRED: "Your session has expired. Please close this dialog and log in again.",
          NETWORK_ERROR: "Network error. Please check your connection and try again.",
        };

        const errorMessage = apiResponse.error_code
          ? errorMessages[apiResponse.error_code]
          : apiResponse.message || "Failed to resend code. Please try again.";

        safeSetState(setOtpError, errorMessage);
        return;
      }

      console.log("✅ OTP resent successfully");
      safeSetState(setOtpError, "");
    } catch (error) {
      console.error("❌ Resend OTP error:", error);
      if (mounted.current) {
        safeSetState(setOtpError, handleApiError(error));
      }
    }
  };

  const handleCloseOTPModal = useCallback(() => {
    if (mounted.current) {
      setShowOTPModal(false);
      setOtpError("");
      setRemainingAttempts(undefined);
      setLockoutUntil(undefined);
      setIsOTPLoading(false);
      setIsUpdatingSession(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "w-full px-4 py-3 pl-12 border rounded-lg shadow-sm transition-all duration-200",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                    errors.email
                      ? "border-red-300 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={cn(
                    "w-full px-4 py-3 pl-12 pr-12 border rounded-lg shadow-sm transition-all duration-200",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                    errors.password
                      ? "border-red-300 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* Forgot Password Link */}
  <div className="mt-2 text-right">
    <Link
      href="/auth/forgot-password"
      className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
    >
      Forgot password?
    </Link>
  </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className={cn(
                "w-full flex justify-center items-center gap-2 py-3 px-4",
                "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300",
                "text-white font-medium rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "transition-all duration-200 transform",
                "disabled:cursor-not-allowed disabled:transform-none"
              )}
            >
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Want to Contact?{" "}
            <Link
              href="/contact"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Contact here
            </Link>
          </p>
        </div>

        {/* OTP Modal */}
        {showOTPModal && (
          <OTPModal
            isOpen={showOTPModal}
            onClose={handleCloseOTPModal}
            onVerify={handleOTPVerify}
            onResend={otpMethod !== "totp" ? handleOTPResend : undefined}
            method={otpMethod}
            isLoading={isOTPLoading || isUpdatingSession}
            error={otpError}
            remainingAttempts={remainingAttempts}
            lockoutUntil={lockoutUntil}
            sessionExpiry={sessionExpiry}
            email={getValues("email")}
            phone={undefined} // Add phone number if available in session
          />
        )}
      </motion.div>
    </div>
  );
}