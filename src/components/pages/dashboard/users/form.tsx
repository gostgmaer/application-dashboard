"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Save,
  Eye,
  Trash2,
  Info,
} from "lucide-react";
import UserServices from "@/lib/http/userService";
import { useToast } from "@/hooks/useToast";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialog } from "@/hooks/use-dialog";
import Image from "next/image";
import roleServices from "@/lib/http/roleServices";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import userServices from "@/lib/http/userService";
import FileUploader from "@/components/elements/uploader";

interface Role {
  _id: string;
  name: string;
  isActive: boolean;
  // Add other fields as needed
}

const socialMediaFields = {
  facebook: "Facebook",
  twitter: "Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  google: "Google",
  pinterest: "Pinterest",
};

// Zod schema based on the provided Mongoose schema
const userSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .trim(),
    email: z.string().email("Invalid email address").toLowerCase(),
    firstName: z.string().min(1, "First name is required").trim(),
    status: z.string().min(1, "Status is Required").trim(),
    lastName: z.string().min(1, "Last name is required").trim(),
    role: z.string().min(1, "Role is required").trim(),
    dateOfBirth: z.string().optional().nullable(),
    gender: z
      .enum(["male", "female", "other", "prefer_not_to_say"])
      .optional()
      .nullable(),
    phoneNumber: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .optional(),
    profilePicture: z.string().optional().nullable(),
    isVerified: z.boolean(),
    socialMedia: z
      .object({
        facebook: z.string().optional().nullable(),
        twitter: z.string().optional().nullable(),
        instagram: z.string().optional().nullable(),
        linkedin: z.string().optional().nullable(),
        google: z.string().optional().nullable(),
        pinterest: z.string().optional().nullable(),
      })
      .optional(),
    preferences: z.object({
      newsletter: z.boolean(),
      notifications: z.boolean(),
      language: z.string(),
      currency: z.string(),
      theme: z.enum(["light", "dark"]),
    }),
    loyaltyPoints: z.coerce
      .number()
      .min(0, "Loyalty points cannot be negative"),
    referralCode: z.string().optional(),
    subscriptionType: z.enum(["free", "premium", "enterprise"]),
  })
  .strict();

interface UserData {
  username: string;
  email: string;
  firstName: string;
  status?:
    | "active"
    | "inactive"
    | "pending"
    | "banned"
    | "deleted"
    | "archived"
    | "draft";
  lastName: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  phoneNumber?: string;
  // address: Address[];
  profilePicture?: string;
  role?: string;
  isVerified: boolean;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    google?: string;
    pinterest?: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    currency: string;
    theme: "light" | "dark";
  };
  loyaltyPoints: number;
  referralCode?: string;
  subscriptionType: "free" | "premium" | "enterprise";
}

const genders = ["male", "female", "other", "prefer_not_to_say"];
const languages = ["en", "es", "fr", "de", "zh"];
const currencies = ["USD", "EUR", "GBP", "JPY", "CAD"];
const status = [
  "active",
  "inactive",
  "pending",
  "banned",
  "deleted",
  "archived",
  "draft",
];
const themes = ["light", "dark"];
const deliveryMethods = ["standard", "express"];
const paymentMethodTypes = ["credit_card", "paypal", "bank_transfer"];
const subscriptionTypes = ["free", "premium", "enterprise"];

export default function UserCreate({ data, id, master }: any) {
  const { data: session } = useSession();
console.log(master);

  const route = useRouter();
  const { toast } = useToast();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  const onSubmit = async (
    values: UserData,
    s: "draft" | "published" | "update"
  ) => {
    const updatedUser = {
      ...values,
      status: s === "draft" ? "draft" : values?.status,
      referralCode: values?.referralCode || generateReferralCode(),
      profilePicture,
    };
    let res: any = {};

    switch (s) {
      case "draft":
        {
          res = await userServices.create(updatedUser, session?.accessToken);
        }

        break;
      case "update":
        {
          res = await userServices.updatePatch(
            id,
            updatedUser,
            session?.accessToken
          );
        }
        break;

      default:
        {
          res = await UserServices.create(updatedUser, session?.accessToken);
        }
        break;
    }

    if (res.error) {
      const error = JSON.parse(res.error);
      toast({
        title: error.status,
        description: error.message,
        variant: "destructive",
      });
    } else {
      reset();
      toast({
        title: res.status,
        description: res.message,
      });
      route.push("/dashboard/users");
    }
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<UserData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: data?.username || "",
      email: data?.email || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      isVerified: data?.isVerified || false,
      phoneNumber: data?.phoneNumber || "",
      gender: data?.gender || "",
      referralCode: data?.referralCode || "",
      dateOfBirth: data?.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString().split("T")[0]
        : "",
      role: data?.role || "",
      status: data?.status || "draft",
      socialMedia: data?.socialMedia || {
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null,
        google: null,
        pinterest: null,
      },
      preferences: {
        newsletter: data?.newsletter || true,
        notifications: data?.notifications || true,
        language: data?.language || "en",
        currency: data?.currency || "USD",
        theme: data?.theme || "light",
      },
      loyaltyPoints: data?.loyaltyPoints || 0,
      subscriptionType: data?.subscriptionType || "free",
    },
  });
  console.log(Object.keys(errors));

  // const handleChange = (field: keyof UserData, value: any) => {
  //   setUser((prev) => ({ ...prev, [field]: value }));
  //   setErrors((prev) => ({ ...prev, [field]: "" }));
  // };
  function getErrorMessage(error: unknown): string | null {
    if (!error) return null;
    if (typeof error === "string") return error;
    if (typeof error === "object" && error !== null && "message" in error) {
      return (error as { message?: string }).message ?? null;
    }
    return null;
  }
  return (
    <div className="min-h-screen  py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Username *
                  </Label>
                  <Input
                    id="username"
                    {...register("username")}
                    disabled={id}
                    className={`mt-1  ${
                      errors.username ? "border-red-500" : ""
                    }`}
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    disabled={id}
                    {...register("email")}
                    className={`mt-1  ${errors.email ? "border-red-500" : ""}`}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    className={`mt-1  ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    // onChange={(e) => handleChange("lastName", e.target.value)}
                    className={`mt-1  ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    className={`mt-1  ${
                      errors.dateOfBirth ? "border-red-500" : ""
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Gender
                  </Label>

                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={getValues("gender")}
                      >
                        <SelectTrigger
                          className={`mt-1  ${
                            errors.gender ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="  ">
                          {genders.map((gender) => (
                            <SelectItem
                              key={gender}
                              value={gender}
                              className="hover:bg-gray-700"
                            >
                              {gender.charAt(0).toUpperCase() +
                                gender.slice(1).replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  className={`mt-1  ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                  placeholder="10-digit phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <FileUploader
            title="Upload Gallery Images"
            allowedTypes={["image/jpeg", "image/png"]}
            maxFileSize={5 * 1024 * 1024}
            fileTypeLabel="PNG, JPG up to 5MB"
            apiEndpoint="/files"
            authToken={session?.accessToken || ""}
            multiple={false}
            onFileChange={(files: File[]) =>
              console.log("Selected files:", files)
            }
          />

          {/* Social Media & Interests */}
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-400 rounded-full"></div>
                Social Media & Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(socialMediaFields).map(
                  ([platform, displayName]) => (
                    <div key={platform}>
                      <Label
                        htmlFor={platform}
                        className="text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {displayName}
                      </Label>
                      <Input
                        id={platform}
                        {...register(`socialMedia.${platform}` as any)}
                        className="mt-1"
                        placeholder={`Enter ${displayName} profile URL`}
                      />
                      <p className="text-red-500 text-xs mt-1">
                        {getErrorMessage(
                          errors.socialMedia?.[
                            platform as keyof typeof errors.socialMedia
                          ]
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Preferences & Settings */}
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-400 rounded-full"></div>
                Preferences & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 ">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700 dark:text-gray-400">
                    Newsletter
                  </Label>

                  <Controller
                    name="preferences.newsletter"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700 dark:text-gray-400">
                    Notifications
                  </Label>
                  <Controller
                    name="preferences.notifications"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700 dark:text-gray-400">
                    Verified Account
                  </Label>
                  <Controller
                    name="isVerified"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Language
                </Label>

                <Controller
                  name="preferences.language"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={getValues("preferences.language")}
                    >
                      <SelectTrigger className={`mt-1 `}>
                        <SelectValue className="text-gray-600" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {languages.map((lang) => (
                          <SelectItem
                            key={lang}
                            value={lang}
                            className="hover:bg-gray-700"
                          >
                            {lang.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.preferences?.language && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.preferences?.language.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Currency
                </Label>
                <Controller
                  name="preferences.currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={getValues("preferences.currency")}
                    >
                      <SelectTrigger className={`mt-1 `}>
                        <SelectValue className="text-gray-600" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency}
                            value={currency}
                            className="hover:bg-gray-700"
                          >
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.preferences?.currency && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.preferences?.currency.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Theme
                </Label>
                <Controller
                  name="preferences.theme"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={getValues("preferences.theme")}
                    >
                      <SelectTrigger className={`mt-1 `}>
                        <SelectValue className="text-gray-600" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {themes.map((theme) => (
                          <SelectItem
                            key={theme}
                            value={theme}
                            className="hover:bg-gray-700"
                          >
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.preferences?.theme && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.preferences?.theme.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Subscription Type
                </Label>
                <Controller
                  name="subscriptionType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={getValues("subscriptionType")}
                    >
                      <SelectTrigger className={`mt-1 `}>
                        <SelectValue className="text-gray-600" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {subscriptionTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="hover:bg-gray-700"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.subscriptionType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subscriptionType.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="loyaltyPoints"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Loyalty Points
                </Label>
                <Input
                  id="loyaltyPoints"
                  type="number"
                  {...register("loyaltyPoints")}
                  className={`mt-1   ${
                    errors.loyaltyPoints ? "border-red-500" : ""
                  }`}
                />
                {errors.loyaltyPoints && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.loyaltyPoints.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="referralCode"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Referral Code
                </Label>
                <Input
                  id="referralCode"
                  {...register("referralCode")}
                  className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    errors.referralCode ? "border-red-500" : ""
                  }`}
                  placeholder="Auto-generated if empty"
                />
                {errors.referralCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.referralCode.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={getValues("status")}
                    >
                      <SelectTrigger className={`mt-1 `}>
                        <SelectValue className="text-gray-600" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {status.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="hover:bg-gray-700"
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Role
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={getValues("role")}
                    >
                      <SelectTrigger className={`mt-1 `}>
                        <SelectValue
                          className="text-gray-600"
                          placeholder="Select"
                        />
                      </SelectTrigger>
                      <SelectContent className="">
                        {master.roles.map((s: any) => (
                          <SelectItem
                            key={s["_id"]}
                            value={s["_id"]}
                            className="hover:bg-gray-700"
                          >
                            {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-400 rounded-full"></div>
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {id ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSubmit((data) => onSubmit(data, "update"))}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    // disabled={Object.keys(errors).length > 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Update User
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSubmit((data) => onSubmit(data, "draft"))}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-800"
                    disabled={Object.keys(errors).length > 0}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleSubmit((data) =>
                      onSubmit(data, "published")
                    )}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={Object.keys(errors).length > 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Activate User
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
