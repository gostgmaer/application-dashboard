'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, Upload, Trash2, Download, Edit, FileIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/hooks/useToast';


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

interface FileUploaderProps {
  title?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  fileTypeLabel?: string;
  onFilesChange?: (files: File[]) => void;
  initialFiles?: Attachment[];
  apiEndpoint?: string;
  authToken: string;
}

interface Errors {
  file?: { message: string };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const MultiFileUploader: React.FC<FileUploaderProps> = ({
  title = 'Upload Files',
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  fileTypeLabel = 'PNG, JPG, PDF up to 5MB',
  onFilesChange = () => {},
  initialFiles = [],
  apiEndpoint = '/attachments',
  authToken,
}) => {
  const [filesData, setFilesData] = useState<Attachment[]>(initialFiles);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialFiles.map(file => file.fileUrl || ''));
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    // Validate files
    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type) || file.size > maxFileSize
    );
    if (invalidFiles.length) {
      setErrors({
        file: {
          message: `Invalid file(s). Allowed types: ${fileTypeLabel}. Max size: ${maxFileSize / 1024 / 1024}MB`,
        },
      });
      return;
    }

    setErrors({});
    selectedFiles.forEach((file) => {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, localPreview]);
      uploadFile(file);
    });
    onFilesChange(selectedFiles);
  };

  // Upload file to API
  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<Attachment>(`${API_BASE_URL}${apiEndpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFilesData((prev) => [...prev, response.data]);
      setPreviewUrls((prev) => {
        const newPreviews = [...prev];
        newPreviews[prev.length - 1] = response.data.signedUrl || response.data.fileUrl;
        return newPreviews;
      });
      toast({ title: 'Success', description: `${file.name} uploaded successfully` });
    } catch (error: any) {
      const message = error.response?.data?.error || `Failed to upload ${file.name}`;
      setErrors({ file: { message } });
      toast({ title: 'Error', description: message });
    }
  };

  // View file (fetch metadata and URL)
  const viewFile = async (fileId: string, index: number) => {
    try {
      const response = await axios.get<Attachment>(`${API_BASE_URL}${apiEndpoint}/${fileId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFilesData((prev) => {
        const newFiles = [...prev];
        newFiles[index] = response.data;
        return newFiles;
      });
      setPreviewUrls((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = response.data.signedUrl || response.data.fileUrl;
        return newPreviews;
      });
      toast({ title: 'Success', description: 'File metadata refreshed' });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch file';
      toast({ title: 'Error', description: message });
    }
  };

  // Download file
  const downloadFile = async (file: Attachment) => {
    if (!file?.signedUrl && !file?.fileUrl) return;

    try {
      const url = file.signedUrl || file.fileUrl;
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: 'Success', description: `${file.fileName} download initiated` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download file' });
    }
  };

  // Start renaming
  const startRenaming = (fileId: string, currentName: string) => {
    setRenamingId(fileId);
    setNewFileName(currentName);
  };

  // Rename file
  const renameFile = async (fileId: string, index: number) => {
    if (!newFileName.trim()) {
      setErrors({ file: { message: 'Valid file name is required' } });
      return;
    }

    try {
      const response = await axios.patch<Attachment>(
        `${API_BASE_URL}${apiEndpoint}/${fileId}/rename`,
        { newFileName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setFilesData((prev) => {
        const newFiles = [...prev];
        newFiles[index] = response.data;
        return newFiles;
      });
      setPreviewUrls((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = response.data.signedUrl || response.data.fileUrl;
        return newPreviews;
      });
      setRenamingId(null);
      setNewFileName('');
      toast({ title: 'Success', description: 'File renamed successfully' });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to rename file';
      setErrors({ file: { message } });
      toast({ title: 'Error', description: message });
    }
  };

  // Remove file
  const removeFile = async (fileId: string, index: number) => {
    try {
      await axios.delete(`${API_BASE_URL}${apiEndpoint}/${fileId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFilesData((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
      toast({ title: 'Success', description: 'File removed successfully' });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to remove file';
      toast({ title: 'Error', description: message });
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
              Choose Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={allowedTypes.join(',')}
              multiple={true}
              onChange={handleFileChange}
            />
          </div>
        </div>
        {filesData.length > 0 && (
          <div className="mt-4 space-y-4">
            {filesData.map((file, index) => (
              <div key={file._id} className="flex items-center gap-2 border-b border-gray-700 pb-2">
                {previewUrls[index] && file.fileType.startsWith('image/') ? (
                  <Image
                    src={previewUrls[index]}
                    alt={file.fileName}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <FileIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <p className="text-sm text-white flex-1">{file.fileName}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-blue-400"
                  onClick={() => viewFile(file._id, index)}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-green-400"
                  onClick={() => downloadFile(file)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-yellow-400"
                  onClick={() => startRenaming(file._id, file.fileName)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-red-400"
                  onClick={() => removeFile(file._id, index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {renamingId && (
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
              onClick={() => {
                const index = filesData.findIndex(file => file._id === renamingId);
                renameFile(renamingId, index);
              }}
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-200"
              onClick={() => {
                setRenamingId(null);
                setNewFileName('');
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

export default MultiFileUploader;