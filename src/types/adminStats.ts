export interface ICourseStats {
  total: number;
  active: number;
  inactive: number;
}

export interface ISubjectStats {
  total: number;
  active: number;
  inactive: number;
}

export interface IFacultyStats {
  total: number;
  active: number;
  inactive: number;
}

export interface IStudentStats {
  total: number;
  pending: number;
  active: number;
  inactive: number;
  graduated: number;
  dropped: number;
  suspended: number;
  transferred: number;
}

export interface IAcademicStats {
  totalExams: number;
  totalExamResults: number;
  publishedExamResults: number;
  totalExamSubmissions: number;
  totalSubjectResults: number;
  publishedSubjectResults: number;
  totalSemesterResults: number;
  publishedSemesterResults: number;
}

export interface IRecentActivity {
  thisMonth: number;
  thisYear: number;
}

export interface IRecentActivityStats {
  courses: IRecentActivity;
  subjects: IRecentActivity;
  students: IRecentActivity;
  faculty: IRecentActivity;
}

export interface IAdminStatistics {
  courses: ICourseStats;
  subjects: ISubjectStats;
  faculty: IFacultyStats;
  students: IStudentStats;
  totalBatches: number;
  totalSemesters: number;
  totalSections: number;
  totalDepartments: number;
  totalBranches: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  academic: IAcademicStats;
  recentActivity: IRecentActivityStats;
  studentsPerFaculty: number;
  subjectsPerCourse: number;
  studentsPerBatch: number;
  activeStudentPercentage: number;
}
