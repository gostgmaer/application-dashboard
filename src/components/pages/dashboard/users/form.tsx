"use client";

import { useState } from "react";
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
import UserServices from "@/helper/services/userService";
import { useToast } from "@/hooks/useToast";

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
    dateOfBirth: z.string().optional().nullable(),
    gender: z
      .enum(["male", "female", "other", "prefer_not_to_say"])
      .optional()
      .nullable(),
    phoneNumber: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .optional()
      .nullable(),
    // address: z
    //   .array(
    //     z.object({
    //       id: z.string(),
    //       street: z.string().min(1, "Street is required"),
    //       city: z.string().min(1, "City is required"),
    //       state: z.string().optional(),
    //       country: z.string().min(1, "Country is required"),
    //       postalCode: z.string().min(1, "Postal code is required"),
    //       isDefault: z.boolean(),
    //     })
    //   )
    //   .optional(),
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
    // interests: z.array(z.string()).optional(),
    loyaltyPoints: z.number().min(0, "Loyalty points cannot be negative"),
    referralCode: z.string().optional(),
    // paymentMethods: z
    //   .array(
    //     z.object({
    //       method: z.enum(["credit_card", "paypal", "bank_transfer"]),
    //       details: z
    //         .object({
    //           cardNumber: z.string().optional(),
    //           expiryDate: z.string().optional(),
    //           holderName: z.string().optional(),
    //         })
    //         .refine(
    //           (data) => {
    //             if (data.cardNumber || data.expiryDate || data.holderName) {
    //               return data.cardNumber && data.expiryDate && data.holderName;
    //             }
    //             return true;
    //           },
    //           {
    //             message:
    //               "All credit card details are required if any are provided",
    //           }
    //         ),
    //       isDefault: z.boolean(),
    //     })
    //   )
    //   .optional(),
    // shippingPreferences: z.object({
    //   deliveryMethod: z.enum(["standard", "express"]),
    //   deliveryInstructions: z.string().optional().nullable(),
    //   preferredTime: z.string().optional().nullable(),
    // }),
    subscriptionStatus: z.enum(["active", "inactive"]),
    subscriptionType: z.enum(["free", "premium", "enterprise"]),
  })
  .strict();

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  method: "credit_card" | "paypal" | "bank_transfer";
  details: {
    cardNumber?: string;
    expiryDate?: string;
    holderName?: string;
  };
  isDefault: boolean;
}

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
  // interests: string[];
  loyaltyPoints: number;
  referralCode?: string;
  // paymentMethods: PaymentMethod[];
  // shippingPreferences: {
  //   deliveryMethod: "standard" | "express";
  //   deliveryInstructions?: string;
  //   preferredTime?: string;
  // };
  subscriptionStatus: "active" | "inactive";
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

export default function UserCreate({ data, id }: any) {

  const { toast } = useToast()

  const [user, setUser] = useState<UserData>({
    username: data.username || "",
    email: data.email || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    isVerified: data.isVerified || false,
    status: data.status || "draft",
    // address: [],
    // paymentMethods: [],
    socialMedia: data.socialMedia || {},
    preferences: {
      newsletter: data.preferences.newsletter || false,
      notifications: data.preferences.notifications || true,
      language: data.preferences.language || "en",
      currency: data.preferences.currency || "USD",
      theme: data.preferences.theme || "light",
    },
    // interests: [],
    loyaltyPoints: data.loyaltyPoints || 0,
    subscriptionStatus: data.subscriptionStatus || "inactive",
    subscriptionType: data.subscriptionType || "free",
    // shippingPreferences: {
    //   deliveryMethod: "standard",
    // },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newInterest, setNewInterest] = useState("");
  const [newAddress, setNewAddress] = useState<Address>({
    id: Date.now().toString(),
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isDefault: false,
  });
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>({
    method: "credit_card",
    details: {},
    isDefault: false,
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [jsonOutput, setJsonOutput] = useState("");

  const validateForm = () => {
    console.log(Object.keys(errors));

    try {
      userSchema.parse(user);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };
  console.log(Object.keys(errors));
  console.log(Object.keys(errors));

  // const addInterest = () => {
  //   if (newInterest.trim() && !user.interests.includes(newInterest.trim())) {
  //     setUser((prev) => ({
  //       ...prev,
  //       interests: [...prev.interests, newInterest.trim()],
  //     }));
  //     setNewInterest("");
  //     setErrors((prev) => ({ ...prev, interests: "" }));
  //   }
  // };

  // const removeInterest = (interest: string) => {
  //   setUser((prev) => ({
  //     ...prev,
  //     interests: prev.interests.filter((i) => i !== interest),
  //   }));
  // };

  // const addAddress = () => {
  //   if (
  //     newAddress.street &&
  //     newAddress.city &&
  //     newAddress.country &&
  //     newAddress.postalCode
  //   ) {
  //     setUser((prev) => ({
  //       ...prev,
  //       address: [
  //         ...prev.address,
  //         { ...newAddress, id: Date.now().toString() },
  //       ],
  //     }));
  //     setNewAddress({
  //       id: "",
  //       street: "",
  //       city: "",
  //       state: "",
  //       country: "",
  //       postalCode: "",
  //       isDefault: false,
  //     });
  //     setErrors((prev) => ({ ...prev, address: "" }));
  //   }
  // };

  // const removeAddress = (id: string) => {
  //   setUser((prev) => ({
  //     ...prev,
  //     address: prev.address.filter((a) => a.id !== id),
  //   }));
  // };

  // const updateAddress = (
  //   id: string,
  //   field: keyof Address,
  //   value: string | boolean
  // ) => {
  //   setUser((prev) => ({
  //     ...prev,
  //     address: prev.address.map((a) =>
  //       a.id === id ? { ...a, [field]: value } : a
  //     ),
  //   }));
  // };

  // const addPaymentMethod = () => {
  //   if (
  //     newPaymentMethod.method &&
  //     (newPaymentMethod.method !== "credit_card" ||
  //       (newPaymentMethod.details.cardNumber &&
  //         newPaymentMethod.details.expiryDate &&
  //         newPaymentMethod.details.holderName))
  //   ) {
  //     setUser((prev) => ({
  //       ...prev,
  //       paymentMethods: [
  //         ...prev.paymentMethods,
  //         { ...newPaymentMethod, id: Date.now().toString() },
  //       ],
  //     }));
  //     setNewPaymentMethod({
  //       method: "credit_card",
  //       details: {},
  //       isDefault: false,
  //     });
  //     setErrors((prev) => ({ ...prev, paymentMethods: "" }));
  //   }
  // };

  // const removePaymentMethod = (index: number) => {
  //   setUser((prev) => ({
  //     ...prev,
  //     paymentMethods: prev.paymentMethods.filter((_, i) => i !== index),
  //   }));
  // };

  // const updatePaymentMethod = (
  //   index: number,
  //   field: keyof PaymentMethod | "cardNumber" | "expiryDate" | "holderName",
  //   value: any
  // ) => {
  //   setUser((prev) => ({
  //     ...prev,
  //     paymentMethods: prev.paymentMethods.map((pm, i) => {
  //       if (i === index) {
  //         if (["cardNumber", "expiryDate", "holderName"].includes(field)) {
  //           return { ...pm, details: { ...pm.details, [field]: value } };
  //         }
  //         return { ...pm, [field]: value };
  //       }
  //       return pm;
  //     }),
  //   }));
  // };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (s: "draft" | "active" | "update") => {
    if (!validateForm()) {
      return;
    }
    const updatedUser = {
      ...user,
      status: s === "draft" ? "draft" : user.status,
      referralCode: user.referralCode || generateReferralCode(),
      profilePicture,
    };
    let res: any = {};
    console.log(s);
    
    switch (s) {
      case "draft":
        {
          res = await UserServices.adduser(updatedUser, {});
        }

        break;
      case "update":
        {
          res = await UserServices.updateUserPatch(id, updatedUser, {});
        }
        break;

      default:
        {
          res = await UserServices.adduser(updatedUser, {});
        }
        break;
    }
    console.log( res);
    
     toast({
        title: res.message,
        description: "We'll get back to you within 24 hours.",
        duration: 5000,
      })

    const jsonString = JSON.stringify(updatedUser, null, 2);
    setJsonOutput(jsonString);
    setShowJsonOutput(true);

    console.log("User JSON:", jsonString);
  };

  const handleChange = (field: keyof UserData, value: any) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

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
                    value={user.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    disabled={id}
                    className={`mt-1  ${
                      errors.username ? "border-red-500" : ""
                    }`}
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
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
                    value={user.email}
                    disabled={id}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`mt-1  ${errors.email ? "border-red-500" : ""}`}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
                    value={user.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className={`mt-1  ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
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
                    value={user.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className={`mt-1  ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
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
                    value={user.dateOfBirth || ""}
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                    className={`mt-1  ${
                      errors.dateOfBirth ? "border-red-500" : ""
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Gender
                  </Label>
                  <Select
                    value={user.gender || ""}
                    onValueChange={(value) => handleChange("gender", value)}
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
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
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
                  value={user.phoneNumber || ""}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className={`mt-1  ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                  placeholder="10-digit phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-400 rounded-full"></div>
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-200">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-gray-800">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Upload profile picture
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB.</p>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-700"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                </div>
              </div>
              {profilePicture && (
                <div className="mt-4 flex items-center gap-2">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <Button
                    onClick={() => setProfilePicture(null)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {errors.profilePicture && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profilePicture}
                </p>
              )}
            </CardContent>
          </Card>
          {/* Address Section */}
          {/* <Card className="">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-green-400 rounded-full"></div>
                  Addresses
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 ml-2">
                    {user.address.length} addresses
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.address.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-400">No addresses added</p>
                    <p className="mt-2">Add addresses to manage user shipping information.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.address.map((address, index) => (
                      <div key={address.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 relative">
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="border-gray-600 text-gray-400">
                            {address.isDefault ? 'Default' : 'Non-default'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Street</Label>
                            <Input
                              value={address.street}
                              onChange={(e) => updateAddress(address.id, 'street', e.target.value)}
                              className={`mt-1  ${errors[`address.${index}.street`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`address.${index}.street`] && <p className="text-red-500 text-xs mt-1">{errors[`address.${index}.street`]}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">City</Label>
                            <Input
                              value={address.city}
                              onChange={(e) => updateAddress(address.id, 'city', e.target.value)}
                              className={`mt-1  ${errors[`address.${index}.city`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`address.${index}.city`] && <p className="text-red-500 text-xs mt-1">{errors[`address.${index}.city`]}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">State</Label>
                            <Input
                              value={address.state}
                              onChange={(e) => updateAddress(address.id, 'state', e.target.value)}
                              className="mt-1 "
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Country</Label>
                            <Input
                              value={address.country}
                              onChange={(e) => updateAddress(address.id, 'country', e.target.value)}
                              className={`mt-1  ${errors[`address.${index}.country`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`address.${index}.country`] && <p className="text-red-500 text-xs mt-1">{errors[`address.${index}.country`]}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Postal Code</Label>
                            <Input
                              value={address.postalCode}
                              onChange={(e) => updateAddress(address.id, 'postalCode', e.target.value)}
                              className={`mt-1  ${errors[`address.${index}.postalCode`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`address.${index}.postalCode`] && <p className="text-red-500 text-xs mt-1">{errors[`address.${index}.postalCode`]}</p>}
                          </div>
                          <div className="flex items-center mt-4">
                            <Switch
                              checked={address.isDefault}
                              onCheckedChange={(checked) => updateAddress(address.id, 'isDefault', checked)}
                            />
                            <Label className="ml-2 text-sm text-gray-700 dark:text-gray-400">Default Address</Label>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeAddress(address.id)}
                          variant="outline"
                          size="sm"
                          className="mt-4 border-gray-600 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Separator className="bg-gray-700" />
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">Add New Address</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        value={newAddress.street}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="Street"
                        className={` ${errors['address'] ? 'border-red-500' : ''}`}
                      />
                      {errors['address'] && <p className="text-red-500 text-xs mt-1">{errors['address']}</p>}
                    </div>
                    <div>
                      <Input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                        className={` ${errors['address'] ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <Input
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                      className=""
                    />
                    <div>
                      <Input
                        value={newAddress.country}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="Country"
                        className={` ${errors['address'] ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <div>
                      <Input
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="Postal Code"
                        className={` ${errors['address'] ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <div className="flex items-center">
                      <Switch
                        checked={newAddress.isDefault}
                        onCheckedChange={(checked) => setNewAddress(prev => ({ ...prev, isDefault: checked }))}
                      />
                      <Label className="ml-2 text-sm text-gray-700 dark:text-gray-400">Default Address</Label>
                    </div>
                  </div>
                  <Button onClick={addAddress} variant="outline" size="sm" className="border-gray-600 text-gray-700 dark:text-gray-400">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardContent>
            </Card> */}

          {/* Payment Methods */}
          {/* <Card className="">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
                  Payment Methods
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 ml-2">
                    {user.paymentMethods.length} methods
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.paymentMethods.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-400">No payment methods added</p>
                    <p className="mt-2">Add payment methods to manage user billing options.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.paymentMethods.map((method, index) => (
                      <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 relative">
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="border-gray-600 text-gray-400">
                            {method.isDefault ? 'Default' : 'Non-default'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Method</Label>
                            <Select
                              value={method.method}
                              onValueChange={(value) => updatePaymentMethod(index, 'method', value)}
                            >
                              <SelectTrigger className={`mt-1  ${errors[`paymentMethods.${index}.method`] ? 'border-red-500' : ''}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-white">
                                {paymentMethodTypes.map(type => (
                                  <SelectItem key={type} value={type} className="hover:bg-gray-700">
                                    {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.replace(/_/g, ' ').slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors[`paymentMethods.${index}.method`] && <p className="text-red-500 text-xs mt-1">{errors[`paymentMethods.${index}.method`]}</p>}
                          </div>
                          {method.method === 'credit_card' && (
                            <>
                              <div>
                                <Label className="text-xs font-medium text-gray-400">Card Number</Label>
                                <Input
                                  value={method.details.cardNumber || ''}
                                  onChange={(e) => updatePaymentMethod(index, 'cardNumber', e.target.value)}
                                  className={`mt-1  ${errors[`paymentMethods.${index}.details.cardNumber`] ? 'border-red-500' : ''}`}
                                  placeholder="Card number"
                                />
                                {errors[`paymentMethods.${index}.details.cardNumber`] && <p className="text-red-500 text-xs mt-1">{errors[`paymentMethods.${index}.details.cardNumber`]}</p>}
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-400">Holder Name</Label>
                                <Input
                                  value={method.details.holderName || ''}
                                  onChange={(e) => updatePaymentMethod(index, 'holderName', e.target.value)}
                                  className={`mt-1  ${errors[`paymentMethods.${index}.details.holderName`] ? 'border-red-500' : ''}`}
                                  placeholder="Cardholder name"
                                />
                                {errors[`paymentMethods.${index}.details.holderName`] && <p className="text-red-500 text-xs mt-1">{errors[`paymentMethods.${index}.details.holderName`]}</p>}
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-400">Expiry Date</Label>
                                <Input
                                  type="date"
                                  value={method.details.expiryDate || ''}
                                  onChange={(e) => updatePaymentMethod(index, 'expiryDate', e.target.value)}
                                  className={`mt-1  ${errors[`paymentMethods.${index}.details.expiryDate`] ? 'border-red-500' : ''}`}
                                />
                                {errors[`paymentMethods.${index}.details.expiryDate`] && <p className="text-red-500 text-xs mt-1">{errors[`paymentMethods.${index}.details.expiryDate`]}</p>}
                              </div>
                            </>
                          )}
                          <div className="flex items-center mt-4">
                            <Switch
                              checked={method.isDefault}
                              onCheckedChange={(checked) => updatePaymentMethod(index, 'isDefault', checked)}
                            />
                            <Label className="ml-2 text-sm text-gray-700 dark:text-gray-400">Default Method</Label>
                          </div>
                        </div>
                        <Button
                          onClick={() => removePaymentMethod(index)}
                          variant="outline"
                          size="sm"
                          className="mt-4 border-gray-600 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Separator className="bg-gray-700" />
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">Add New Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      value={newPaymentMethod.method}
                      onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, method: value as any }))}
                    >
                      <SelectTrigger className={` ${errors['paymentMethods'] ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        {paymentMethodTypes.map(type => (
                          <SelectItem key={type} value={type} className="hover:bg-gray-700">
                            {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.replace(/_/g, ' ').slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {newPaymentMethod.method === 'credit_card' && (
                      <>
                        <Input
                          value={newPaymentMethod.details.cardNumber || ''}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, details: { ...prev.details, cardNumber: e.target.value } }))}
                          placeholder="Card Number"
                          className={` ${errors['paymentMethods'] ? 'border-red-500' : ''}`}
                        />
                        <Input
                          value={newPaymentMethod.details.holderName || ''}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, details: { ...prev.details, holderName: e.target.value } }))}
                          placeholder="Cardholder Name"
                          className={` ${errors['paymentMethods'] ? 'border-red-500' : ''}`}
                        />
                        <Input
                          type="date"
                          value={newPaymentMethod.details.expiryDate || ''}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, details: { ...prev.details, expiryDate: e.target.value } }))}
                          placeholder="Expiry Date"
                          className={` ${errors['paymentMethods'] ? 'border-red-500' : ''}`}
                        />
                      </>
                    )}
                    <div className="flex items-center">
                      <Switch
                        checked={newPaymentMethod.isDefault}
                        onCheckedChange={(checked) => setNewPaymentMethod(prev => ({ ...prev, isDefault: checked }))}
                      />
                      <Label className="ml-2 text-sm text-gray-700 dark:text-gray-400">Default Method</Label>
                    </div>
                  </div>
                  <Button onClick={addPaymentMethod} variant="outline" size="sm" className="border-gray-600 text-gray-700 dark:text-gray-400">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                  {errors['paymentMethods'] && <p className="text-red-500 text-xs mt-1">{errors['paymentMethods']}</p>}
                </div>
              </CardContent>
            </Card> */}

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
                {[
                  "facebook",
                  "twitter",
                  "instagram",
                  "linkedin",
                  "google",
                  "pinterest",
                ].map((platform) => (
                  <div key={platform}>
                    <Label
                      htmlFor={platform}
                      className="text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Label>
                    <Input
                      id={platform}
                      value={
                        user.socialMedia[
                          platform as keyof typeof user.socialMedia
                        ] || ""
                      }
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          socialMedia: {
                            ...prev.socialMedia,
                            [platform]: e.target.value,
                          },
                        }))
                      }
                      className={`mt-1  ${
                        errors[`socialMedia.${platform}`]
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder={`Enter ${platform} profile URL`}
                    />
                    {errors[`socialMedia.${platform}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`socialMedia.${platform}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {/* <Separator className="bg-gray-700" />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Interests
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {user.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-gray-700 text-gray-700 dark:text-gray-400 flex items-center gap-1 border-gray-600"
                    >
                      {interest}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInterest(interest)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add interest"
                    onKeyPress={(e) => e.key === "Enter" && addInterest()}
                    className={` placeholder-gray-500 flex-1 ${
                      errors.interests ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {errors.interests && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.interests}
                  </p>
                )}
              </div> */}
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
                  <Switch
                    checked={user.preferences.newsletter}
                    onCheckedChange={(checked) =>
                      setUser((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          newsletter: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700 dark:text-gray-400">
                    Notifications
                  </Label>
                  <Switch
                    checked={user.preferences.notifications}
                    onCheckedChange={(checked) =>
                      setUser((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700 dark:text-gray-400">
                    Verified Account
                  </Label>
                  <Switch
                    checked={user.isVerified}
                    onCheckedChange={(checked) =>
                      handleChange("isVerified", checked)
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Language
                </Label>
                <Select
                  value={user.preferences.language}
                  onValueChange={(value) =>
                    setUser((prev) => ({
                      ...prev,
                      preferences: { ...prev.preferences, language: value },
                    }))
                  }
                >
                  <SelectTrigger
                    className={`mt-1  ${
                      errors["preferences.language"] ? "border-red-500" : ""
                    }`}
                  >
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
                {errors["preferences.language"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["preferences.language"]}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Currency
                </Label>
                <Select
                  value={user.preferences.currency}
                  onValueChange={(value) =>
                    setUser((prev) => ({
                      ...prev,
                      preferences: { ...prev.preferences, currency: value },
                    }))
                  }
                >
                  <SelectTrigger
                    className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors["preferences.currency"] ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue />
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
                {errors["preferences.currency"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["preferences.currency"]}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Theme
                </Label>
                <Select
                  value={user.preferences.theme}
                  onValueChange={(value) =>
                    setUser((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        theme: value as "light" | "dark",
                      },
                    }))
                  }
                >
                  <SelectTrigger
                    className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors["preferences.theme"] ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue />
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
                {errors["preferences.theme"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["preferences.theme"]}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Subscription Type
                </Label>
                <Select
                  value={user.subscriptionType}
                  onValueChange={(value) =>
                    handleChange("subscriptionType", value)
                  }
                >
                  <SelectTrigger
                    className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors.subscriptionType ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue />
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
                {errors.subscriptionType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subscriptionType}
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
                  value={user.loyaltyPoints}
                  onChange={(e) =>
                    handleChange("loyaltyPoints", parseInt(e.target.value) || 0)
                  }
                  className={`mt-1   ${
                    errors.loyaltyPoints ? "border-red-500" : ""
                  }`}
                />
                {errors.loyaltyPoints && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.loyaltyPoints}
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
                  value={user.referralCode || ""}
                  onChange={(e) => handleChange("referralCode", e.target.value)}
                  className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    errors.referralCode ? "border-red-500" : ""
                  }`}
                  placeholder="Auto-generated if empty"
                />
                {errors.referralCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.referralCode}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Status
                </Label>
                <Select
                  value={user.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger
                    className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors.status ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="">
                    {status.map((type) => (
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
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Preferences */}
          {/* <Card className="">
            <CardHeader className="">
               <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-purple-400 rounded-full"></div>
                Shipping Preferences
              </CardTitle>
             
            </CardHeader>
            <CardContent className="space-y-4 p-6 ">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Delivery Method
                </Label>
                <Select
                  value={user.shippingPreferences.deliveryMethod}
                  onValueChange={(value) =>
                    setUser((prev) => ({
                      ...prev,
                      shippingPreferences: {
                        ...prev.shippingPreferences,
                        deliveryMethod: value as "standard" | "express",
                      },
                    }))
                  }
                >
                  <SelectTrigger
                    className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors["shippingPreferences.deliveryMethod"]
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="">
                    {deliveryMethods.map((method) => (
                      <SelectItem
                        key={method}
                        value={method}
                        className="hover:bg-gray-700"
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors["shippingPreferences.deliveryMethod"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["shippingPreferences.deliveryMethod"]}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="deliveryInstructions"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Delivery Instructions
                </Label>
                <Input
                  id="deliveryInstructions"
                  value={user.shippingPreferences.deliveryInstructions || ""}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      shippingPreferences: {
                        ...prev.shippingPreferences,
                        deliveryInstructions: e.target.value,
                      },
                    }))
                  }
                  className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    errors["shippingPreferences.deliveryInstructions"]
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Special delivery instructions"
                />
                {errors["shippingPreferences.deliveryInstructions"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["shippingPreferences.deliveryInstructions"]}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="preferredTime"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Preferred Delivery Time
                </Label>
                <Input
                  id="preferredTime"
                  value={user.shippingPreferences.preferredTime || ""}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      shippingPreferences: {
                        ...prev.shippingPreferences,
                        preferredTime: e.target.value,
                      },
                    }))
                  }
                  className={`mt-1  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    errors["shippingPreferences.preferredTime"]
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="e.g., 9 AM - 12 PM"
                />
                {errors["shippingPreferences.preferredTime"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["shippingPreferences.preferredTime"]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card> */}

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
                    onClick={() => handleSubmit("update")}
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
                    onClick={() => handleSubmit("draft")}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-800"
                    disabled={Object.keys(errors).length > 0}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit("active")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    // disabled={Object.keys(errors).length > 0}
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
