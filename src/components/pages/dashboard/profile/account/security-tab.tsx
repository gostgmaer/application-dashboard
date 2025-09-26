"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Shield,
  Smartphone,
  Eye,
  EyeOff,
  AlertTriangle,
  Phone,
  Mail,
  QrCode,
  Clock,
} from "lucide-react";
import {
  changePasswordSchema,
  twoFactorSchema,
  ChangePasswordFormData,
  TwoFactorFormData,
  EmailSendFormData,
  emailSendSchema,
  EmailVerificationFormData,
  emailVerificationSchema,
  PhoneSendFormData,
  phoneSendSchema,
  PhoneVerificationFormData,
  phoneVerificationSchema,
} from "@/lib/validation/account";
import { User } from "@/types/user";
import authService from "@/helper/services/authService";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";
import z from "zod";
import { formatDistanceToNow } from "date-fns";

interface SecurityTabProps {
  user: User;
}

interface MfaSetupData {
  qrCode?: string;
  manualEntryKey?: string;
  setupUri?: string;
  method?: string;
}

export default function SecurityTab({ user }: SecurityTabProps) {
  const { toast } = useToast();
  const { data: session } = useSession();

  // Disable 2FA states
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendAvailable, setResendAvailable] = useState(false);

  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mfaSetUp, setMfaSetUp] = useState<MfaSetupData | undefined>(undefined);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user.otpSettings.enabled
  );
  const [phoneVerified, setPhoneVerified] = useState(
    user.phoneVerified || false
  );
  const [emailVerified, setEmailVerified] = useState(
    user.emailVerified || false
  );
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailVerificationMethod, setEmailVerificationMethod] = useState<
    "link" | "otp" | null
  >(null);
  const [twoFactorMethod, setTwoFactorMethod] = useState<
    "totp" | "email" | "sms" | null
  >(null);
  const [twoFactorCodeSent, setTwoFactorCodeSent] = useState(false);

  // Get user's current 2FA method
  const getCurrentTwoFactorMethod = (): "totp" | "email" | "sms" => {
    return user.otpSettings?.preferredMethod || "totp";
  };

  // Utility functions for masking
  const maskEmail = (email: string): string => {
    if (!email || email.length < 8) return email;
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 7) return email;
    const masked = localPart.slice(0, 3) + "*".repeat(localPart.length - 7) + localPart.slice(-4);
    return `${masked}@${domain}`;
  };

  const maskPhone = (phone: string): string => {
    if (!phone || phone.length < 8) return phone;
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length <= 7) return phone;
    const masked = digitsOnly.slice(0, 3) + "*".repeat(digitsOnly.length - 7) + digitsOnly.slice(-4);
    return masked;
  };

  // Timer effect for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setResendAvailable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const twoFactorSetupForm = useForm<{
    contact: string;
    method: "totp" | "email" | "sms";
    token: string;
  }>({
    resolver: zodResolver(
      z.object({
        contact: z.string().min(1, "Contact information is required").refine(
          (value) => {
            const method = twoFactorSetupForm?.getValues("method");
            if (method === "email") return z.string().email("Invalid email address").safeParse(value).success;
            if (method === "sms") return z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").safeParse(value).success;
            return true; // No validation for TOTP
          },
          { message: "Invalid contact information" }
        ),
        method: z.enum(["totp", "email", "sms"]),
        token: z.string().optional(),
      })
    ),
    defaultValues: {
      contact: user.email || user.phoneNumber || "",
      method: "totp",
      token: "",
    },
  });

  const disableOtpForm = useForm<{ token: string }>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { token: "" },
  });

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    setIsPasswordLoading(true);
    try {
      await authService.changePassword(data, session?.accessToken);
      toast({
        title: "Success",
        description: "Password updated successfully!",
        duration: 3000,
      });
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const onTwoFactorSetupSubmit = async (data: {
    contact: string;
    method: "totp" | "email" | "sms";
    token: string;
  }) => {
    setIsTwoFactorLoading(true);
    try {
      if (data.method === "totp") {
        const res = await authService.setupMFA(
          { method: data.method },
          session?.accessToken
        );
        setMfaSetUp(res.data);
        toast({
          title: "QR Code Generated",
          description: "Scan the QR code with your authenticator app.",
          duration: 3000,
        });
      } else {
        await authService.setupMFA(
          { method: data.method, contact: data.contact },
          session?.accessToken
        );
        setTwoFactorCodeSent(true);
        setResendTimer(60);
        setResendAvailable(false);
        toast({
          title: "Code Sent",
          description: `Verification code sent to ${
            data.method === "email" ? maskEmail(data.contact) : maskPhone(data.contact)
          }`,
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${data.method === "totp" ? "generate QR code" : "send verification code"}. Please try again.`,
        duration: 3000,
      });
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const onTwoFactorVerifySubmit = async (data: {
    contact: string;
    method: "totp" | "email" | "sms";
    token: string;
  }) => {
    setIsTwoFactorLoading(true);
    try {
      const res = await authService.verifyMFASetup(
        { token: data.token, method: data.method },
        session?.accessToken
      );
      if (res.success) {
        setTwoFactorEnabled(true);
        setTwoFactorMethod(null);
        setTwoFactorCodeSent(false);
        setMfaSetUp(undefined);
        toast({
          title: "Success",
          description: "Two-factor authentication enabled successfully!",
          duration: 3000,
        });
        twoFactorSetupForm.reset({
          contact: user.email || user.phoneNumber || "",
          method: "totp",
          token: "",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const handleResendCode = async () => {
    const { contact, method } = twoFactorSetupForm.getValues();
    if (method === "totp") return;

    setIsTwoFactorLoading(true);
    try {
      await authService.resendOTP(
        { method, contact },
        session?.accessToken
      );
      setResendTimer(60);
      setResendAvailable(false);
      toast({
        title: "Code Resent",
        description: `New verification code sent to ${
          method === "email" ? maskEmail(contact) : maskPhone(contact)
        }`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const handleInitiateDisable2FA = async () => {
    setIsDisabling2FA(true);
    setResendTimer(0);
    setResendAvailable(false);
    disableOtpForm.reset();

    const currentMethod = getCurrentTwoFactorMethod();
    if (currentMethod === "email" || currentMethod === "sms") {
      await sendDisableVerificationCode(currentMethod);
    }
  };

  const sendDisableVerificationCode = async (method: "email" | "sms") => {
    setIsTwoFactorLoading(true);
    try {
      // await authService.sendMFAVerificationCode(
      //   { method, contact: method === "email" ? user.email : user.phoneNumber },
      //   session?.accessToken
      // );
      setResendTimer(60);
      setResendAvailable(false);
      toast({
        title: "Verification Code Sent",
        description: `Code sent to your ${method === "email" ? "email" : "phone"}: ${
          method === "email" ? maskEmail(user.email || "") : maskPhone(user.phoneNumber || "")
        }`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to send verification code via ${method}`,
        duration: 3000,
      });
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const handleResendDisableCode = async () => {
    const currentMethod = getCurrentTwoFactorMethod();
    if (currentMethod === "email" || currentMethod === "sms") {
      await sendDisableVerificationCode(currentMethod);
    }
  };

  const handleDisable2FASubmit = async (data: { token: string }) => {
    if (!data.token || data.token.length < 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
        duration: 3000,
      });
      return;
    }

    setIsTwoFactorLoading(true);
    try {
      const res = await authService.disableMFA(
        { token: data.token },
        session?.accessToken
      );
      setTwoFactorEnabled(false);
      setIsDisabling2FA(false);
      setResendTimer(0);
      setResendAvailable(false);
      disableOtpForm.reset();
      toast({
        title: "Success",
        description: "Two-factor authentication has been disabled",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable 2FA. Please check your code and try again.",
        duration: 3000,
      });
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const handleCancelDisable = () => {
    setIsDisabling2FA(false);
    setResendTimer(0);
    setResendAvailable(false);
    disableOtpForm.reset();
  };

  const getDisableLabelText = () => {
    const currentMethod = getCurrentTwoFactorMethod();
    switch (currentMethod) {
      case "totp":
        return "Enter the 6-digit code from your authenticator app";
      case "email":
        return `Enter the 6-digit code sent to ${maskEmail(user.email || "")}`;
      case "sms":
        return `Enter the 6-digit code sent to ${maskPhone(user.phoneNumber || "")}`;
      default:
        return "Enter 6-digit verification code";
    }
  };

  const phoneSendForm = useForm<PhoneSendFormData>({
    resolver: zodResolver(phoneSendSchema),
    defaultValues: {
      phoneNumber: user.phoneNumber || "",
    },
  });

  const phoneVerificationForm = useForm<PhoneVerificationFormData>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phoneCode: "",
    },
  });

  const emailSendForm = useForm<EmailSendFormData>({
    resolver: zodResolver(emailSendSchema),
    defaultValues: {
      email: user.email || "",
    },
  });

  const emailVerificationForm = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      emailCode: "",
    },
  });

  const onPhoneSendSubmit = async (data: { phoneNumber: string }) => {
    setIsPhoneLoading(true);
    try {
      // await authService.sendPhoneVerification(data, session?.accessToken);
      setPhoneCodeSent(true);
      toast({
        title: "Code Sent",
        description: `Verification code sent to ${maskPhone(data.phoneNumber)}`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code.",
        duration: 3000,
      });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const onPhoneVerificationSubmit = async (data: { phoneCode: string }) => {
    setIsPhoneLoading(true);
    try {
      // await authService.verifyPhone(data, session?.accessToken);
      setPhoneVerified(true);
      setPhoneCodeSent(false);
      phoneVerificationForm.reset();
      toast({
        title: "Success",
        description: "Phone number verified successfully!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code.",
        duration: 3000,
      });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleDisablePhoneVerification = async () => {
    setIsPhoneLoading(true);
    try {
      // await authService.disablePhoneVerification(session?.accessToken);
      setPhoneVerified(false);
      setPhoneCodeSent(false);
      toast({
        title: "Success",
        description: "Phone verification disabled.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable phone verification.",
        duration: 3000,
      });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const onEmailSendSubmit = async (data: { email: string }) => {
    setIsEmailLoading(true);
    try {
      await authService.sendEmailVerification(session?.accessToken);
      setEmailCodeSent(true);
      toast({
        title: "Code Sent",
        description: `Verification ${emailVerificationMethod === "link" ? "link" : "code"} sent to ${maskEmail(data.email)}`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification.",
        duration: 3000,
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const onEmailVerificationSubmit = async (data: { emailCode: string }) => {
    setIsEmailLoading(true);
    try {
      // await authService.verifyEmail(data, session?.accessToken);
      setEmailVerified(true);
      setEmailCodeSent(false);
      setEmailVerificationMethod(null);
      emailVerificationForm.reset();
      toast({
        title: "Success",
        description: "Email verified successfully!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code.",
        duration: 3000,
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleDisableEmailVerification = async () => {
    setIsEmailLoading(true);
    try {
      // await authService.disableEmailVerification(session?.accessToken);
      setEmailVerified(false);
      setEmailCodeSent(false);
      setEmailVerificationMethod(null);
      toast({
        title: "Success",
        description: "Email verification disabled.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable email verification.",
        duration: 3000,
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const mockLoginHistory = [
    {
      device: "Chrome on Windows",
      location: "New York, US",
      time: "2 hours ago",
      status: "success",
    },
    {
      device: "Safari on iPhone",
      location: "New York, US",
      time: "1 day ago",
      status: "success",
    },
    {
      device: "Chrome on Mac",
      location: "Los Angeles, US",
      time: "3 days ago",
      status: "failed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  {...passwordForm.register("currentPassword")}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...passwordForm.register("newPassword")}
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...passwordForm.register("confirmPassword")}
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPasswordLoading}>
                {isPasswordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
            {twoFactorEnabled ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Enabled
              </Badge>
            ) : (
              <Badge variant="outline">Disabled</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account with 2FA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {twoFactorEnabled ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Two-Factor Authentication is Enabled
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your account is protected with an additional security layer using{" "}
                    {getCurrentTwoFactorMethod() === "totp"
                      ? "an authenticator app"
                      : getCurrentTwoFactorMethod() === "email"
                      ? `email (${maskEmail(user.email || "")})`
                      : `SMS (${maskPhone(user.phoneNumber || "")})`}
                  </p>
                </div>
              </div>

              {!isDisabling2FA ? (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handleInitiateDisable2FA}
                    disabled={isTwoFactorLoading}
                  >
                    Disable 2FA
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Disable Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {getDisableLabelText()}
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={disableOtpForm.handleSubmit(handleDisable2FASubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="disableToken">Verification Code</Label>
                      <Input
                        id="disableToken"
                        {...disableOtpForm.register("token")}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="text-center text-lg font-mono tracking-widest"
                      />
                      {disableOtpForm.formState.errors.token && (
                        <p className="text-sm text-destructive">
                          {disableOtpForm.formState.errors.token.message}
                        </p>
                      )}

                      {getCurrentTwoFactorMethod() !== "totp" && resendTimer === 0 && (
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                            Verification code sent
                          </div>
                        </div>
                      )}
                    </div>

                    {getCurrentTwoFactorMethod() !== "totp" && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleResendDisableCode}
                          disabled={!resendAvailable || isTwoFactorLoading}
                          className="text-xs"
                        >
                          {resendTimer > 0 ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Resend in {resendTimer}s
                            </div>
                          ) : (
                            "Resend Code"
                          )}
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelDisable}
                        disabled={isTwoFactorLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={
                          isTwoFactorLoading ||
                          !disableOtpForm.watch("token") ||
                          disableOtpForm.watch("token").length < 6
                        }
                      >
                        {isTwoFactorLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Disabling...
                          </>
                        ) : (
                          "Disable 2FA"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <>
              {!twoFactorMethod ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Enable Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Choose a method to set up two-factor authentication
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <Button
                      variant={twoFactorMethod === "totp" ? "default" : "outline"}
                      onClick={() => {
                        twoFactorSetupForm.setValue("method", "totp");
                        twoFactorSetupForm.setValue("contact", "");
                        setTwoFactorMethod("totp");
                        onTwoFactorSetupSubmit({ method: "totp", contact: "", token: "" });
                      }}
                      disabled={isTwoFactorLoading}
                    >
                      Authenticator App
                    </Button>
                    <Button
                      variant={twoFactorMethod === "email" ? "default" : "outline"}
                      onClick={() => {
                        twoFactorSetupForm.setValue("method", "email");
                        twoFactorSetupForm.setValue("contact", user.email || "");
                        setTwoFactorMethod("email");
                      }}
                      disabled={isTwoFactorLoading || !user.email}
                    >
                      Email OTP
                    </Button>
                    <Button
                      variant={twoFactorMethod === "sms" ? "default" : "outline"}
                      onClick={() => {
                        twoFactorSetupForm.setValue("method", "sms");
                        twoFactorSetupForm.setValue("contact", user.phoneNumber || "");
                        setTwoFactorMethod("sms");
                      }}
                      disabled={isTwoFactorLoading || !user.phoneNumber}
                    >
                      Phone OTP
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={twoFactorSetupForm.handleSubmit(
                    twoFactorCodeSent || twoFactorMethod === "totp"
                      ? onTwoFactorVerifySubmit
                      : onTwoFactorSetupSubmit
                  )}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    {twoFactorMethod === "totp" ? (
                      <QrCode className="h-5 w-5 text-yellow-600 mt-0.5" />
                    ) : twoFactorMethod === "email" ? (
                      <Mail className="h-5 w-5 text-yellow-600 mt-0.5" />
                    ) : (
                      <Phone className="h-5 w-5 text-yellow-600 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        {twoFactorCodeSent || twoFactorMethod === "totp"
                          ? `Verify 2FA (${twoFactorMethod.toUpperCase()})`
                          : `Set Up 2FA (${twoFactorMethod.toUpperCase()})`}
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {twoFactorMethod === "totp"
                          ? "Scan the QR code or enter the setup key in your authenticator app, then enter the 6-digit code."
                          : twoFactorCodeSent
                          ? `Enter the 6-digit code sent to ${
                              twoFactorMethod === "email"
                                ? maskEmail(twoFactorSetupForm.watch("contact"))
                                : maskPhone(twoFactorSetupForm.watch("contact"))
                            }`
                          : `Enter your ${
                              twoFactorMethod === "email" ? "email address" : "phone number"
                            } to receive a verification code.`}
                      </p>
                    </div>
                  </div>

                  {twoFactorMethod !== "totp" && !twoFactorCodeSent && (
                    <div className="space-y-2">
                      <Label htmlFor="contact">
                        {twoFactorMethod === "email" ? "Email Address" : "Phone Number"}
                      </Label>
                      <Input
                        id="contact"
                        disabled={true}
                        {...twoFactorSetupForm.register("contact")}
                        placeholder={
                          twoFactorMethod === "email"
                            ? "Enter your email address"
                            : "Enter your phone number"
                        }
                      />
                      {twoFactorSetupForm.formState.errors.contact && (
                        <p className="text-sm text-destructive">
                          {twoFactorSetupForm.formState.errors.contact.message}
                        </p>
                      )}
                    </div>
                  )}

                  {twoFactorMethod === "totp" && mfaSetUp && mfaSetUp.method === "totp" && (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <Image
                          src={mfaSetUp.qrCode || ""}
                          width={200}
                          height={200}
                          alt="Authenticator QR Code"
                          className="w-48 h-48 border rounded-lg"
                        />
                      </div>
                      <p className="text-sm font-mono text-center">
                        Setup Key: {mfaSetUp.manualEntryKey || "XXXX-XXXX-XXXX-XXXX"}
                      </p>
                    </div>
                  )}

                  {(twoFactorCodeSent || twoFactorMethod === "totp") && (
                    <div className="space-y-2">
                      <Label htmlFor="token">Verification Code</Label>
                      <Input
                        id="token"
                        {...twoFactorSetupForm.register("token")}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="text-center text-lg font-mono tracking-widest"
                      />
                      {twoFactorSetupForm.formState.errors.token && (
                        <p className="text-sm text-destructive">
                          {twoFactorSetupForm.formState.errors.token.message}
                        </p>
                      )}
                    </div>
                  )}

                  {twoFactorCodeSent && twoFactorMethod !== "totp" && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendCode}
                        disabled={!resendAvailable || isTwoFactorLoading}
                        className="text-xs"
                      >
                        {resendTimer > 0 ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Resend in {resendTimer}s
                          </div>
                        ) : (
                          "Resend Code"
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTwoFactorMethod(null);
                        setTwoFactorCodeSent(false);
                        setMfaSetUp(undefined);
                        twoFactorSetupForm.reset({
                          contact: user.email || user.phoneNumber || "",
                          method: "totp",
                          token: "",
                        });
                      }}
                      disabled={isTwoFactorLoading}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isTwoFactorLoading ||
                        (twoFactorMethod !== "totp" &&
                          !twoFactorCodeSent &&
                          !twoFactorSetupForm.watch("contact")) ||
                        ((twoFactorCodeSent || twoFactorMethod === "totp") &&
                          (!twoFactorSetupForm.watch("token") ||
                            twoFactorSetupForm.watch("token").length < 6))
                      }
                    >
                      {isTwoFactorLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {twoFactorCodeSent || twoFactorMethod === "totp" ? "Verifying..." : "Sending..."}
                        </>
                      ) : twoFactorCodeSent || twoFactorMethod === "totp" ? (
                        "Verify 2FA"
                      ) : (
                        "Send Code"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Verification
            {emailVerified ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Verified
              </Badge>
            ) : (
              <Badge variant="outline">Not Verified</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Verify your email address to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailVerified ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Email Address Verified
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your email address is verified for enhanced security
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleDisableEmailVerification}
                  disabled={isEmailLoading}
                >
                  {isEmailLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disabling...
                    </>
                  ) : (
                    "Disable Email Verification"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {!emailCodeSent ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Send Email Verification
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Choose to receive a verification link or code to your email
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={emailSendForm.handleSubmit(onEmailSendSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        {...emailSendForm.register("email")}
                        placeholder="Enter your email address"
                      />
                      {emailSendForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {emailSendForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={emailVerificationMethod === "link" ? "default" : "outline"}
                        onClick={() => setEmailVerificationMethod("link")}
                        disabled={isEmailLoading}
                      >
                        Send Verification Link
                      </Button>
                      <Button
                        type="button"
                        variant={emailVerificationMethod === "otp" ? "default" : "outline"}
                        onClick={() => setEmailVerificationMethod("otp")}
                        disabled={isEmailLoading}
                      >
                        Send Verification Code
                      </Button>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isEmailLoading || !emailVerificationMethod}
                      >
                        {isEmailLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <form
                  onSubmit={emailVerificationForm.handleSubmit(onEmailVerificationSubmit)}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Verify Your Email Address
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {emailVerificationMethod === "link"
                          ? "Click the verification link sent to your email"
                          : `Enter the 6-digit code sent to ${maskEmail(emailSendForm.watch("email"))}`}
                      </p>
                    </div>
                  </div>

                  {emailVerificationMethod === "otp" && (
                    <div className="space-y-2">
                      <Label htmlFor="emailCode">Verification Code</Label>
                      <Input
                        id="emailCode"
                        {...emailVerificationForm.register("emailCode")}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                      {emailVerificationForm.formState.errors.emailCode && (
                        <p className="text-sm text-destructive">
                          {emailVerificationForm.formState.errors.emailCode.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmailCodeSent(false);
                        setEmailVerificationMethod(null);
                      }}
                      disabled={isEmailLoading}
                    >
                      Back
                    </Button>
                    {emailVerificationMethod === "otp" && (
                      <Button type="submit" disabled={isEmailLoading}>
                        {isEmailLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </>)}
        </CardContent>
      </Card>

      {/* Phone Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Verification
            {phoneVerified ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Verified
              </Badge>
            ) : (
              <Badge variant="outline">Not Verified</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Verify your phone number to enhance account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          {phoneVerified ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Phone Number Verified
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your phone number is verified for enhanced security
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleDisablePhoneVerification}
                  disabled={isPhoneLoading}
                >
                  {isPhoneLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disabling...
                    </>
                  ) : (
                    "Disable Phone Verification"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {!phoneCodeSent ? (
                <form
                  onSubmit={phoneSendForm.handleSubmit(onPhoneSendSubmit)}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Send Phone Verification Code
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Enter your phone number to receive a verification code
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      {...phoneSendForm.register("phoneNumber")}
                      placeholder="Enter your phone number"
                    />
                    {phoneSendForm.formState.errors.phoneNumber && (
                      <p className="text-sm text-destructive">
                        {phoneSendForm.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPhoneLoading}>
                      {isPhoneLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={phoneVerificationForm.handleSubmit(onPhoneVerificationSubmit)}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Verify Your Phone Number
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Enter the 6-digit code sent to {maskPhone(phoneSendForm.watch("phoneNumber"))}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneCode">Verification Code</Label>
                    <Input
                      id="phoneCode"
                      {...phoneVerificationForm.register("phoneCode")}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                    {phoneVerificationForm.formState.errors.phoneCode && (
                      <p className="text-sm text-destructive">
                        {phoneVerificationForm.formState.errors.phoneCode.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPhoneCodeSent(false)}
                      disabled={isPhoneLoading}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isPhoneLoading}>
                      {isPhoneLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Phone"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
          <CardDescription>
            Monitor your recent login attempts and sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 h-80 overflow-auto">
            {user.loginHistory.map((login:any, index:number) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-sm capitalize">{login.device.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {login.location.city}, {login.location.country} •  {formatDistanceToNow(new Date(login.loginTime), { addSuffix: true })}
                      <br></br>
                       Device ID:  {login.deviceId}  •    Ip Address: {login.ipAddress}
                    </p>
                  </div>
                  <Badge
                
                    variant={login.successful === true ? "secondary" : "destructive"}
                  >
                    {login.successful === true ? "Success" : "Failed"}
                  </Badge>
                </div>
                {index < user.loginHistory.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}