"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import {
  personalDetailsSchema,
  PersonalDetailsFormData,
} from "@/lib/validation/account";
import { User } from "@/types/user";

import ProfileImage from "@/components/elements/profilePhoto";
import { useSession } from "next-auth/react";
import authService from "@/lib/http/authService";
import { toast } from "@/hooks/useToast";

interface PersonalDetailsTabProps {
  user: User;
}

export default function PersonalDetailsTab({ user }: PersonalDetailsTabProps) {
  const [profileImage, setProfileImage] = useState<any | null>(
    user.profilePicture.url
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleUpload = async (file: File, isReplace = false) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const response = await fetch("http://localhost:3500/api/files/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const { data } = await response.json();
      if (response.ok) {
        setProfileImage(data?.[0]?.url);

        const body = {
          id: data[0].id,
          url: data[0].url,
          name: data[0].originalName,
          size: data[0].size,
          type: data[0].mimeType,
        };

        await authService.updateProfilePicture(body, session?.accessToken);

        toast({ title: "Success", description: "File Upload SuccessFul!" });
        return data?.[0]?.url;
      } else {
        toast({
          title: "Failed",
          description: "File Upload failed!",
          variant: "destructive",
        });
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      // setUploadedFiles((prev) =>
      //   prev.map((f) =>
      //     fileObjects.find((fo) => fo.id === f.id)
      //       ? { ...f, status: "error", error: (error as Error).message }
      //       : f
      //   )
      // );
    } finally {
      setIsLoading(false);
    }
  };


  const handleReplace = async (file: File): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Revoke old URL if it exists
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }

      // Create new URL
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      console.log("File replaced:", file.name);
      return imageUrl;
    } catch (error) {
      console.error("Replace failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (): Promise<void> => {
    setIsLoading(true);
    try {
    
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Revoke URL if it exists
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }

      setProfileImage(null);
      console.log("Profile image removed");
    } catch (error) {
      console.error("Remove failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber || "",
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: user.gender || "",
    },
  });

  const watchedGender = watch("gender");

  const onSubmit = async (data: PersonalDetailsFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      console.log(session);

      await authService.updateProfile(data, session?.accessToken);
      toast({
        title: "Success",
        description: "Personal details updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to update personal details. Please try again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-4">
        <div className="flex justify-center">
          <ProfileImage
            size="md"
            currentImage={profileImage}
            onUpload={handleUpload}
            onReplace={handleReplace}
            onRemove={handleRemove}
            apiEndpoint="http://localhost:3500/api/files/upload"
          />
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            {...register("username")}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-sm text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="1234567890"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select
          value={watchedGender}
          onValueChange={(value) => setValue("gender", value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-sm text-destructive">{errors.gender.message}</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <div className="bg-white rounded-lg ">
          <h2 className="text-lg font-semibold mb-4">Account Status</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Status: {String(user.status)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.isVerified
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Account Verified: {String(user.isVerified)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.accountType
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Premium: {String(user.accountType)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.emailVerified
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Email Verification: {String(user.emailVerified)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.phoneVerified
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Phone Verification: {String(user.phoneVerified)}
              </span>
              {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.twoFactorAuth ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
            Two-Factor Auth: {String(user.)}
          </span> */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.preferences.notifications
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Notifications: {String(user.preferences.notifications)}
              </span>
              {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.accountLocked ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'}`}>
            Account Locked: {String(user.accountLocked)}
          </span> */}
            </div>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
