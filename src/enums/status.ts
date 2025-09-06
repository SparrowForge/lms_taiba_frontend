export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum SemesterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  UPCOMING = 'upcoming',
}

export enum ClassScheduleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
}

export enum StudentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  GRADUATED = 'graduated',
  DROPPED = 'dropped',
  SUSPENDED = 'suspended',
  TRANSFERRED = 'transferred',
}

export enum AttendanceStatus {
  PRESENT = 'p',
  ABSENT = 'a',
  LATE = 'l',
  LEAVE = 'x',
}

export enum CourseAssignmentSubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  LATE = 'late',
  RESUBMITTED = 'resubmitted',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}
