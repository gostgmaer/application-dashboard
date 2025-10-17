"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Eye, EyeOff, Mail, Lock, User, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { OTPModal } from "@/components/elements/otp/OTPModal";
import authService from "@/lib/http/authService";
import { useModal } from "@/contexts/modal-context";
import PrivacyPolicy from "@/components/elements/privacy";
import TermsAndConditions from "@/components/elements/terms";
import Link from "next/link";
interface LoginFormData {
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
  acceptTerms: boolean;
}

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
const LoginFormSchema = (isRegisterMode: boolean) =>
  z
    .object({
      email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
      password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
      // confirmPassword only required in register
      confirmPassword: isRegisterMode
        ? z
            .string()
            .min(1, "Confirm password is required")
            .min(6, "Confirm password must be at least 6 characters")
        : z.string().optional(),
      rememberMe: z.boolean().optional(),
      acceptTerms: isRegisterMode
        ? z.boolean().refine((val) => val === true, "You must accept the terms")
        : z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (isRegisterMode && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords are not in sync, try again!",
          path: ["confirmPassword"],
        });
      }
    });

// type LoginForm = z.infer<typeof LoginFormSchema(isRegisterMode: boolean)>;

export function LoginCard() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showConfirm, showAlert, showCustom } = useModal();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Using react-hook-form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema(isRegisterMode)),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      acceptTerms: false,
    },
  });
  console.log(isValid, errors);
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

  // Watch fields for validation or conditional UI
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const rememberMeValue = watch("rememberMe");
  const acceptTermsValue = watch("acceptTerms");

  // Social login handlers
  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider.toLowerCase(), { callbackUrl }); // redirect after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Toggle between login and register modes
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    reset({
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      acceptTerms: false,
    });
  };

  // Main form submission handler
  const onSubmit = async (data: LoginFormData) => {
    if (!mounted.current) return;
    setIsLoading(true);
    setError("");

    try {
      if (isRegisterMode) {
        const result = await authService.registerUser(data);
        if (result?.error) {
          console.error("❌ Registration failed:", result.error);
          safeSetState(
            setError,
            "Invalid email or password. Please try again."
          );
          return;
        }
        if (result?.success) {
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        }
      } else {
        console.log("🔐 Attempting login...");

        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          console.error("❌ Login failed:", result.error);
          safeSetState(
            setError,
            "Invalid email or password. Please try again."
          );
          return;
        }

        if (result?.ok) {
          console.log("✅ Login successful, checking session...");

          // Get the updated session to check 2FA requirement
          const session = await getSession();
          console.log("📋 Session data:", {
            "2fa_required": session?.["2fa_required"],
            otp_method: session?.otp_method,
          });

          if (!mounted.current) return;

          if (session?.["2fa_required"]) {
            console.log("🔐 2FA required, showing OTP modal");

            // Show OTP modal
            safeSetState(
              setOtpMethod,
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
      }
    } catch (error) {
      console.error("❌ error:", error);
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
          EXPIRED_OTP:
            "Verification code has expired. Please request a new one.",
          MAX_ATTEMPTS_EXCEEDED:
            "Too many failed attempts. Account temporarily locked.",
          RATE_LIMITED:
            "Too many verification attempts. Please wait before trying again.",
          SESSION_EXPIRED:
            "Your session has expired. Please close this dialog and log in again.",
          NETWORK_ERROR:
            "Network error. Please check your connection and try again.",
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
        safeSetState(
          setOtpError,
          "Failed to update session. Please try again."
        );
        return;
      }
    } catch (error: any) {
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
          MAX_DAILY_LIMIT:
            "Daily resend limit reached. Please try again tomorrow.",
          SESSION_EXPIRED:
            "Your session has expired. Please close this dialog and log in again.",
          NETWORK_ERROR:
            "Network error. Please check your connection and try again.",
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

  const showPrivacy = async () => {
    showCustom({
      title: `Privacy and Polity`,
      content: <PrivacyPolicy />,
    });
  };

  const showTerms = async () => {
    showCustom({
      title: `Terms and Conditions`,
      content: <TermsAndConditions />,
    });
  };

  // Derived validations for UI feedback
  const isPasswordValid = passwordValue?.length >= 8;
  const doPasswordsMatch = passwordValue === confirmPasswordValue;
  const isFormValid = isRegisterMode
    ? watch("email") && isPasswordValid && doPasswordsMatch && acceptTermsValue
    : watch("email") && passwordValue;

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        {/* Header Section */}
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-white dark:text-gray-900" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {isRegisterMode ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isRegisterMode
              ? "Sign up to get started with your account"
              : "Sign in to your account to continue"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login Section */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                  {isRegisterMode ? "Sign up with" : "Continue with"}
                </span>
              </div>
            </div>

            {/* Social Login Buttons - Inline */}
            <div className="grid grid-cols-3 gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <svg
                      className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Continue with Google</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                    onClick={() => handleSocialLogin("GitHub")}
                  >
                    <Github className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Continue with GitHub</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                    onClick={() => handleSocialLogin("LinkedIn")}
                  >
                    <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Continue with LinkedIn</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                  Or {isRegisterMode ? "sign up" : "sign in"} with email
                </span>
              </div>
            </div>
          </div>

          {/* Credential Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white transition-colors"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isRegisterMode
                      ? "Create a password (min. 8 characters)"
                      : "Enter your password"
                  }
                  {...register("password")}
                  className="pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
              {isRegisterMode && passwordValue && !isPasswordValid && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Confirm Password - only in Register */}
            {isRegisterMode && (
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className="pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white transition-colors"
                    required={isRegisterMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
                {confirmPasswordValue && !doPasswordsMatch && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Remember Me - only in Login */}
            {!isRegisterMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMeValue}
                    {...register("rememberMe")}
                    // Note: controlled Checkbox
                    onCheckedChange={(checked) =>
                      setValue("rememberMe", checked as boolean, {
                        shouldValidate: true,
                      })
                    }
                    className="border-gray-300 dark:border-gray-600"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  type="button"
                  className="text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
                  href={"/auth/forgot-password"}
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Terms and Privacy - only in Register */}
            {isRegisterMode && (
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTermsValue}
                    {...register("acceptTerms")}
                    onCheckedChange={(checked) =>
                      setValue("acceptTerms", checked as boolean, {
                        shouldValidate: true,
                      })
                    }
                    className="border-gray-300 dark:border-gray-600 mt-0.5"
                    required={isRegisterMode}
                  />
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium underline underline-offset-2 transition-colors"
                      onClick={() => showTerms()}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium underline underline-offset-2 transition-colors"
                      onClick={() => showPrivacy()}
                    >
                      Privacy Policy
                    </button>
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading || isSubmitting}
              className="w-full h-11 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {isRegisterMode ? "Creating Account..." : "Signing In..."}
                  </span>
                </div>
              ) : isRegisterMode ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        {/* Footer Section */}
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Separator />
          {/* Mode Toggle */}
          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isRegisterMode
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium underline underline-offset-2 transition-colors"
            >
              {isRegisterMode ? "Sign In" : "Sign Up"}
            </button>
          </div>
          {/* Privacy Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              By continuing, you acknowledge that you have read and understood
              our{" "}
              <button
                type="button"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition-colors"
                onClick={() => showPrivacy()}
              >
                Privacy Policy
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition-colors"
                onClick={() => showTerms()}
              >
                Terms of Service
              </button>
              .
            </p>
          </div>
          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              🔒 Your information is secure and encrypted
            </p>
          </div>
        </CardFooter>
      </Card>
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
    </TooltipProvider>
  );
}
