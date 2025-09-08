export interface IFileUploadResponse {
  success: boolean;
  fileId: number;
  fileUrl: string;
  thumbnailUrl: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileType: string;
  fileCategory: string;
  message: string;
}

export interface IFileUploadRequest {
  file: File;
  fileType?: string;
  fileCategory?: string;
  entityType?: string;
  entityId?: number;
}

export interface IFile {
  id: number;
  fileUrl: string;
  thumbnailUrl?: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileType: string;
  fileCategory: string;
  createdAt: string;
  updatedAt: string;
}
