"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { Loader2, X, Shield, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  tempUserId: string;
  otpType: "email" | "sms" | "authenticator";
  onSuccess: () => void | Promise<void>;
}

export default function TwoFactorModal({
  isOpen,
  onClose,
  email,
  tempUserId,
  otpType,
  onSuccess,
}: TwoFactorModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) inputsRef.current[0]?.focus();
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (idx: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setError("");
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "Enter") {
      verifyOtp();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const arr = text.split("").concat(Array(6 - text.length).fill(""));
    setOtp(arr.slice(0, 6));
    const focusIndex = text.length >= 6 ? 5 : text.length;
    inputsRef.current[focusIndex]?.focus();
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        tempUserId,
        otp: code,
      });
      if (res?.error) {
        setError("Invalid code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      } else {
        await onSuccess();
        onClose();
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempUserId, otpType }),
      });
      if (res.ok) {
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="flex justify-between items-center pb-4">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600 w-5 h-5" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <button onClick={onClose} disabled={isSubmitting}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {otpType === "authenticator"
              ? "Enter the 6-digit code from your authenticator app."
              : `We sent a 6-digit code to ${
                  otpType === "email" ? email : "your phone number"
                }.`}
          </p>

          <div className="flex justify-center gap-2">
            {otp.map((digit, idx) => (
              <Input
                key={idx}
                ref={(el: HTMLInputElement | null): void => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKey(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                disabled={isSubmitting}
                className="w-12 h-12 text-center text-xl font-medium"
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button
            onClick={verifyOtp}
            disabled={isSubmitting || otp.join("").length < 6}
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>

          {otpType !== "authenticator" && (
            <div className="text-center">
              <button
                onClick={resendOtp}
                disabled={isSubmitting || countdown > 0}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
