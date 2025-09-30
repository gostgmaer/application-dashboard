"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Upload, Trash2, Download, Edit } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/useToast";
import { baseurl } from "@/config/setting";

// Define interfaces
export interface Attachment {
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

interface AttachmentData {
  data: {
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
  };
}

interface FileUploaderProps {
  title?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  fileTypeLabel?: string;
  multiple?: boolean;
  onFileChange?: (files: File[]) => void;
  initialFile?: Attachment | Attachment[] | null;
  apiEndpoint?: string;
  authToken: string;
}

interface Errors {
  file?: { message: string };
}

const FileUploader: React.FC<FileUploaderProps> = ({
  title = "Upload File",
  allowedTypes = ["image/jpeg", "image/png"],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  fileTypeLabel = "PNG, JPG up to 5MB",
  multiple = false,
  onFileChange = () => {},
  initialFile = null,
  apiEndpoint = "/attachments",
  authToken,
}) => {
  const [fileData, setFileData] = useState<Attachment | Attachment[] | null>(
    initialFile
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    Array.isArray(initialFile) ? null : initialFile?.fileUrl || null
  );
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = multiple
      ? Array.from(event.target.files || [])
      : ([event.target.files?.[0]].filter(Boolean) as File[]);
    if (!files.length) return;

    // Validate files
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type) || file.size > maxFileSize
    );
    if (invalidFiles.length) {
      setErrors({
        file: {
          message: `Invalid file(s). Allowed types: ${fileTypeLabel}. Max size: ${
            maxFileSize / 1024 / 1024
          }MB`,
        },
      });
      return;
    }

    setErrors({});
    if (!multiple && files[0]) {
      setPreviewUrl(URL.createObjectURL(files[0]));
      uploadFile(files[0]);
    } else {
      files.forEach(uploadFile);
    }
    onFileChange(files);
  };

  // Upload file to API
  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data: response } = await axios.post<AttachmentData>(
        `${baseurl}${apiEndpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (!multiple) {
           console.log(response.data, fileData);
        setFileData(response.data);
        setPreviewUrl(response.data.signedUrl || response.data.fileUrl);
      } else {
        setFileData((prev) => [
          ...(Array.isArray(prev) ? prev : []),
          response.data,
        ]);
      }
      console.log(response.data, "fileData");
      toast({ title: "Success", description: "File uploaded successfully" });
    } catch (error: any) {
      const message =
        error.response?.data?.error || `Failed to upload ${file.name}`;
      setErrors({ file: { message } });
      toast({ title: "Error", description: message });
    }
  };

  // View file (fetch metadata and URL)
  const viewFile = async () => {
    if (!multiple && (fileData as Attachment)?._id) {
      try {
        const response = await axios.get<Attachment>(
          `${baseurl}${apiEndpoint}/${(fileData as Attachment)._id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setFileData(response.data);
        setPreviewUrl(response.data.signedUrl || response.data.fileUrl);
        toast({ title: "Success", description: "File metadata refreshed" });
      } catch (error: any) {
        const message = error.response?.data?.error || "Failed to fetch file";
        toast({ title: "Error", description: message });
      }
    }
  };

  // Download file
  const downloadFile = async () => {
    if (
      (!multiple && (fileData as Attachment)?.signedUrl) ||
      (fileData as Attachment)?.fileUrl
    ) {
      try {
        const url =
          (fileData as Attachment).signedUrl ||
          (fileData as Attachment).fileUrl;
        const link = document.createElement("a");
        link.href = url;
        link.download = (fileData as Attachment).fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Success", description: "File download initiated" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to download file" });
      }
    }
  };

  // Rename file
  const renameFile = async () => {
    if (!newFileName.trim() || !(fileData as Attachment)?._id) {
      setErrors({ file: { message: "Valid file name is required" } });
      return;
    }

    try {
      const response = await axios.patch<Attachment>(
        `${baseurl}${apiEndpoint}/${(fileData as Attachment)._id}/rename`,
        { newFileName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setFileData(response.data);
      setPreviewUrl(response.data.signedUrl || response.data.fileUrl);
      setIsRenaming(false);
      setNewFileName("");
      toast({ title: "Success", description: "File renamed successfully" });
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to rename file";
      setErrors({ file: { message } });
      toast({ title: "Error", description: message });
    }
  };

  // Remove file
  const removeFile = async () => {
    if (!(fileData as Attachment)?._id) return;

    try {
      await axios.delete(
        `${baseurl}${apiEndpoint}/${(fileData as Attachment)._id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setFileData(null);
      setPreviewUrl(null);
      setErrors({});
      toast({ title: "Success", description: "File removed successfully" });
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to remove file";
      toast({ title: "Error", description: message });
    }
  };

  return (
    <Card className="bg-gray-900 text-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-6 bg-orange-400 rounded-full"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-gray-800">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="text-xs text-gray-400">{fileTypeLabel}</p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-600 text-gray-200 hover:bg-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Choose File{multiple ? "s" : ""}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={allowedTypes.join(",")}
              multiple={multiple}
              onChange={handleFileChange}
            />
          </div>
        </div>
        {fileData && previewUrl && !multiple && (
          <div className="mt-4 flex items-center gap-2">
            <Image
              src={
                (fileData as Attachment).fileUrl ||
                (fileData as Attachment).signedUrl ||
                previewUrl
              }
              alt={(fileData as Attachment).fileName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-blue-400"
              onClick={viewFile}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-green-400"
              onClick={downloadFile}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-yellow-400"
              onClick={() => setIsRenaming(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-red-400"
              onClick={removeFile}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
        {isRenaming && !multiple && (
          <div className="mt-4 flex items-center gap-2">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter new file name"
              className="bg-gray-800 text-white border-gray-600"
            />
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-200"
              onClick={renameFile}
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-200"
              onClick={() => {
                setIsRenaming(false);
                setNewFileName("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
        {errors.file && (
          <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
