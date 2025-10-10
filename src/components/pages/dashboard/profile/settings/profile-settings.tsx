"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUserData } from "@/hooks/use-user-settings";
import { userApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Camera,
  Mail,
  Phone,
  CircleCheck as CheckCircle,
  Circle as XCircle,
  Send,
  Loader as Loader2,
  Shield,
  User2,
} from "lucide-react";
import { format } from "date-fns";
import ProfileImageSection from "./image";
import { personalDetailsSchema } from "@/lib/validation/account";
import userServices from "@/lib/http/userService";
import authService from "@/lib/http/authService";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
// import { User } from  '@/types/user';

type ProfileForm = z.infer<typeof personalDetailsSchema>;

export function ProfileSettings() {
  const { user, loading, updateUser } = useUserData();

  const [verifyLoading, setVerifyLoading] = useState<"email" | "phone" | null>(
    null
  );
  const [otpStep, setOtpStep] = useState<"email" | "phone" | null>(null);
  const [otpCode, setOtpCode] = useState("");
  // const [user, setUser] = useState<User | null>(null);
  // const { data: session } = useSession();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      phoneNumber: "",
      gender: "",
      dateOfBirth: "",
    },
  });

  const getSetting = async () => {
    form.reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      gender: user?.gender || "",
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
  };

  useEffect(() => {
    getSetting();
  }, [user]);

  const onSubmit = async (data: any) => {
    const success = await updateUser(data);
    if (success) {
      form.reset(data);
    }
  };

  const sendOTP = async (type: "email" | "phone") => {
    setVerifyLoading(type);
    try {
      const response = await userApi.sendOTP(type);
      if (response.success) {
        setOtpStep(type);
        toast.success(`OTP sent to your ${type}`);
      }
    } catch (error) {
      toast.error(`Failed to send OTP to ${type}`);
    } finally {
      setVerifyLoading(null);
    }
  };

  const verifyOTP = async () => {
    if (!otpStep) return;

    try {
      const response = await userApi.verifyOTP(otpCode, otpStep);
      if (response.success) {
        toast.success(`${otpStep} verified successfully`);
        setOtpStep(null);
        setOtpCode("");
        // Update user verification status
        updateUser({
          [`${otpStep}Verified`]: true,
        } as any);
      }
    } catch (error) {
      toast.error("Invalid OTP code");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and verification status
        </p>
      </div>

      {/* Profile Picture */}
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your profile picture to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileImageSection user={user}></ProfileImageSection>
        </CardContent>
      </Card>

      {/* Account Overview */}
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>
            Your account information and verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Basic Information
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Full Name
                  </span>
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Username
                  </span>
                  <span className="font-medium font-mono text-sm">
                    @{user.username}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <span className="font-medium capitalize">
                    {user.gender
                      ? user.gender.replace("-", " ")
                      : "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Date of Birth
                  </span>
                  <span className="font-medium">
                    {user.dateOfBirth
                      ? format(new Date(user?.dateOfBirth), "MMM dd, yyyy")
                      : "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Member Since
                  </span>
                  <span className="font-medium">
                    {format(new Date(user?.createdAt), "MMM yyyy")}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Verification Status
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Email</span>
                  </div>
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Unverified
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <Badge variant={user.phoneVerified ? "default" : "secondary"}>
                    {user.phoneVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Unverified
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <Badge variant={user.isVerified ? "default" : "secondary"}>
                    {user.isVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Incomplete
                      </>
                    )}
                  </Badge>
                </div>

                {/* <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Identity</span>
                  </div>
                  <Badge variant={user.identityVerified ? "default" : "secondary"}>
                    {user.identityVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Pending
                      </>
                    )}
                  </Badge>
                </div> */}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">2FA</span>
                  </div>
                  <Badge
                    variant={
                      user.otpSettings?.enabled ? "default" : "secondary"
                    }
                  >
                    {user.otpSettings?.enabled ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Disabled
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your basic profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  disabled
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter your email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  disabled
                  id="username"
                  {...form.register("username")}
                  placeholder="Enter your username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  placeholder="Enter your first name"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  placeholder="Enter your last name"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  {...form.register("gender")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...form.register("dateOfBirth")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  placeholder="1234567890"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information & Verification */}
      <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Manage your contact details and verification status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Email address</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={user.emailVerified ? "default" : "secondary"}>
                  {user.emailVerified ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Unverified
                    </>
                  )}
                </Badge>
                {!user.emailVerified && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={verifyLoading === "email"}
                    onClick={() => sendOTP("email")}
                  >
                    {verifyLoading === "email" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-1" />
                    )}
                    Verify
                  </Button>
                )}
              </div>
            </div>

            {otpStep === "email" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex gap-2 ml-8"
              >
                <Input
                  placeholder="Enter OTP code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-32"
                />
                <Button size="sm" onClick={verifyOTP}>
                  Verify
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setOtpStep(null);
                    setOtpCode("");
                  }}
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </div>

          <Separator />

          {/* Phone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {user.phoneNumber || "Not provided"}
                  </p>
                  <p className="text-sm text-muted-foreground">Phone number</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user.phoneNumber && (
                  <Badge variant={user.phoneVerified ? "default" : "secondary"}>
                    {user.phoneVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Unverified
                      </>
                    )}
                  </Badge>
                )}
                {user.phoneNumber && !user.phoneVerified && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={verifyLoading === "phone"}
                    onClick={() => sendOTP("phone")}
                  >
                    {verifyLoading === "phone" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-1" />
                    )}
                    Verify
                  </Button>
                )}
              </div>
            </div>

            {otpStep === "phone" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex gap-2 ml-8"
              >
                <Input
                  placeholder="Enter OTP code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-32"
                />
                <Button size="sm" onClick={verifyOTP}>
                  Verify
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setOtpStep(null);
                    setOtpCode("");
                  }}
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
