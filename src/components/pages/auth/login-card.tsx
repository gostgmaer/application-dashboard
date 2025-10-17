"use client";

import React, { useRef, useState } from "react";
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
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";

interface LoginFormData {
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
  acceptTerms: boolean;
}

const LoginFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .min(6, "Confirm password must be at least 6 characters"),
    rememberMe: z.boolean(),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords are not in sync, try again!",
    path: ["confirmPassword"],
  });

export function LoginCard() {
  // State management for form data and UI
  const { update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
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

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    acceptTerms: false,
  });

  // Form input change handler
  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(
        `${isRegisterMode ? "Register" : "Login"} attempt:`,
        formData
      );
      setIsLoading(false);
    }, 1500);
  };

  // Social login handlers
  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login initiated`);
    // Integration point for social authentication
  };

  // Toggle between login and register modes
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFormData((prev) => ({
      ...prev,
      confirmPassword: "",
      fullName: "",
      acceptTerms: false,
    }));
  };

  // Password validation for register mode
  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = isRegisterMode
    ? formData.email &&
      isPasswordValid &&
      doPasswordsMatch &&
      formData.acceptTerms
    : formData.email && formData.password;

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
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
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
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
              {isRegisterMode && formData.password && !isPasswordValid && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Confirm Password Field - Register Mode Only */}
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
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
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
                {formData.confirmPassword && !doPasswordsMatch && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Remember Me Checkbox - Login Mode Only */}
            {!isRegisterMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      handleInputChange("rememberMe", checked as boolean)
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
                <button
                  type="button"
                  className="text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms and Privacy - Register Mode Only */}
            {isRegisterMode && (
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("acceptTerms", checked as boolean)
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
                      onClick={() => console.log("Terms of Service clicked")}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium underline underline-offset-2 transition-colors"
                      onClick={() => console.log("Privacy Policy clicked")}
                    >
                      Privacy Policy
                    </button>
                  </Label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
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

          {/* Privacy Notice - Always Visible */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              By continuing, you acknowledge that you have read and understood
              our{" "}
              <button
                type="button"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition-colors"
                onClick={() => console.log("Privacy Policy clicked")}
              >
                Privacy Policy
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition-colors"
                onClick={() => console.log("Terms of Service clicked")}
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
    </TooltipProvider>
  );
}
