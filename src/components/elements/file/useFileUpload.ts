import { useState, useCallback } from 'react';

interface UploadOptions {
  apiEndpoint?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

interface UseFileUploadReturn {
  uploadFiles: (files: File[], options?: UploadOptions) => Promise<any>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: File[], options: UploadOptions = {}) => {
    const {
      apiEndpoint = '/api/files/upload',
      onSuccess,
      onError,
      onProgress
    } = options;

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progressPercent = Math.round((event.loaded / event.total) * 100);
            setProgress(progressPercent);
            onProgress?.(progressPercent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              onSuccess?.(response);
              resolve(response);
            } catch (parseError) {
              const error = new Error('Invalid response format');
              setError(error.message);
              onError?.(error);
              reject(error);
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              const error = new Error(errorResponse.message || `HTTP ${xhr.status}`);
              setError(error.message);
              onError?.(error);
              reject(error);
            } catch (parseError) {
              const error = new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
              setError(error.message);
              onError?.(error);
              reject(error);
            }
          }
        });

        xhr.addEventListener('error', () => {
          const error = new Error('Network error occurred');
          setError(error.message);
          onError?.(error);
          reject(error);
        });

        xhr.open('POST', apiEndpoint);
        
        // Add authorization header if token exists
        const token = localStorage.getItem('token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploadFiles,
    isUploading,
    progress,
    error,
    reset
  };
};