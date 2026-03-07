import { IStudent } from './student';

export interface IStudentFamily {
  id: number;
  studentId: number;
  fatherName: string;
  fatherAddress: string;
  fatherPhone: string;
  fatherEmail: string;
  motherName: string;
  motherPhone: string;
  motherEmail: string;
  noOfSiblings: number;
  siblingsIds: number[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  student: IStudent;
  documentsFiles?: IDocumentFile[] | null;
}

export interface IStudentFamilyCreate {
  studentId: number;
  fatherName: string;
  fatherAddress: string;
  fatherPhone: string;
  fatherEmail: string;
  motherName: string;
  motherPhone: string;
  motherEmail: string;
  noOfSiblings: number;
  siblingsIds: number[];
  
}

export interface IStudentFamilyUpdate {
  studentId?: number;
  fatherName?: string;
  fatherAddress?: string;
  fatherPhone?: string;
  fatherEmail?: string;
  motherName?: string;
  motherPhone?: string;
  motherEmail?: string;
  noOfSiblings?: number;
  siblingsIds?: number[];
   documents?: {
    [key: string]: number
  }
}

export interface IDocumentFile {
  id: number
  fileName: string
  originalName: string
  filePath: string
  fileSize: string
  mimeType: string
  fileType: string
  fileCategory: string
  uploadedBy: number
  uploadedAt: string
  updatedAt: string
}