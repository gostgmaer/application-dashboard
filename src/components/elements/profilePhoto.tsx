"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "@/hooks/useToast";
import attachmentService from "@/lib/http/attachments";
import authService from "@/lib/http/authService";

// Define interfaces
interface Attachment {
  _id: string;
  tenant: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  storageType: string;
  bucketName: string | null;
  storagePath: string;
  extension: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  signedUrl?: string;
}

interface ProfilePictureUploaderProps {
  title?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  fileTypeLabel?: string;
  initialFile?: Attachment | null;
  apiEndpoint?: string;
  authToken: string;
  firstName?: string;
  lastName?: string;
}

interface Errors {
  file?: { message: string };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  title = "Profile Picture",
  allowedTypes = ["image/jpeg", "image/png"],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  fileTypeLabel = "PNG, JPG up to 5MB",
  initialFile = null,
  apiEndpoint = "/files",
  authToken,
  firstName = "",
  lastName = "",
}) => {
  const [fileData, setFileData] = useState<Attachment | null>(initialFile);
  const [previewUrl, setPreviewUrl] = useState<string | string>(
    initialFile?.fileUrl || ""
  );
  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get initials for AvatarFallback
  const getInitials = (first: string, last: string): string => {
    const firstInitial = first ? first[0].toUpperCase() : "";
    const lastInitial = last ? last[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  // Handle file selection and validation
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        file: { message: `Invalid file type. Allowed: ${fileTypeLabel}` },
      });
      toast({
        title: "Error",
        description: `Invalid file type. Allowed: ${fileTypeLabel}`,
      });
      return;
    }
    if (file.size > maxFileSize) {
      setErrors({
        file: { message: `File size exceeds ${maxFileSize / 1024 / 1024}MB` },
      });
      toast({
        title: "Error",
        description: `File size exceeds ${maxFileSize / 1024 / 1024}MB`,
      });
      return;
    }

    setErrors({});
    setPreviewUrl(URL.createObjectURL(file));

    if (fileData?._id) {
      // Update existing file
      const img: any = await updateFile(file);
      const data = {
        url: img["fileUrl"],
      };
      await authService.updateProfilePicture(data, authToken);
    } else {
      // Upload new file

      const img: any = await uploadFile(file);
      const data = {
        url: img["fileUrl"],
      };
      await authService.updateProfilePicture(data, authToken);
    }
  };

  // Upload new file
  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await attachmentService.uploadFile(formData, authToken);
      console.log(response);

      setFileData(response.data);
      setPreviewUrl(response.data.signedUrl || response.data.fileUrl);
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to upload file";
      setErrors({ file: { message } });
      toast({ title: "Error", description: message });
    }
  };

  // Update existing file
  const updateFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const id: string = fileData?._id as string;
      const response = await attachmentService.updateFile(
        id,
        formData,
        authToken
      );

      setFileData(response.data);
      setPreviewUrl(response.data.signedUrl || response.data.fileUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to update file";
      setErrors({ file: { message } });
      toast({ title: "Error", description: message });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Avatar className="h-20 w-20">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Profile" />
          ) : (
            <AvatarFallback className="text-lg">
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          )}
        </Avatar>
        <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors">
          <Camera className="h-3 w-3" />
          <input
            type="file"
            accept={allowedTypes.join(",")}
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        </label>
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">
          Click the camera icon to {fileData ? "update" : "upload"} your profile
          picture
        </p>
        {errors.file && (
          <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
