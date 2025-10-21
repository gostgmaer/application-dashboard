"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProflileSecurity, useUserData } from "@/hooks/use-user-settings";
import { userApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Shield,
  Key,
  Smartphone,
  QrCode,
  Copy,
  CircleCheck as CheckCircle,
  Loader as Loader2,
  Eye,
  EyeOff,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { ActivitySettings } from "./activity-settings";
import { SocialSettings } from "./social-settings";
import { DevicesSettings } from "./devices-settings";
import Image from "next/image";
import authService from "@/lib/http/authService";
import { useSession } from "next-auth/react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

const otpVerificationSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP must be at most 6 digits"),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type PhoneForm = z.infer<typeof phoneSchema>;
type OTPVerificationForm = z.infer<typeof otpVerificationSchema>;

export function SecuritySettings() {
  const { updateUser, profile } = useUserData();
  const {
    fetchActiveSession,
    fetchActivityLogs,
    fetchConnections,
    fetchDevices,
    fetchLoginHistory,
    fetchSecurityLogs,
    updateDeviceTrust,
    logoutAllDevices,
    logoutDevice,
    disconnectSocial,
    connectSocial,
    devices,
    connections,
    loading,
    loginHistory,
    securityLogs,
    activityLogs,
    activeSessions,
    twoFa,
    fetchTwoFA,
  } = useProflileSecurity();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { data: session } = useSession();
  console.log("session: ", session);

  // TOTP States
  const [totpSetup, setTotpSetup] = useState<any>(null);
  const [totpSetupStep, setTotpSetupStep] = useState<
    "setup" | "confirm" | null
  >(null);
  const [totpCode, setTotpCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // OTP States
  const [smsSetupDialog, setSmsSetupDialog] = useState(false);
  const [emailSetupDialog, setEmailSetupDialog] = useState(false);
  const [otpVerificationDialog, setOtpVerificationDialog] = useState(false);
  const [currentOtpType, setCurrentOtpType] = useState<"sms" | "email" | null>(
    null
  );
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Forms
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: profile?.phoneNumber || "",
    },
  });

  const otpForm = useForm<OTPVerificationForm>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  const getSetting = async () => {
    phoneForm.reset({
      phoneNumber: profile?.phoneNumber || "",
    });
    phoneForm.reset({
      phoneNumber: profile?.phoneNumber || "",
    });
  };

  useEffect(() => {
    getSetting();
  }, [profile]);
  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Password change
  const onPasswordSubmit = async (data: PasswordForm) => {
    setActionLoading("password");
    try {
      const response = await authService.changePassword(
        data,
        session?.accessToken
      );
      if (response.success) {
        toast.success("Password changed successfully");
        passwordForm.reset();
      }
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setActionLoading(null);
    }
  };

  // TOTP Functions
  const setupTOTP = async () => {
    setActionLoading("totp-setup");
    try {
      const response = await authService.setupMFA(
        { method: "totp" },
        session?.accessToken
      );
      if (response.success && response.data) {
        setTotpSetup(response.data);
        setTotpSetupStep("setup");
        setBackupCodes(response.data.backupCodes);
      }
    } catch (error) {
      toast.error("Failed to setup 2FA");
    } finally {
      setActionLoading(null);
    }
  };

  const confirmTOTP = async () => {
    setActionLoading("totp-confirm");
    try {
      const response = await authService.verifyMFASetup(
        totpCode,
        session?.accessToken
      );
      if (response.success) {
        toast.success("2FA enabled successfully");
        setTotpSetupStep(null);
        setTotpCode("");
        updateUser({ totpEnabled: true } as any);
      }
    } catch (error) {
      toast.error("Invalid code, please try again");
    } finally {
      setActionLoading(null);
    }
  };

  const disableTOTP = async () => {
    setActionLoading("totp-disable");
    try {
      const response = await authService.disableMFA(
        "password",
        session?.accessToken
      );
      if (response.success) {
        toast.success("2FA disabled successfully");
        updateUser({ totpEnabled: false } as any);
      }
    } catch (error) {
      toast.error("Failed to disable 2FA");
    } finally {
      setActionLoading(null);
    }
  };

  // SMS OTP Functions
  const setupSmsOtp = async (data: PhoneForm) => {
    setActionLoading("sms-setup");
    try {
      const response = await authService.setupMFA(
        { method: "sms" },
        session?.accessToken
      );
      if (response.success) {
        setCurrentOtpType("sms");
        setOtpSent(true);
        setResendCooldown(60);
        setSmsSetupDialog(false);
        setOtpVerificationDialog(true);
        toast.success("OTP sent to your phone number");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to setup SMS OTP");
    } finally {
      setActionLoading(null);
    }
  };

  const enableSmsOtp = async () => {
    if (!profile?.phoneNumber) {
      setSmsSetupDialog(true);
      return;
    }

    setActionLoading("sms-enable");
    try {
      const response = await authService.setupMFA(
        { method: "sms" },
        session?.accessToken
      );
      if (response.success) {
        setCurrentOtpType("sms");
        setOtpSent(true);
        setResendCooldown(60);
        setOtpVerificationDialog(true);
        toast.success("OTP sent to your phone number");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send SMS OTP");
    } finally {
      setActionLoading(null);
    }
  };

  const disableSmsOtp = async () => {
    setActionLoading("sms-disable");
    try {
      const response = await authService.disableMFA(
        { method: "sms" },
        session?.accessToken
      );
      if (response.success) {
        updateUser({ smsOtpEnabled: false } as any);
        toast.success("SMS OTP disabled successfully");
      }
    } catch (error) {
      toast.error("Failed to disable SMS OTP");
    } finally {
      setActionLoading(null);
    }
  };

  // Email OTP Functions
  const enableEmailOtp = async () => {
    setActionLoading("email-enable");
    try {
      const response = await authService.setupMFA(
        { method: "email" },
        session?.accessToken
      );
      if (response.success) {
        setCurrentOtpType("email");
        setOtpSent(true);
        setResendCooldown(60);
        setOtpVerificationDialog(true);
        toast.success("OTP sent to your email address");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send Email OTP");
    } finally {
      setActionLoading(null);
    }
  };

  const disableEmailOtp = async () => {
    setActionLoading("email-disable");
    try {
      const response = await authService.disableMFA(
        { method: "email" },
        session?.accessToken
      );
      if (response.success) {
        updateUser({ emailOtpEnabled: false } as any);
        toast.success("Email OTP disabled successfully");
      }
    } catch (error) {
      toast.error("Failed to disable Email OTP");
    } finally {
      setActionLoading(null);
    }
  };

  // OTP Verification
  const verifyOtp = async (data: OTPVerificationForm) => {
    setActionLoading("otp-verify");
    try {
      const response = await authService.verifyMFASetup(
        { token: data.otp, method: currentOtpType },
        session?.accessToken
      );
      if (response.success) {
        const updateData =
          currentOtpType === "sms"
            ? { smsOtpEnabled: true }
            : { emailOtpEnabled: true };
        fetchTwoFA();
        setOtpVerificationDialog(false);
        setOtpSent(false);
        setCurrentOtpType(null);
        otpForm.reset();
        toast.success(
          `${currentOtpType?.toUpperCase()} OTP enabled successfully`
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP code");
    } finally {
      setActionLoading(null);
    }
  };

  console.log(twoFa);

  const resendOtp = async () => {
    if (resendCooldown > 0 || !currentOtpType) return;

    setActionLoading("otp-resend");
    try {
      const contact =
        currentOtpType === "sms" ? profile?.phoneNumber : profile?.email;
      // const response = await userApi.sendOtp(currentOtpType, contact);
      // if (response.success) {
      //   setResendCooldown(60);
      //   toast.success('OTP resent successfully');
      // }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account security and authentication methods
        </p>
      </div>

      {/* Password */}
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
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
                  type={showPasswords.current ? "text" : "password"}
                  {...passwordForm.register("currentPassword")}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
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
                    type={showPasswords.new ? "text" : "password"}
                    {...passwordForm.register("newPassword")}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    {...passwordForm.register("confirmPassword")}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
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

            <Button
              type="submit"
              disabled={
                actionLoading === "password" ||
                passwordForm.formState.isSubmitting
              }
            >
              {actionLoading === "password" && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* TOTP */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">
                  Use Google Authenticator or similar apps
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  twoFa?.enabled && twoFa?.preferredMethod == "totp"
                    ? "default"
                    : "secondary"
                }
              >
                {twoFa?.enabled && twoFa?.preferredMethod == "totp"
                  ? "Enabled"
                  : "Disabled"}
              </Badge>
              {twoFa?.enabled && twoFa?.preferredMethod == "totp" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={actionLoading === "totp-disable"}
                  onClick={disableTOTP}
                >
                  {actionLoading === "totp-disable" && (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  )}
                  Disable
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      disabled={actionLoading === "totp-setup"}
                      onClick={setupTOTP}
                    >
                      {actionLoading === "totp-setup" && (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      )}
                      Setup
                    </Button>
                  </DialogTrigger>
                  {totpSetup && (
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Setup Two-Factor Authentication
                        </DialogTitle>
                        <DialogDescription>
                          Scan the QR code with your authenticator app
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        {totpSetupStep === "setup" && (
                          <>
                            <div className="flex justify-center">
                              <div className="p-4 bg-white rounded-lg">
                                <Image
                                  src={totpSetup.qrCode}
                                  width={200}
                                  height={200}
                                  alt="QR Code"
                                  className="w-48 h-48"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Manual Entry Key</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={totpSetup.manualEntryKey}
                                  readOnly
                                  className="font-mono text-sm"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(totpSetup.manualEntryKey)
                                  }
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="totpCode">
                                Verification Code
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  id="totpCode"
                                  placeholder="Enter 6-digit code"
                                  value={totpCode}
                                  onChange={(e) => setTotpCode(e.target.value)}
                                  maxLength={6}
                                />
                                <Button
                                  onClick={confirmTOTP}
                                  disabled={
                                    totpCode.length !== 6 ||
                                    actionLoading === "totp-confirm"
                                  }
                                >
                                  {actionLoading === "totp-confirm" && (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  )}
                                  Verify
                                </Button>
                              </div>
                            </div>

                            {/* {backupCodes.length > 0 && (
                              <div className="space-y-2">
                                <Label>Backup Codes</Label>
                                <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                                  {backupCodes.map((code, index) => (
                                    <code
                                      key={index}
                                      className="text-sm font-mono"
                                    >
                                      {code}
                                    </code>
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Save these backup codes in a secure location.
                                  Each can only be used once.
                                </p>
                              </div>
                            )} */}
                          </>
                        )}
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              )}
            </div>
          </div>

          <Separator />

          {/* SMS OTP */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">SMS Authentication</p>
                <p className="text-sm text-muted-foreground">
                  {profile.phoneNumber
                    ? `Receive OTP codes at ${profile.phoneNumber}`
                    : "Receive OTP codes via SMS"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  twoFa?.enabled && twoFa?.preferredMethod == "sms"
                    ? "default"
                    : "secondary"
                }
              >
                {twoFa?.enabled && twoFa?.preferredMethod == "sms"
                  ? "Enabled"
                  : "Disabled"}
              </Badge>
              {twoFa?.enabled && twoFa?.preferredMethod == "sms" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={actionLoading === "sms-disable"}
                  onClick={disableSmsOtp}
                >
                  {actionLoading === "sms-disable" && (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  )}
                  Disable
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={
                    actionLoading === "sms-enable" ||
                    actionLoading === "sms-setup"
                  }
                  onClick={enableSmsOtp}
                >
                  {(actionLoading === "sms-enable" ||
                    actionLoading === "sms-setup") && (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  )}
                  Enable
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Email OTP */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Email Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Receive OTP codes at {profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  twoFa?.enabled && twoFa?.preferredMethod == "email"
                    ? "default"
                    : "secondary"
                }
              >
                {twoFa?.enabled && twoFa?.preferredMethod == "email"
                  ? "Enabled"
                  : "Disabled"}
              </Badge>
              {twoFa?.enabled && twoFa?.preferredMethod == "email" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={actionLoading === "email-disable"}
                  onClick={disableEmailOtp}
                >
                  {actionLoading === "email-disable" && (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  )}
                  Disable
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={actionLoading === "email-enable"}
                  onClick={enableEmailOtp}
                >
                  {actionLoading === "email-enable" && (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  )}
                  Enable
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <SocialSettings></SocialSettings>
      {/* <DevicesSettings></DevicesSettings> */}
      {/* <ActivitySettings></ActivitySettings> */}

      {/* SMS Setup Dialog */}
      <Dialog open={smsSetupDialog} onOpenChange={setSmsSetupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Setup SMS Authentication</DialogTitle>
            <DialogDescription>
              Enter your phone number to receive OTP codes via SMS
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={phoneForm.handleSubmit(setupSmsOtp)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex gap-2">
                <Phone className="w-5 h-5 mt-2.5 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  placeholder="+1234567890"
                  {...phoneForm.register("phoneNumber")}
                />
              </div>
              {phoneForm.formState.errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {phoneForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSmsSetupDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading === "sms-setup"}>
                {actionLoading === "sms-setup" && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Send OTP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog
        open={otpVerificationDialog}
        onOpenChange={setOtpVerificationDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Verify {currentOtpType?.toUpperCase()} OTP
            </DialogTitle>
            <DialogDescription>
              Enter the verification code sent to your{" "}
              {currentOtpType === "sms" ? "phone number" : "email address"}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={otpForm.handleSubmit(verifyOtp)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="Enter OTP code"
                {...otpForm.register("otp")}
                maxLength={6}
                className="text-center font-mono text-lg"
              />
              {otpForm.formState.errors.otp && (
                <p className="text-sm text-destructive">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={resendCooldown > 0 || actionLoading === "otp-resend"}
                onClick={resendOtp}
              >
                {actionLoading === "otp-resend" && (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                )}
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOtpVerificationDialog(false);
                    setOtpSent(false);
                    setCurrentOtpType(null);
                    otpForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading === "otp-verify"}>
                  {actionLoading === "otp-verify" && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Verify
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
