"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "@/hooks/useToast";

// Define interfaces
interface Attachment {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
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

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  title = "Profile Picture",
  allowedTypes = ["image/jpeg", "image/png"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  fileTypeLabel = "PNG, JPG up to 5MB",
  initialFile = null,
  apiEndpoint = "http://localhost:3500/api/files/upload",
  authToken,
  firstName = "",
  lastName = "",
}) => {
  const [fileData, setFileData] = useState<Attachment | null>(initialFile);
  const [previewUrl, setPreviewUrl] = useState<string>(initialFile?.fileUrl || "");
  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (first: string, last: string) => {
    const firstInitial = first ? first[0].toUpperCase() : "";
    const lastInitial = last ? last[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  // Unified upload/update
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

    try {
      const formData = new FormData();
      formData.append("file", file);

      let uploadUrl = apiEndpoint;
      let method: "post" | "patch" = "post";
      if (fileData?._id) {
        uploadUrl = `${apiEndpoint}/${fileData._id}`;
        method = "patch";
      }

      const response = await axios.request({
        url: uploadUrl,
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      setFileData(response.data);
      setPreviewUrl(response.data.signedUrl || response.data.fileUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "Failed to upload/update file";
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
          Click the camera icon to {fileData ? "update" : "upload"} your profile picture
        </p>
        {errors.file && (
          <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
