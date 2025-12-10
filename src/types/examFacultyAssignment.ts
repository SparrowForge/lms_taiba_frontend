export interface FacultyAssignment {
  facultyId: number;
  canCreateQuestionSet: boolean;
  canAddQuestions: boolean;
}

export interface IExamFacultyAssignmentCreate {
  examId: number;
  facultyAssignments: FacultyAssignment[];
}
