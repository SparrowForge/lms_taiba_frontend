import {useState} from 'react';
import {toast} from 'react-toastify';

import {Status} from '@/enums';

import {IFileUploadRequest, IFileUploadResponse} from '@/types/file';

import {fileService} from '@/services/fileService';

export const useFiles = () => {
  const [uploadStatus, setUploadStatus] = useState<Status>(Status.INITIAL);
  const [uploadedFile, setUploadedFile] = useState<IFileUploadResponse | null>(null);

  const uploadFile = async (data: IFileUploadRequest): Promise<IFileUploadResponse | null> => {
    try {
      setUploadStatus(Status.LOADING);
      const response = await fileService.uploadFile(data);
      setUploadedFile(response);
      setUploadStatus(Status.SUCCESS);
      toast.success(response.message || 'File uploaded successfully');
      return response;
    } catch (error: unknown) {
      setUploadStatus(Status.FAILED);
      let errorMessage = 'Failed to upload file';

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }

      toast.error(errorMessage);
      return null;
    }
  };

  const resetUpload = () => {
    setUploadStatus(Status.INITIAL);
    setUploadedFile(null);
  };

  return {
    uploadFile,
    uploadStatus,
    uploadedFile,
    resetUpload,
    isUploading: uploadStatus === Status.LOADING,
    isUploadSuccess: uploadStatus === Status.SUCCESS,
    isUploadError: uploadStatus === Status.FAILED,
  };
};
