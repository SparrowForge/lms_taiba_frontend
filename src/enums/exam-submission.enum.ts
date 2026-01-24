import { IStatusOption } from '@/types/statusSelect';

export enum ExamSubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review',
  FINISHED = 'finished',
}

export const EXAM_SUBMISSION_STATUS_OPTIONS: IStatusOption[] = Object.values(ExamSubmissionStatus).map(
  (status) => ({
    key: `exam_submission_status_${status}`,
    value: status,
    labelKey: `exam_submission_status_${status}`,
  }),
);
