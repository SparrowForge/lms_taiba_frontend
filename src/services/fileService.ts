import {IFileUploadRequest, IFileUploadResponse} from '@/types/file';

import {api} from '@/lib/axios';

export const fileService = {
  uploadFile: async (data: IFileUploadRequest): Promise<IFileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', data.file);

    if (data.fileType) {
      formData.append('fileType', data.fileType);
    }

    if (data.fileCategory) {
      formData.append('fileCategory', data.fileCategory);
    }

    if (data.entityType) {
      formData.append('entityType', data.entityType);
    }

    if (data.entityId) {
      formData.append('entityId', data.entityId.toString());
    }

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const apiData = response.data;
    return {
      success: apiData.success,
      fileId: apiData.fileId,
      fileUrl: apiData.fileUrl,
      thumbnailUrl: apiData.thumbnailUrl,
      originalName: apiData.originalName,
      fileName: apiData.fileName,
      fileSize: apiData.fileSize,
      mimeType: apiData.mimeType,
      fileType: apiData.fileType,
      fileCategory: apiData.fileCategory,
      message: apiData.message,
    };
  },
};
