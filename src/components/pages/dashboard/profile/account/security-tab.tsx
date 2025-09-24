"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";
import {
  changePasswordSchema,
  twoFactorSchema,
  ChangePasswordFormData,
  TwoFactorFormData,
} from "@/lib/validation/account";
import { User } from "@/types/user";
// import { toast } from "sonner";
import authService from "@/helper/services/authService";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";

interface SecurityTabProps {
  user: User;
}

interface MfaSetupData {
  qrCode?: string;
  manualEntryKey?: string;
  setupUri?: string;
  method?: string;
  // other fields...
}

export default function SecurityTab({ user }: SecurityTabProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [disableStep, setDisableStep] = useState<"confirm" | "sent" | "verify">(
    "confirm"
  );
  const [disableCodeSent, setDisableCodeSent] = useState(false);

  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mfaSetUp, setMfaSetUp] = useState<MfaSetupData | undefined>(undefined);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user.twoFactorEnabled
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

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const twoFactorForm = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      token: "",
    },
  });
  const twoFactorAppForm = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      token: "",
    },
  });

  const twoFactorEmailForm = useForm<{ email: string; totpToken?: string }>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      email: user.email || "",
      totpToken: "",
    },
  });

  const twoFactorPhoneForm = useForm<{
    phoneNumber: string;
    totpToken?: string;
  }>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      phoneNumber: user.phoneNumber || "",
      totpToken: "",
    },
  });
  const phoneSendForm = useForm<{ phoneNumber: string }>({
    resolver: zodResolver(twoFactorSchema), // Simplified for demo
    defaultValues: {
      phoneNumber: user.phoneNumber || "",
    },
  });

  const phoneVerificationForm = useForm<{ phoneCode: string }>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      phoneCode: "",
    },
  });

  const emailSendForm = useForm<{ email: string }>({
    resolver: zodResolver(twoFactorSchema), // Simplified for demo
    defaultValues: {
      email: user.email || "",
    },
  });

  const emailVerificationForm = useForm<{ emailCode: string }>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      emailCode: "",
    },
  });
  // const handleSendCodeAndVerify = async (tokenInput?: string) => {
  //   if (!twoFactorMethod) {
  //     //toast.error('Select a two-factor authentication method first.');
  //     return;
  //   }

  //   setIsTwoFactorLoading(true);

  //   try {
  //     // For email or SMS, send the OTP code first if we have not sent it yet
  //     if ((twoFactorMethod === 'email' || twoFactorMethod === 'sms') && ) {
  //       // Send OTP code API
  //       const sendResponse = await fetch('/api/otp/send', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${session?.accessToken}`,
  //         },
  //         body: JSON.stringify({
  //           purpose: 'setup',
  //           method: twoFactorMethod,
  //         }),
  //       });

  //       const sendResult = await sendResponse.json();

  //       if (!sendResult.success) {
  //         throw new Error(sendResult.message || 'Failed to send verification code.');
  //       }

  //       //toast.success(`Verification code sent to your ${twoFactorMethod === 'email' ? 'email' : 'sms'}.`);
  //       setCodeSent(true);
  //       return;  // Return here to wait user entering code before verifying
  //     }

  //     // Prepare code for verification
  //     const codeToVerify = tokenInput || otpForm.getValues('token');
  //     if (!codeToVerify) {
  //       //toast.error('Enter the verification code.');
  //       setIsTwoFactorLoading(false);
  //       return;
  //     }

  //     // Verify OTP API
  //     const verifyResponse = await fetch('/api/otp/verify', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${session?.accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         code: codeToVerify,
  //         purpose: 'setup',
  //       }),
  //     });

  //     const verifyResult = await verifyResponse.json();

  //     if (verifyResult.success) {
  //       //toast.success('Two-factor authentication enabled successfully!');
  //       setTwoFactorEnabled(true);
  //       setTwoFactorMethod(null);
  //       setCodeSent(false);
  //       setOtpSetupData(null);
  //       otpForm.reset();

  //       if (verifyResult.data?.backupCodes) {
  //         //toast.success(`Backup codes generated: ${verifyResult.data.backupCodes.length} codes saved`);
  //       }
  //     } else {
  //       throw new Error(verifyResult.message || 'Invalid verification code.');
  //     }
  //   } catch (error) {
  //     console.error('Send/Verify OTP error:', error);
  //     //toast.error(error.message || 'Failed to send or verify OTP. Please try again.');
  //   } finally {
  //     setIsTwoFactorLoading(false);
  //   }
  // };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    setIsPasswordLoading(true);
    try {
      // await new Promise(resolve => setTimeout(resolve, 1500))
      await authService.changePassword(data, session?.accessToken);
      console.log("Password changed:", data);
      // //toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (error) {
      // //toast.error("Failed to update password. Please try again.");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const onTwoFactorAppSubmit = async (e: any) => {
    setIsTwoFactorLoading(true);
    try {
      setTwoFactorMethod(e);
      const res = await authService.setupMFA(
        { method: e },
        session?.accessToken
      );
      setMfaSetUp(res.data);
      // console.log("2FA app setup:", res);
      // setTwoFactorEnabled(true);
      // setTwoFactorMethod(null);
      // setTwoFactorCodeSent(false);
      // //toast.success(res.message);
      toast({
        title: res.message,
        duration: 3000,
      });
      // twoFactorAppForm.reset();
    } catch (error) {
      // //toast.error(
      //   "Failed to setup two-factor authentication. Please try again."
      // );
    } finally {
      setIsTwoFactorLoading(false);
    }
  };
  const onTwoFactorAppVerifySubmit = async (data: TwoFactorFormData) => {
    setIsTwoFactorLoading(true);
    try {
      const res = await authService.verifyMFASetup(data, session?.accessToken);
      console.log("RES:", res);
      if (res.success) {
        setTwoFactorEnabled(true);
        setTwoFactorMethod(null);
        setTwoFactorCodeSent(false);
        toast({
          title: res.message,
          duration: 3000,
        });
      }

      // //toast.success("Two-factor authentication enabled via app!");
      twoFactorAppForm.reset();
    } catch (error) {
      // //toast.error(
      //   "Failed to setup two-factor authentication. Please try again."
      // );
    } finally {
      setIsTwoFactorLoading(false);
    }
  };
  const onTwoFactorEmailSendSubmit = async (data: { email: string }) => {
    setIsTwoFactorLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("2FA email code sent to:", data.email);
      setTwoFactorCodeSent(true);
      //toast.success("Verification code sent to your email!");
    } catch (error) {
      //toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const onTwoFactorEmailVerifySubmit = async (data: {
    email: string;
    totpToken?: string;
  }) => {
    setIsTwoFactorLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("2FA email verification:", data);
      setTwoFactorEnabled(true);
      setTwoFactorMethod(null);
      setTwoFactorCodeSent(false);
      //toast.success("Two-factor authentication enabled via email!");
      twoFactorEmailForm.reset();
    } catch (error) {
      //toast.error("Failed to verify 2FA email code. Please try again.");
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const onTwoFactorPhoneSendSubmit = async (data: { phoneNumber: string }) => {
    setIsTwoFactorLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("2FA phone code sent to:", data.phoneNumber);
      setTwoFactorCodeSent(true);
      //toast.success("Verification code sent to your phone!");
    } catch (error) {
      //toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const onTwoFactorPhoneVerifySubmit = async (data: {
    phoneNumber: string;
    totpToken?: string;
  }) => {
    setIsTwoFactorLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("2FA phone verification:", data);
      setTwoFactorEnabled(true);
      setTwoFactorMethod(null);
      setTwoFactorCodeSent(false);
      //toast.success("Two-factor authentication enabled via phone!");
      twoFactorPhoneForm.reset();
    } catch (error) {
      //toast.error("Failed to verify 2FA phone code. Please try again.");
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setIsTwoFactorLoading(true);
    try {
      const res = await authService.disableMFA(session?.accessToken);
      if (res.success) {
        setTwoFactorEnabled(false);
        setTwoFactorMethod(null);
        setTwoFactorCodeSent(false);
        toast({
          title: res.message,
          duration: 3000,
        });
      }

      //toast.success("Two-factor authentication disabled");
    } catch (error) {
      //toast.error("Failed to disable two-factor authentication");
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const onPhoneSendSubmit = async (data: { phoneNumber: string }) => {
    setIsPhoneLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Phone code sent to:", data.phoneNumber);
      setPhoneCodeSent(true);
      //toast.success("Verification code sent to your phone!");
    } catch (error) {
      //toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const onPhoneVerificationSubmit = async (data: { phoneCode: string }) => {
    setIsPhoneLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Phone verification:", data);
      setPhoneVerified(true);
      setPhoneCodeSent(false);
      //toast.success("Phone number verified successfully!");
      phoneVerificationForm.reset();
    } catch (error) {
      //toast.error("Failed to verify phone number. Please try again.");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleDisablePhoneVerification = async () => {
    setIsPhoneLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPhoneVerified(false);
      setPhoneCodeSent(false);
      //toast.success("Phone verification disabled");
    } catch (error) {
      //toast.error("Failed to disable phone verification");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const onEmailSendSubmit = async (data: { email: string }) => {
    setIsEmailLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(
        `${
          emailVerificationMethod === "link"
            ? "Verification link"
            : "Verification code"
        } sent to:`,
        data.email
      );
      setEmailCodeSent(true);
      // //toast.success(
      //   `${
      //     emailVerificationMethod === "link"
      //       ? "Verification link"
      //       : "Verification code"
      //   } sent to your email!`
      // );
    } catch (error) {
      // //toast.error(
      //   `Failed to send ${
      //     emailVerificationMethod === "link" ? "verification link" : "code"
      //   }. Please try again.`
      // );
    } finally {
      setIsEmailLoading(false);
    }
  };

  const onEmailVerificationSubmit = async (data: { emailCode: string }) => {
    setIsEmailLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Email verification:", data);
      setEmailVerified(true);
      setEmailCodeSent(false);
      setEmailVerificationMethod(null);
      //toast.success("Email verified successfully!");
      emailVerificationForm.reset();
    } catch (error) {
      //toast.error("Failed to verify email. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleDisableEmailVerification = async () => {
    setIsEmailLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmailVerified(false);
      setEmailCodeSent(false);
      setEmailVerificationMethod(null);
      //toast.success("Email verification disabled");
    } catch (error) {
      //toast.error("Failed to disable email verification");
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

  // const handleDisable2FA = async (token?: string) => {
  //   setIsTwoFactorLoading(true);
  //   try {
  //     // If email/SMS and we haven’t sent code yet
  //     if (
  //       (twoFactorMethod === "email" || twoFactorMethod === "sms") &&
  //       !disableCodeSent
  //     ) {
  //       const sendRes = await fetch("/api/otp/send", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${session?.accessToken}`,
  //         },
  //         body: JSON.stringify({
  //           purpose: "disable_otp",
  //           method: twoFactorMethod,
  //         }),
  //       });
  //       const sendResult = await sendRes.json();
  //       if (!sendResult.success) throw new Error(sendResult.message);
  //       toast.success(`Confirmation code sent via ${twoFactorMethod}`);
  //       setDisableCodeSent(true);
  //       return;
  //     }

  //     // Verify token
  //     const code = token || otpForm.getValues("token");
  //     if (!code) {
  //       toast.error("Enter the confirmation code");
  //       return;
  //     }

  //     const verifyRes = await fetch("/api/otp/verify", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session?.accessToken}`,
  //       },
  //       body: JSON.stringify({ code, purpose: "disable_otp" }),
  //     });
  //     const verifyResult = await verifyRes.json();
  //     if (!verifyResult.success) throw new Error(verifyResult.message);

  //     // Finally disable via dedicated API
  //     const disableRes = await fetch("/api/otp/disable", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session?.accessToken}`,
  //       },
  //       body: JSON.stringify({ confirmationCode: code }),
  //     });
  //     const disableResult = await disableRes.json();
  //     if (!disableResult.success) throw new Error(disableResult.message);

  //     // Success
  //     setTwoFactorEnabled(false);
  //     // toast.success("Two-factor authentication disabled");
  //     // Reset disable flow state
  //     setDisableStep("confirm");
  //     setDisableCodeSent(false);
  //     otpForm.reset();
  //   } catch (err: any) {
  //     toast.error(err.message || "Failed to disable 2FA");
  //   } finally {
  //     setIsTwoFactorLoading(false);
  //   }
  // };

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
                    Your account is protected with an additional security layer
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleDisableTwoFactor}
                  disabled={isTwoFactorLoading}
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
                      variant={
                        twoFactorMethod === "totp" ? "default" : "outline"
                      }
                      onClick={() => onTwoFactorAppSubmit("totp")}
                      disabled={isTwoFactorLoading}
                    >
                      Authenticator App
                    </Button>
                    <Button
                      variant={
                        twoFactorMethod === "email" ? "default" : "outline"
                      }
                      onClick={() => setTwoFactorMethod("email")}
                      disabled={isTwoFactorLoading}
                    >
                      Email OTP
                    </Button>
                    <Button
                      variant={
                        twoFactorMethod === "sms" ? "default" : "outline"
                      }
                      onClick={() => setTwoFactorMethod("sms")}
                      disabled={isTwoFactorLoading}
                    >
                      Phone OTP
                    </Button>
                  </div>
                </div>
              ) : twoFactorMethod === "totp" ? (
                <form
                  onSubmit={twoFactorAppForm.handleSubmit(
                    onTwoFactorAppVerifySubmit
                  )}
                  className="space-y-4"
                >
                  {mfaSetUp && mfaSetUp.method == "totp" && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <QrCode className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          Set Up Authenticator App
                        </h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Scan the QR code below with an authenticator app like
                          Google Authenticator or Authy, then enter the 6-digit
                          code.
                        </p>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">
                            [Placeholder for QR Code]
                            <Image
                              src={mfaSetUp.qrCode || ""}
                              width={200}
                              height={200}
                              alt="Authenticator QR Code"
                              className="w-48 h-48 border rounded-lg"
                            />
                          </p>
                          <p className="text-sm font-mono mt-2">
                            Setup Key: XXXX-XXXX-XXXX-XXXX
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="token">Authenticator Code</Label>
                    <Input
                      id="token"
                      {...twoFactorAppForm.register("token")}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                    {twoFactorAppForm.formState.errors.token && (
                      <p className="text-sm text-destructive">
                        {twoFactorAppForm.formState.errors.token.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setTwoFactorMethod(null)}
                      disabled={isTwoFactorLoading}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isTwoFactorLoading}>
                      {isTwoFactorLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enabling...
                        </>
                      ) : (
                        "Enable 2FA"
                      )}
                    </Button>
                  </div>
                </form>
              ) : twoFactorMethod === "email" ? (
                <>
                  {!twoFactorCodeSent ? (
                    <form
                      onSubmit={twoFactorEmailForm.handleSubmit(
                        onTwoFactorEmailSendSubmit
                      )}
                      className="space-y-4"
                    >
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Mail className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Send 2FA Email Code
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Enter your email address to receive a verification
                            code
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          {...twoFactorEmailForm.register("email")}
                          placeholder="Enter your email address"
                        />
                        {twoFactorEmailForm.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {twoFactorEmailForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setTwoFactorMethod(null)}
                          disabled={isTwoFactorLoading}
                        >
                          Back
                        </Button>
                        <Button type="submit" disabled={isTwoFactorLoading}>
                          {isTwoFactorLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Code"
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={twoFactorEmailForm.handleSubmit(
                        onTwoFactorEmailVerifySubmit
                      )}
                      className="space-y-4"
                    >
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Mail className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Verify 2FA Email Code
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Enter the 6-digit code sent to your email address
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totpToken">Verification Code</Label>
                        <Input
                          id="totpToken"
                          {...twoFactorEmailForm.register("totpToken")}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                        />
                        {twoFactorEmailForm.formState.errors.totpToken && (
                          <p className="text-sm text-destructive">
                            {
                              twoFactorEmailForm.formState.errors.totpToken
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setTwoFactorCodeSent(false)}
                          disabled={isTwoFactorLoading}
                        >
                          Back
                        </Button>
                        <Button type="submit" disabled={isTwoFactorLoading}>
                          {isTwoFactorLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify 2FA"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <>
                  {!twoFactorCodeSent ? (
                    <form
                      onSubmit={twoFactorPhoneForm.handleSubmit(
                        onTwoFactorPhoneSendSubmit
                      )}
                      className="space-y-4"
                    >
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Phone className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Send 2FA Phone Code
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Enter your phone number to receive a verification
                            code
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          {...twoFactorPhoneForm.register("phoneNumber")}
                          placeholder="Enter your phone number"
                        />
                        {twoFactorPhoneForm.formState.errors.phoneNumber && (
                          <p className="text-sm text-destructive">
                            {
                              twoFactorPhoneForm.formState.errors.phoneNumber
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setTwoFactorMethod(null)}
                          disabled={isTwoFactorLoading}
                        >
                          Back
                        </Button>
                        <Button type="submit" disabled={isTwoFactorLoading}>
                          {isTwoFactorLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Code"
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={twoFactorPhoneForm.handleSubmit(
                        onTwoFactorPhoneVerifySubmit
                      )}
                      className="space-y-4"
                    >
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Phone className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Verify 2FA Phone Code
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Enter the 6-digit code sent to your phone number
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totpToken">Verification Code</Label>
                        <Input
                          id="totpToken"
                          {...twoFactorPhoneForm.register("totpToken")}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                        />
                        {twoFactorPhoneForm.formState.errors.totpToken && (
                          <p className="text-sm text-destructive">
                            {
                              twoFactorPhoneForm.formState.errors.totpToken
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setTwoFactorCodeSent(false)}
                          disabled={isTwoFactorLoading}
                        >
                          Back
                        </Button>
                        <Button type="submit" disabled={isTwoFactorLoading}>
                          {isTwoFactorLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify 2FA"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </>
          )}
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
                  onSubmit={phoneVerificationForm.handleSubmit(
                    onPhoneVerificationSubmit
                  )}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Verify Your Phone Number
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Enter the 6-digit code sent to your phone number
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
                        {
                          phoneVerificationForm.formState.errors.phoneCode
                            .message
                        }
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
                        Choose to receive a verification link or code to your
                        email
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
                        variant={
                          emailVerificationMethod === "link"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setEmailVerificationMethod("link")}
                        disabled={isEmailLoading}
                      >
                        Send Verification Link
                      </Button>
                      <Button
                        type="button"
                        variant={
                          emailVerificationMethod === "otp"
                            ? "default"
                            : "outline"
                        }
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
                  onSubmit={emailVerificationForm.handleSubmit(
                    onEmailVerificationSubmit
                  )}
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
                          : "Enter the 6-digit code sent to your email address"}
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
                          {
                            emailVerificationForm.formState.errors.emailCode
                              .message
                          }
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
          <div className="space-y-4">
            {mockLoginHistory.map((login, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{login.device}</p>
                    <p className="text-xs text-muted-foreground">
                      {login.location} • {login.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      login.status === "success" ? "secondary" : "destructive"
                    }
                  >
                    {login.status === "success" ? "Success" : "Failed"}
                  </Badge>
                </div>
                {index < mockLoginHistory.length - 1 && (
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
