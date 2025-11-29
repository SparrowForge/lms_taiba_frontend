'use client';

import { InboxOutlined } from '@ant-design/icons';
import { message, Typography, Upload as AntUpload, Upload } from 'antd';
import { useEffect, useState } from 'react';

import { useFiles } from '@/hooks/useFiles';
import { toast } from 'react-toastify';

const { Text } = Typography;
const { Dragger } = AntUpload;

interface FileUploadProps {
  value?: number;
  onChange?: (fileId: number | undefined) => void;
  fileType?: string;
  fileCategory?: string;
  entityType?: string;
  entityId?: number;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  fileType = 'course_material',
  fileCategory = 'educational',
  entityType,
  entityId,
  accept = '*/*',
  maxSize = 10, // 10MB default
  disabled = false,
}) => {
  const { uploadFile, isUploading, uploadedFile, resetUpload } = useFiles();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (uploadedFile) {
      setFileList([
        {
          uid: uploadedFile.fileId,
          name: uploadedFile.originalName,
          status: 'done',
          url: uploadedFile.fileUrl,
          response: uploadedFile,
        },
      ]);
      onChange?.(uploadedFile.fileId);
    }
  }, [uploadedFile, onChange]);

  const handleUpload = async (file: File) => {

  const isPDF =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPDF) {
    toast.error("Only PDF files are allowed!");
    return Upload.LIST_IGNORE; // <— IMPORTANT! Block the file
  }


    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      message.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    const result = await uploadFile({
      file,
      fileType: fileType,
      fileCategory: fileCategory,
      entityType: entityType,
      entityId: entityId,
    });

    if (result) {
      setFileList([
        {
          uid: result.fileId,
          name: result.originalName,
          status: 'done',
          url: result.fileUrl,
          response: result,
        },
      ]);
    }

    return false; // Prevent default upload behavior
  };

  const handleRemove = () => {
    setFileList([]);
    resetUpload();
    onChange?.(undefined);
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: handleUpload,
    onRemove: handleRemove,
    disabled: disabled || isUploading,
    showUploadList: {
      showDownloadIcon: false,
      showRemoveIcon: true,
    },
    accept,
    listType: 'text' as const,
  };

  return (
    <div className="file-upload-container">
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {isUploading ? 'Uploading...' : 'Click or drag file to this area to upload'}
        </p>
        <p className="ant-upload-hint">
          Support for single file upload. Maximum file size: {maxSize}MB
        </p>
      </Dragger>
    </div>
  );
};

export default FileUpload;
