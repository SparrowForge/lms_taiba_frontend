export interface ISubjectExamResult {
  id: number;
  studentId: number;
  semesterId: number;
  subjectId: number;
  courseId: number;
  batchId: number;
  sectionId: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  status: string;
  remarks: string | null;
  publishedAt: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    applicationNo: string;
    cardNo: string;
  };
  semester: {
    id: number;
    name: string;
    termNo: number;
    startDate: string;
    endDate: string;
  };
  subject: {
    id: number;
    name: string;
    code: string;
    creditHours: number;
  };
  course: {
    id: number;
    name: string;
    code: string;
  };
  batch: {
    id: number;
    name: string;
    code: string;
    academicYear: number;
  };
  section: {
    id: number;
    name: string;
    code: string;
  };
}

export interface IPublishSubjectResultRequest {
  semesterId: number;
  subjectId: number;
}

export interface IPublishSubjectResultResponse {
  data: ISubjectExamResult[];
  publishedCount: number;
  message: string;
}
