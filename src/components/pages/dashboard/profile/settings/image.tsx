"use client";

import { useState } from "react";
import { User } from "@/types/user";
import ProfileImage from "@/components/elements/profilePhoto";
import { useSession } from "next-auth/react";
import authService from "@/lib/http/authService";
import { toast } from "@/hooks/useToast";

interface PersonalDetailsTabProps {
  user: User;
}

export default function ProfileImageSection({ user }: PersonalDetailsTabProps) {
  const [profileImage, setProfileImage] = useState<any | null>(
    user?.profilePicture?.url
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

  const handleReplace = async (file: File, isReplace = false) => {
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

  return (
    <ProfileImage
      size="md"
      currentImage={profileImage}
      onUpload={handleUpload}
      onReplace={handleReplace}
      onRemove={handleRemove}
      apiEndpoint="http://localhost:3500/api/files/upload"
    />
  );
}
