/**
 * Status options for different entities
 * These are derived from the status enums for use in forms and dropdowns
 */

import {
  AttendanceStatus,
  ClassScheduleStatus,
  CourseAssignmentSubmissionStatus,
  EntityStatus,
  MaritalStatus,
  SemesterStatus,
  StudentStatus,
} from '@/enums/status';

import { IStatusOption } from '@/types/statusSelect';

// Entity Status Options (Active/Inactive)
export const ENTITY_STATUS_OPTIONS: IStatusOption[] = Object.values(EntityStatus).map((status) => ({
  key: `entity_${status}`,
  value: status,
  labelKey: `status_${status}`,
}));

// Semester Status Options
export const SEMESTER_STATUS_OPTIONS: IStatusOption[] = Object.values(SemesterStatus).map(
  (status) => ({
    key: `semester_${status}`,
    value: status,
    labelKey: `status_${status}`,
  }),
);

// Class Schedule Status Options
export const CLASS_SCHEDULE_STATUS_OPTIONS: IStatusOption[] = Object.values(
  ClassScheduleStatus,
).map((status) => ({
  key: `class_schedule_${status}`,
  value: status,
  labelKey: `status_${status}`,
}));

// Student Status Options
export const STUDENT_STATUS_OPTIONS: IStatusOption[] = Object.values(StudentStatus).map(
  (status) => ({
    key: `student_${status}`,
    value: status,
    labelKey: `status_${status}`,
  }),
);

// Attendance Status Options
export const ATTENDANCE_STATUS_OPTIONS: IStatusOption[] = Object.values(AttendanceStatus).map(
  (status) => ({
    key: `attendance_${status}`,
    value: status,
    labelKey: `attendance_${status.toLowerCase()}`,
  }),
);

// Course Assignment Submission Status Options
export const COURSE_ASSIGNMENT_SUBMISSION_STATUS_OPTIONS: IStatusOption[] = Object.values(
  CourseAssignmentSubmissionStatus,
).map((status) => ({
  key: `course_assignment_${status}`,
  value: status,
  labelKey: `assignment_${status}`,
}));

// Marital Status Options
export const MARITAL_STATUS_OPTIONS: IStatusOption[] = Object.values(MaritalStatus).map(
  (status) => ({
    key: `marital_${status}`,
    value: status,
    labelKey: `marital_${status}`,
  }),
);
