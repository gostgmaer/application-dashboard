"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader as Loader2, X } from "lucide-react";
import { toast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";

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
  createEndpoint?: string;
  updateEndpoint?: string;
  removeEndpoint?: string;
  callbackEndpoint?: string;
  authToken: string;
  firstName?: string;
  lastName?: string;
  onUpload?: (file: File, isUpdate: boolean) => Promise<{ data: Attachment } | void>;
  onRemove?: () => Promise<void>;
  onCallback?: (data: any) => Promise<void>;
  disabled?: boolean;
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
  apiEndpoint = "/files",
  createEndpoint,
  updateEndpoint,
  removeEndpoint,
  callbackEndpoint = "/api/profile/callback",
  authToken,
  firstName = "",
  lastName = "",
  onUpload,
  onRemove,
  onCallback,
  disabled = false,
}) => {
  const [fileData, setFileData] = useState<Attachment | null>(initialFile);
  const [previewUrl, setPreviewUrl] = useState<string>(initialFile?.fileUrl || initialFile?.signedUrl || "");
  const [errors, setErrors] = useState<Errors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (first: string, last: string) => {
    const firstInitial = first ? first[0].toUpperCase() : "";
    const lastInitial = last ? last[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Unified upload/update
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!allowedTypes.includes(file.type)) {
      const errorMessage = `Invalid file type. Allowed: ${fileTypeLabel}`;
      setErrors({
        file: { message: errorMessage },
      });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
    if (file.size > maxFileSize) {
      const errorMessage = `File size exceeds ${formatFileSize(maxFileSize)}`;
      setErrors({
        file: { message: errorMessage },
      });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    setIsUploading(true);
    
    // Create preview URL
    const tempPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(tempPreviewUrl);

    // Determine if this is an update or create
    const isUpdate = !!fileData?._id || !!initialFile?._id;

    try {
      let result;
      
      if (onUpload) {
        // Use custom upload handler
        result = await onUpload(file, isUpdate);
      } else {
        // Default upload implementation
        const formData = new FormData();
        formData.append("file", file);
        formData.append("isUpdate", isUpdate.toString());

        let uploadUrl = apiEndpoint;
        let method: "post" | "patch" | "put" = "post";

        if (isUpdate) {
          if (updateEndpoint) {
            uploadUrl = updateEndpoint;
            method = "put";
          } else if (fileData?._id) {
            uploadUrl = `${apiEndpoint}/${fileData._id}`;
            method = "patch";
          }
        } else if (createEndpoint) {
          uploadUrl = createEndpoint;
          method = "post";
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

        result = response.data;
      }

      // Update state with new file data
      const newFileData = result?.data || result;
      setFileData(newFileData);
      
      // Update preview URL with the server URL if available
      const serverUrl = newFileData?.signedUrl || newFileData?.fileUrl;
      if (serverUrl) {
        setPreviewUrl(serverUrl);
        // Clean up temporary preview URL
        URL.revokeObjectURL(tempPreviewUrl);
      }

      toast({
        title: "Success",
        description: `Profile picture ${isUpdate ? 'updated' : 'uploaded'} successfully`,
      });

      // Call the callback API for record update
      if (onCallback) {
        try {
          await onCallback({
            profilePictureUrl: serverUrl || tempPreviewUrl,
            action: isUpdate ? 'update' : 'create',
            fileId: newFileData?._id,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            timestamp: new Date().toISOString(),
          });
        } catch (callbackError) {
          console.warn('Callback failed:', callbackError);
          // Don't fail the upload if callback fails
        }
      } else {
        // Default callback implementation
        try {
          await axios.post(callbackEndpoint, {
            profilePictureUrl: serverUrl || tempPreviewUrl,
            action: isUpdate ? 'update' : 'create',
            fileId: newFileData?._id,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            timestamp: new Date().toISOString(),
          }, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (callbackError) {
          console.warn('Callback failed:', callbackError);
        }
      }

    } catch (error: any) {
      const message =
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        `Failed to ${isUpdate ? 'update' : 'upload'} profile picture`;
      
      setErrors({ file: { message } });
      toast({ 
        title: "Error", 
        description: message,
        variant: "destructive"
      });
      
      // Clean up preview URL on error
      URL.revokeObjectURL(tempPreviewUrl);
      // Revert to original preview if it existed
      setPreviewUrl(initialFile?.fileUrl || initialFile?.signedUrl || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!fileData?._id && !initialFile?._id) return;

    setIsRemoving(true);
    const hasExistingImage = !!fileData || !!initialFile;

    try {
      if (onRemove) {
        await onRemove();
      } else {
        // Default remove implementation
        const fileId = fileData?._id || initialFile?._id;
        let removeUrl = removeEndpoint || `${apiEndpoint}/${fileId}`;
        
        await axios.delete(removeUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      // Clean up preview URL if it exists
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      // Reset state
      setFileData(null);
      setPreviewUrl("");
      setErrors({});

      toast({
        title: "Success",
        description: "Profile picture removed successfully",
      });

      // Call the callback API for record update
      if (onCallback && hasExistingImage) {
        try {
          await onCallback({
            profilePictureUrl: null,
            action: 'remove',
            timestamp: new Date().toISOString(),
          });
        } catch (callbackError) {
          console.warn('Remove callback failed:', callbackError);
        }
      } else if (hasExistingImage) {
        // Default callback for remove
        try {
          await axios.post(callbackEndpoint, {
            profilePictureUrl: null,
            action: 'remove',
            timestamp: new Date().toISOString(),
          }, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (callbackError) {
          console.warn('Remove callback failed:', callbackError);
        }
      }

    } catch (error: any) {
      const message =
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        "Failed to remove profile picture";
      
      setErrors({ file: { message } });
      toast({ 
        title: "Error", 
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative group">
        <Avatar className="h-20 w-20 transition-all duration-200 group-hover:shadow-lg">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Profile" className="object-cover" />
          ) : (
            <AvatarFallback className="text-lg bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          )}
          
          {/* Upload overlay */}
          {!disabled && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-full flex items-center justify-center cursor-pointer"
                 onClick={openFileDialog}>
              {isUploading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
            </div>
          )}
        </Avatar>

        {/* Camera button - always visible */}
        <button
          onClick={openFileDialog}
          disabled={disabled || isUploading}
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isUploading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Camera className="h-3 w-3" />
          )}
        </button>

        {/* Remove button - only show if there's an image */}
        {(previewUrl || fileData) && !isUploading && !disabled && (
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <X className="h-3 w-3" />
            )}
          </button>
        )}

        <input
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleImageChange}
          className="hidden"
          ref={fileInputRef}
          disabled={disabled || isUploading}
        />
      </div>

      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-muted-foreground">
          {isUploading 
            ? "Uploading..." 
            : `Click the camera icon to ${fileData || initialFile ? "update" : "upload"} your profile picture`
          }
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {fileTypeLabel} • Max size: {formatFileSize(maxFileSize)}
        </p>
        
        {errors.file && (
          <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            onClick={openFileDialog}
            disabled={disabled || isUploading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {fileData || initialFile ? "Change" : "Upload"}
          </Button>
          
          {(previewUrl || fileData || initialFile) && (
            <Button
              onClick={handleRemove}
              disabled={disabled || isUploading || isRemoving}
              variant="outline"
              size="sm"
              className="text-xs text-red-600 border-red-200 hover:bg-red-50"
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUploader;