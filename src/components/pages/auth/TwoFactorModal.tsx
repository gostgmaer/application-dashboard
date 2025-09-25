"use client";


import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Shield,
  RefreshCw,
  Smartphone,
  Mail,
  Clock,
} from "lucide-react";

interface OtpVerificationModalProps {
  email: string;
  otpType: string;
  sessionToken: string;
  onSuccess: () => void;
}

export function OtpVerificationModal({
  email,
  otpType,
  sessionToken,
  onSuccess,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("").slice(0, 6);
    setOtp(updatedOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        otp,
        step: "verify-otp",
        sessionToken,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setOtp("");
        inputRefs.current[0]?.focus();
      } else if (result?.ok) {
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || "OTP verification failed");
      setOtp("");
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || otpType === "totp") return;

    setIsResending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          sessionToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend OTP");
      }

      setResendCooldown(30);
    } catch (error: any) {
      setError(error.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const getOtpTypeInfo = () => {
    switch (otpType) {
      case "sms":
        return {
          icon: <Smartphone className="w-4 h-4" />,
          label: "SMS",
          description: "Check your phone for the verification code",
          color: "bg-green-100 text-green-800 border-green-200",
        };
      case "email":
        return {
          icon: <Mail className="w-4 h-4" />,
          label: "Email",
          description: "Check your email for the verification code",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "totp":
        return {
          icon: <Clock className="w-4 h-4" />,
          label: "Authenticator App",
          description: "Enter the code from your authenticator app",
          color: "bg-purple-100 text-purple-800 border-purple-200",
        };
      default:
        return {
          icon: <Shield className="w-4 h-4" />,
          label: "OTP",
          description: "Enter the verification code",
          color: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const otpInfo = getOtpTypeInfo();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-2xl border-0 animate-in zoom-in duration-200">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter the verification code to complete your login
            </CardDescription>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge className={otpInfo.color}>
                {otpInfo.icon}
                <span className="ml-1">{otpInfo.label}</span>
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">{otpInfo.description}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      ref={(el: HTMLInputElement | null): void => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                      disabled={isVerifying}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Enter the 6-digit verification code
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              {otpType !== "totp" && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={isResending || resendCooldown > 0}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : resendCooldown > 0 ? (
                      `Resend code in ${resendCooldown}s`
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend Code
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
