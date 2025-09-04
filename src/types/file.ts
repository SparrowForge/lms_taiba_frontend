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

export enum FileType {
  PROFILE_PICTURE = 'profile_picture',
  DOCUMENT = 'document',
  RECEIPT = 'receipt',
  CERTIFICATE = 'certificate',
  TRANSCRIPT = 'transcript',
  ID_CARD = 'id_card',
  PHOTO = 'photo',
  // LMS-specific file types
  COURSE_MATERIAL = 'course_material',
  VIDEO_LECTURE = 'video_lecture',
  ASSIGNMENT = 'assignment',
  SYLLABUS = 'syllabus',
  LECTURE_NOTES = 'lecture_notes',
  PRESENTATION = 'presentation',
  QUIZ = 'quiz',
  EXAM = 'exam',
  PROJECT = 'project',
  OTHER = 'other',
}

export enum FileCategory {
  PERSONAL = 'personal',
  ACADEMIC = 'academic',
  FINANCIAL = 'financial',
  MEDICAL = 'medical',
  ADMINISTRATIVE = 'administrative',
  // LMS-specific categories
  COURSE_CONTENT = 'course_content',
  ASSESSMENT = 'assessment',
  LEARNING_RESOURCE = 'learning_resource',
  OTHER = 'other',
}

export enum EntityType {
  COURSE_MATERIAL = 'course-materials',
  VIDEO_LECTURE = 'video_lecture',
  ASSIGNMENT = 'assignment',
  SYLLABUS = 'syllabus',
  LECTURE_NOTES = 'lecture_notes',
  PRESENTATION = 'presentation',
  QUIZ = 'quiz',
  EXAM = 'exam',
  PROJECT = 'project',
}
