import { IStatusOption } from '@/types/statusSelect';

export enum ExamCandidateStatus {
  ALLOWED = 'allowed',
  ABSENT = 'absent',
  APPEARED = 'appeared',
  BARRED = 'barred',
}

// Exam Candidate Status Options
export const EXAM_CANDIDATE_STATUS_OPTIONS: IStatusOption[] = Object.values(ExamCandidateStatus).map(
  (status) => ({
    key: `exam_candidate_${status}`,
    value: status,
    labelKey: `exam_candidate_${status}`,
  }),
);

export enum ExamResultStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  WITHHELD = "withheld"
}

// Exam Result Status Options
export const EXAM_RESULT_STATUS_OPTIONS: IStatusOption[] = Object.values(ExamResultStatus).map(
  (status) => ({
    key: `exam_result_status_${status}`,
    value: status,
    labelKey: `exam_result_status_${status}`,
  }),
);

export enum CourseAssignment {
  HOMEWORK = 'homework',
  QUIZ = 'quiz',
  PROJECT = 'project',
  LAB = 'lab'
}
