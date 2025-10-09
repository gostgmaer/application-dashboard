import React, { useState, useRef, useCallback } from "react";
import {
  Camera,
  X,
  Upload,
  User,
  Trash2,
  CreditCard as Edit3,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/useToast";

interface ProfileImageProps {
  currentImage?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onUpload?: (file: File) => Promise<string>;
  onRemove?: () => Promise<void>;
  onReplace?: (file: File) => Promise<string>;
  disabled?: boolean;
  className?: string;
  apiEndpoint?: string;
  showRemoveButton?: boolean;
  allowedTypes?: string[];
  maxSize?: number;
  placeholder?: React.ReactNode;
}

interface UploadedFile {
  file: File;
  id: string; // local unique
  serverId?: string; // returned from backend
  url?: string; // view/download url
  name?: string; // display (rename-able)
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  response?: any;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  currentImage,
  size = "md",
  onUpload,
  onRemove,
  onReplace,
  disabled = false,
  className = "",
  apiEndpoint = "/api/files/upload",
  showRemoveButton = true,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxSize = 5 * 1024 * 1024, // 5MB
  placeholder,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile>();
  const [showActions, setShowActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Allowed types: ${allowedTypes.join(
        ", "
      )}`;
    }

    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    return null;
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };
//  const uploadFile = async (file: File, isReplace = false) => {
//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("files", file);
//       // setUploadedFiles((prev) =>
//       //   prev.map((f) =>
//       //     fileObjects.find((fo) => fo.id === f.id)
//       //       ? { ...f, status: "uploading", progress: 0 }
//       //       : f
//       //   )
//       // );
//       // API call to upload files
//       const response = await fetch(apiEndpoint, {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       });
//       const result = await response.json();
//       if (response.ok) {
//         // Sample handling: adapt to your API shape
//         // setUploadedFiles((prev) =>
//         //   prev.map((f) =>
//         //     fileObjects.find((fo) => fo.id === f.id)
//         //       ? {
//         //           ...f,
//         //           status: "success",
//         //           progress: 100,
//         //           response: result,
//         //           serverId: result?.data?.[0]?.id || result?.id,
//         //           url: result?.data?.[0]?.url || result?.url,
//         //           name: f.file.name, // from file object or backend
//         //         }
//         //       : f
//         //   )
//         // );

//         if (onUpload) await onUpload(result?.data || result);
//         toast({ title: "Success", description: "File Upload SuccessFul!" });
//         return result?.data?.[0]?.url || result?.url;
//       } else {
//         toast({
//           title: "Failed",
//           description: "File Upload failed!",
//           variant: "destructive",
//         });
//         throw new Error(result.message || "Upload failed");
//       }
//     } catch (error) {
//       // setUploadedFiles((prev) =>
//       //   prev.map((f) =>
//       //     fileObjects.find((fo) => fo.id === f.id)
//       //       ? { ...f, status: "error", error: (error as Error).message }
//       //       : f
//       //   )
//       // );
//     } finally {
//       setIsUploading(false);
      
//     }
//   };
  const uploadFile = async (file: File, isReplace = false): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append(
      "description",
      isReplace ? "Profile image replacement" : "Profile image upload"
    );
    formData.append("tags", "profile,avatar");

    const response = await fetch(apiEndpoint, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (
              response.success &&
              response.files &&
              response.files.length > 0
            ) {
              resolve(response.files[0].url || response.files[0].id);
            } else {
              reject(new Error("Invalid response format"));
            }
          } catch (parseError) {
            reject(new Error("Failed to parse response"));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || `HTTP ${xhr.status}`));
          } catch (parseError) {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error occurred"));
      });

      xhr.open("POST", apiEndpoint);

      // Add authorization header if token exists
      const token = localStorage.getItem("token");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  };

  const handleFileSelect = useCallback(
    async (file: File, isReplace = false) => {
      setError(null);
      setUploadProgress(0);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        // Create preview
        const preview = await createPreview(file);
        setPreviewUrl(preview);
        setIsUploading(true);

        let imageUrl: string;

        if (isReplace && onReplace) {
          imageUrl = await onReplace(file);
        } else if (!isReplace && onUpload) {
          imageUrl = await onUpload(file);
        } else {
          // Fallback to direct API call
          imageUrl = await uploadFile(file, isReplace);
        }

        setPreviewUrl(null);
        setShowActions(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Upload failed");
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [onUpload, onReplace, allowedTypes, maxSize, apiEndpoint]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isReplace = !!currentImage;
      handleFileSelect(file, isReplace);
    }
    // Reset input value
    e.target.value = "";
  };

  const handleRemove = async () => {
    if (!onRemove) return;

    try {
      setIsUploading(true);
      await onRemove();
      setShowActions(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Remove failed");
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const currentImageUrl = previewUrl || currentImage;
  const hasImage = !!currentImageUrl;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Image Container */}
      <div
        className={`
          ${sizeClasses[size]} 
          relative rounded-full overflow-hidden border-2 border-gray-200 
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${!hasImage ? "bg-gray-100" : ""}
          transition-all duration-200 hover:border-gray-300
        `}
        onMouseEnter={() => !disabled && setShowActions(true)}
        onMouseLeave={() => !disabled && setShowActions(false)}
        onClick={!disabled ? openFileDialog : undefined}
      >
        {/* Image or Placeholder */}
        {hasImage ? (
          <img
            src={currentImageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            {placeholder || (
              <User className={`${iconSizes[size]} text-gray-400`} />
            )}
          </div>
        )}

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-white text-xs font-medium">
                {uploadProgress > 0 ? `${uploadProgress}%` : "Uploading..."}
              </div>
            </div>
          </div>
        )}

        {/* Hover Actions Overlay */}
        {showActions && !isUploading && !disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                title={hasImage ? "Replace image" : "Upload image"}
              >
                {hasImage ? (
                  <Edit3 className="w-4 h-4 text-white" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </button>

              {hasImage && showRemoveButton && onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="p-2 bg-red-500 bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload Button for No Image State */}
      {!hasImage && !isUploading && (
        <button
          onClick={openFileDialog}
          disabled={disabled}
          className={`
            absolute -bottom-2 -right-2 p-2 bg-blue-500 text-white rounded-full shadow-lg
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}
            transition-colors
          `}
          title="Upload image"
        >
          <Camera className="w-4 h-4" />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm whitespace-nowrap z-10">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
