import { fetchData } from "@/lib/http";
import { ApiResponse } from "@/types/global";

export interface FileUploadOptions {
	category?: string;
	tags?: string[];
	uploadedBy?: string;
	relatedEntity?: string;
	relatedEntityId?: string;
	isPublic?: boolean;
}

class FileService {
	/**
	 * Upload single file
	 */
	async uploadFile(file: File, options: FileUploadOptions = {}, token?: string): Promise<ApiResponse> {
		try {
			const formData = new FormData();
			formData.append("files", file);

			if (options.category) formData.append("category", options.category);
			if (options.tags) formData.append("tags", JSON.stringify(options.tags));
			if (options.uploadedBy) formData.append("uploadedBy", options.uploadedBy);
			if (options.relatedEntity) formData.append("relatedEntity", options.relatedEntity);
			if (options.relatedEntityId) formData.append("relatedEntityId", options.relatedEntityId);
			if (options.isPublic !== undefined) formData.append("isPublic", String(options.isPublic));

			return await fetchData("/files/upload", {
				method: "POST",
				body: formData,
				token,
			});
		} catch (error) {
			console.error("Error uploading file:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Upload failed",
			};
		}
	}

	/**
	 * Upload multiple files
	 */
	async uploadFiles(files: File[], options: FileUploadOptions = {}, token?: string): Promise<ApiResponse> {
		try {
			const formData = new FormData();

			files.forEach((file) => {
				formData.append("files", file);
			});

			if (options.category) formData.append("category", options.category);
			if (options.tags) formData.append("tags", JSON.stringify(options.tags));
			if (options.uploadedBy) formData.append("uploadedBy", options.uploadedBy);
			if (options.relatedEntity) formData.append("relatedEntity", options.relatedEntity);
			if (options.relatedEntityId) formData.append("relatedEntityId", options.relatedEntityId);
			if (options.isPublic !== undefined) formData.append("isPublic", String(options.isPublic));

			return await fetchData("/files/upload", {
				method: "POST",
				body: formData,
				token,
			});
		} catch (error) {
			console.error("Error uploading files:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Upload failed",
			};
		}
	}

	/**
	 * Get file by ID
	 */
	async getFile(fileId: string, token?: string): Promise<ApiResponse> {
		return await fetchData(`/files/${fileId}`, {
			method: "GET",
			token,
		});
	}

	/**
	 * Delete file
	 */
	async deleteFile(fileId: string, token?: string): Promise<ApiResponse> {
		return await fetchData(`/files/${fileId}`, {
			method: "DELETE",
			token,
		});
	}

	/**
	 * Download file
	 */
	async downloadFile(fileId: string, token?: string): Promise<void> {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/files/${fileId}/download`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Download failed");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;

			// Get filename from Content-Disposition header if available
			const contentDisposition = response.headers.get("Content-Disposition");
			let filename = "download";
			if (contentDisposition) {
				const match = contentDisposition.match(/filename="?(.+)"?/i);
				if (match) {
					filename = match[1];
				}
			}

			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error downloading file:", error);
			throw error;
		}
	}
}

const fileService = new FileService();
export default fileService;
