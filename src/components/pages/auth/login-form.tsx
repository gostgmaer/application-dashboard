"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { OTPModal } from "@/components/elements/otp/OTPModal";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {  update ,} = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const router = useRouter();
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

  const {
    register,
    handleSubmit,
       getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      if (result?.ok) {
        // Get the updated session to check 2FA requirement
        const session = await getSession();
        console.log("Login", session);

        if (session?.["2fa_required"]) {
          // Show OTP modal
          setOtpMethod(
            (session.otp_method as "totp" | "sms" | "email") || "totp"
          );

          // Set session expiry (typically 15 minutes for 2FA)
          const expiryTime = new Date(
            Date.now() + 15 * 60 * 1000
          ).toISOString();
          setSessionExpiry(expiryTime);

          setShowOTPModal(true);
        } else {
          // Redirect to dashboard
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsOTPLoading(true);
    setOtpError("");

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      const d = await response.json();

      if (!d.success) {
        // Handle specific error cases
        switch (d.error_code) {
          case "INVALID_OTP":
            setOtpError(
              "Invalid verification code. Please check and try again."
            );
            break;
          case "EXPIRED_OTP":
            setOtpError(
              "Verification code has expired. Please request a new one."
            );
            break;
          case "MAX_ATTEMPTS_EXCEEDED":
            setOtpError(
              "Too many failed attempts. Account temporarily locked."
            );
            setLockoutUntil(d.lockout_until);
            break;
          case "RATE_LIMITED":
            setOtpError(
              "Too many verification attempts. Please wait before trying again."
            );
            break;
          case "SESSION_EXPIRED":
            setOtpError(
              "Your session has expired. Please close this dialog and log in again."
            );
            break;
          case "NETWORK_ERROR":
            setOtpError(
              "Network error. Please check your connection and try again."
            );
            break;
          default:
            setOtpError(d.message || "Verification failed. Please try again.");
        }

        // Update remaining attempts if provided
        if (d.remaining_attempts !== undefined) {
          setRemainingAttempts(d.remaining_attempts);
        }

        // Update lockout time if provided
        if (d.lockout_until) {
          setLockoutUntil(d.lockout_until);
        }
        return;
      } else {
        const { data } = d;
        await update ({
          "2fa_verified": true,
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
          accessTokenExpires: data.tokens.accessTokenExpiresAt,
        });
        
        setShowOTPModal(false);
        router.push(callbackUrl);
      }

      // // Update the session with 2FA verified status
      // Update the session with 2FA verified status using NextAuth's update method

      // Close modal and redirect
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("Verification failed. Please try again.");
    } finally {
      setIsOTPLoading(false);
    }
  };

  const handleOTPResend = async () => {
    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method: otpMethod }),
      });

      const data = await response.json();

      if (!data.success) {
        // Handle specific resend error cases
        switch (data.error_code) {
          case "RATE_LIMITED":
            const waitTime = data.wait_seconds || 60;
            setOtpError(
              `Please wait ${waitTime} seconds before requesting another code.`
            );
            break;
          case "MAX_DAILY_LIMIT":
            setOtpError(
              "Daily resend limit reached. Please try again tomorrow."
            );
            break;
          case "SESSION_EXPIRED":
            setOtpError(
              "Your session has expired. Please close this dialog and log in again."
            );
            break;
          case "NETWORK_ERROR":
            setOtpError(
              "Network error. Please check your connection and try again."
            );
            break;
          default:
            setOtpError(
              data.message || "Failed to resend code. Please try again."
            );
        }
        return;
      }

      setOtpError("");
    } catch (error) {
      console.error("Resend OTP error:", error);
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 rounded-xl transition-all duration-200",
                    "bg-white dark:bg-gray-800 text-black dark:text-white",
                    "border-2 border-gray-300 dark:border-gray-600",
                    "focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent",
                    "hover:border-gray-400 dark:hover:border-gray-500",
                    errors.email &&
                      "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                  )}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 rounded-xl transition-all duration-200",
                    "bg-white dark:bg-gray-800 text-black dark:text-white",
                    "border-2 border-gray-300 dark:border-gray-600",
                    "focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent",
                    "hover:border-gray-400 dark:hover:border-gray-500",
                    errors.password &&
                      "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={cn(
                "w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200",
                "bg-black dark:bg-white text-white dark:text-black",
                "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
              )}
            >
              {isLoading && (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Want to Connact?{" "}
              <Link
                href="/contact"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Contact here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        onResend={otpMethod !== "totp" ? handleOTPResend : undefined}
        method={otpMethod}
        isLoading={isOTPLoading}
        error={otpError}
        remainingAttempts={remainingAttempts}
        lockoutUntil={lockoutUntil}
        sessionExpiry={sessionExpiry}
        email={getValues("email")}
        phone={undefined} // Add phone number if available in session
      />
    </div>
  );
}
