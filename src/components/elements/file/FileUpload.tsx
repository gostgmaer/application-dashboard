import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  File,
  Image,
  FileText,
  Video,
  Music,
  Archive,
  Pencil,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/useToast";

// -- INTERFACES ----------------------------------------------------------
interface FileUploadProps {
  multiple?: boolean;
  accept?: string;
  initialFiles?: {
    id?: string;
    url: string;
    name: string;
    size?: number;
    type?: string;
  }[];
  maxSize?: number;
  maxFiles?: number;
  onUpload?: (files: File[]) => Promise<void>;
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  apiEndpoint?: string;
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

// -- COMPONENT -----------------------------------------------------------
const FileUpload: React.FC<FileUploadProps> = ({
  multiple = false,
  accept = "*/*",
  initialFiles,
  maxSize = 10 * 1024 * 1024,
  maxFiles = multiple ? 10 : 1,
  onUpload,
  onFilesChange,
  disabled = false,
  className = "",
  apiEndpoint = "/files/upload",
}) => {
  const { data: session } = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // For renaming
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // For update/replace
  const hiddenFileReplaceRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // -- Utility functions

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const mapped = initialFiles.map((f) => {
        const browserFile =
          typeof window !== "undefined"
            ? new window.File([], f.name, {
                type: f.type || "application/octet-stream",
              })
            : ({} as File);

        return {
          file: browserFile,
          id: f.id || Math.random().toString(36).substr(2, 9),
          serverId: f.id,
          url: f.url,
          name: f.name,
          progress: 100,
          status: "success" as const,
        };
      });
      setUploadedFiles(mapped);
    }
  }, [initialFiles]);

  const getFileIcon = (file: File) => {
    console.log(file);

    const type = file.type.toLowerCase();
    if (type.startsWith("image/"))
      return <Image className="w-5 h-5 text-blue-500" />;
    if (type.startsWith("video/"))
      return <Video className="w-5 h-5 text-purple-500" />;
    if (type.startsWith("audio/"))
      return <Music className="w-5 h-5 text-green-500" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes("zip") || type.includes("rar"))
      return <Archive className="w-5 h-5 text-yellow-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const validateFile = (file: File): string | null => {
    if (file.size > maxSize)
      return `File size exceeds ${formatFileSize(maxSize)}`;
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isAccepted = acceptedTypes.some((acceptedType) => {
        if (acceptedType.startsWith("."))
          return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
        return file.type.match(acceptedType.replace("*", ".*"));
      });
      if (!isAccepted)
        return `File type not accepted. Accepted types: ${accept}`;
    }
    return null;
  };

  // ----------------------------- FILE HANDLING
  const handleFiles = useCallback(
    (files: FileList) => {
      const fileArray = Array.from(files);
      const currentFileCount = uploadedFiles.length;
      if (currentFileCount + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      const newFiles: UploadedFile[] = [];
      for (const file of fileArray) {
        const error = validateFile(file);
        newFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          progress: 0,
          status: error ? "error" : "pending",
          error: error || undefined,
          name: file.name,
        });
      }
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesChange?.(updatedFiles.map((f) => f.file));
      const validFiles = newFiles
        .filter((f) => f.status === "pending")
        .map((f) => f.file);
      if (validFiles.length > 0 && onUpload) {
        uploadFiles(
          validFiles,
          newFiles.filter((f) => f.status === "pending")
        );
      }
    },
    [uploadedFiles, maxFiles, onUpload, onFilesChange]
  );

  const uploadFiles = async (files: File[], fileObjects: UploadedFile[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      setUploadedFiles((prev) =>
        prev.map((f) =>
          fileObjects.find((fo) => fo.id === f.id)
            ? { ...f, status: "uploading", progress: 0 }
            : f
        )
      );
      // API call to upload files
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        // Sample handling: adapt to your API shape
        setUploadedFiles((prev) =>
          prev.map((f) =>
            fileObjects.find((fo) => fo.id === f.id)
              ? {
                  ...f,
                  status: "success",
                  progress: 100,
                  response: result,
                  serverId: result?.data?.[0]?.id || result?.id,
                  url: result?.data?.[0]?.url || result?.url,
                  name: f.file.name, // from file object or backend
                }
              : f
          )
        );

        if (onUpload) await onUpload(result?.data || result);
        toast({ title: "Success", description: "File Upload SuccessFul!" });
      } else {
        toast({
          title: "Failed",
          description: "File Upload failed!",
          variant: "destructive",
        });
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          fileObjects.find((fo) => fo.id === f.id)
            ? { ...f, status: "error", error: (error as Error).message }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  // -- FILE CRUD ---------------------
  const removeFile = (id: string, serverId?: string) => {
    // Optionally send DELETE to backend
    if (serverId) handleDelete(id, serverId);
    else {
      const updatedFiles = uploadedFiles.filter((f) => f.id !== id);
      setUploadedFiles(updatedFiles);
      onFilesChange?.(updatedFiles.map((f) => f.file));
    }
  };
  const handleDelete = async (id: string, serverId: string) => {
    try {
      await fetch(`/files/${serverId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } catch (err) {
      /* Optionally handle error */
    }
    const updatedFiles = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map((f) => f.file));
  };

  // -- Rename Logic
  const openRename = (file: UploadedFile) => {
    setRenamingId(file.id);
    setRenameValue(file.name || file.file.name);
  };
  const handleRename = async (file: UploadedFile) => {
    if (!renameValue.trim() || renameValue === file.name) {
      setRenamingId(null);
      return;
    }
    try {
      if (file.serverId) {
        await fetch(`/files/${file.serverId}/rename`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ name: renameValue }),
        });
      }
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, name: renameValue } : f))
      );
    } catch (err) {}
    setRenamingId(null);
  };

  // -- Update/Replace Logic
  const openReplaceDialog = (file: UploadedFile) => {
    setReplacingId(file.id);
    hiddenFileReplaceRef.current?.click();
  };
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!replacingId || !e.target.files?.[0]) return;
    const newFile = e.target.files[0];
    const idx = uploadedFiles.findIndex((f) => f.id === replacingId);
    if (idx === -1) return;
    const fileToReplace = uploadedFiles[idx];
    try {
      if (fileToReplace.serverId) {
        // Use your backend update endpoint
        const formData = new FormData();
        formData.append("file", newFile);
        const response = await fetch(
          `/files/${fileToReplace.serverId}/replace`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            body: formData,
          }
        );
        if (!response.ok) throw new Error("Update failed");
        const result = await response.json();
        setUploadedFiles((prev) =>
          prev.map((f, i) =>
            i === idx
              ? {
                  ...f,
                  file: newFile,
                  name: newFile.name,
                  url: result.url || f.url,
                  response: result,
                }
              : f
          )
        );
      }
    } catch (err) {
      /* Handle error */
    }
    // reset
    setReplacingId(null);
    if (hiddenFileReplaceRef.current) hiddenFileReplaceRef.current.value = "";
  };

  // -- EVENTS
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFiles(files);
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFiles(files);
    e.target.value = "";
  };
  const openFileDialog = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const getStatusColor = (status: UploadedFile["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "uploading":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />
        <Upload
          className={`mx-auto h-12 w-12 mb-4 ${
            isDragOver ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? "Drop files here" : "Upload files"}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop {multiple ? "files" : "a file"} here, or click to
            select
          </p>
          <p className="text-xs text-gray-400">
            {multiple && `Up to ${maxFiles} files, `}
            Max size: {formatFileSize(maxSize)}
            {accept !== "*/*" && ` • Accepted: ${accept}`}
          </p>
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium text-gray-900">
                Uploading...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            {multiple ? "Selected Files" : "Selected File"} (
            {uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className={`flex items-center justify-between p-3 gap-2 rounded-lg border ${getStatusColor(
                  uploadedFile.status
                )}`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(uploadedFile.file)}

                  <div className="flex-1 min-w-0">
                    {renamingId === uploadedFile.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleRename(uploadedFile);
                        }}
                        className="flex items-center gap-2"
                      >
                        <input
                          className="border p-1 rounded text-sm max-w-[160px]"
                          value={renameValue}
                          autoFocus
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleRename(uploadedFile)}
                        />
                        <button
                          type="submit"
                          className="ml-1 text-blue-600 hover:underline"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium truncate">
                          {uploadedFile.name || uploadedFile.file.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRename(uploadedFile);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Pencil className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    )}
                    <p className="text-xs opacity-75">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {uploadedFile.status === "uploading" && (
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        ></div>
                      </div>
                    )}
                    {uploadedFile.status === "success" && (
                      <span className="text-xs font-medium">✓ Uploaded</span>
                    )}
                    {uploadedFile.status === "error" && (
                      <span
                        className="text-xs font-medium"
                        title={uploadedFile.error}
                      >
                        ✗ Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center shrink-0">
                  {/* Download */}
                  {uploadedFile.url && (
                    <a
                      href={uploadedFile.url}
                      download={uploadedFile.name || uploadedFile.file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Download
                    </a>
                  )}
                  {/* View */}
                  {uploadedFile.url && (
                    <a
                      href={uploadedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View
                    </a>
                  )}
                  {/* Update/Replace */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openReplaceDialog(uploadedFile);
                    }}
                    className="text-xs text-yellow-700 hover:underline"
                    type="button"
                    disabled={uploadedFile.status === "uploading"}
                  >
                    Replace
                  </button>
                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(uploadedFile.id, uploadedFile.serverId);
                    }}
                    className="ml-3 p-1 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                    disabled={uploadedFile.status === "uploading"}
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Hidden input for Replace */}
      <input
        ref={hiddenFileReplaceRef}
        type="file"
        className="hidden"
        onChange={handleReplaceFile}
      />
    </div>
  );
};

export default FileUpload;
