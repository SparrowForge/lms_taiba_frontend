import { IStatusOption } from '@/types/statusSelect';

export enum AssignmentType {
  HOMEWORK = 'homework',
  QUIZ = 'quiz',
  PROJECT = 'project',
  LAB = 'lab',
}

// Entity Status Options (Active/Inactive)
export const ASSIGNMENT_TYPE_OPTIONS: IStatusOption[] = Object.values(AssignmentType).map(
  (status) => ({
    key: `assignment_type_${status}`,
    value: status,
    labelKey: `assignment_type_${status}`,
  }),
);
