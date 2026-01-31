export enum NotificationType {
  // Student lifecycle
  STUDENT_REGISTERED = 'student_registered',
  STUDENT_STATUS_CHANGED = 'student_status_changed',
  STUDENT_GRADUATED = 'student_graduated',
  STUDENT_ENROLLED = 'student_enrolled',

  // Assignments
  ASSIGNMENT_PUBLISHED = 'assignment_published',
  ASSIGNMENT_DUE_REMINDER = 'assignment_due_reminder',
  ASSIGNMENT_OVERDUE = 'assignment_overdue',
  ASSIGNMENT_SUBMITTED = 'assignment_submitted',
  ASSIGNMENT_GRADED = 'assignment_graded',
  ASSIGNMENT_FEEDBACK = 'assignment_feedback',

  // Course materials
  COURSE_MATERIAL_UPLOADED = 'course_material_uploaded',

  // Discussions
  DISCUSSION_CREATED = 'discussion_created',
  DISCUSSION_REPLY = 'discussion_reply',

  // Exams
  EXAM_SCHEDULED = 'exam_scheduled',
  EXAM_SCHEDULE_UPDATED = 'exam_schedule_updated',
  EXAM_SCHEDULE_CANCELLED = 'exam_schedule_cancelled',
  EXAM_REMINDER = 'exam_reminder',
  EXAM_RESULT_PUBLISHED = 'exam_result_published',
  EXAM_RESULT_UPDATED = 'exam_result_updated',

  // Attendance
  ATTENDANCE_MARKED = 'attendance_marked',
  LOW_ATTENDANCE_WARNING = 'low_attendance_warning',
  ATTENDANCE_REGULARIZED = 'attendance_regularized',

  // Fees
  FEE_PAYMENT_DUE = 'fee_payment_due',
  FEE_PAYMENT_OVERDUE = 'fee_payment_overdue',
  FEE_PAYMENT_RECEIVED = 'fee_payment_received',
  FEE_PAYMENT_FAILED = 'fee_payment_failed',

  // Schedules
  SCHEDULE_CREATED = 'schedule_created',
  SCHEDULE_UPDATED = 'schedule_updated',
  SCHEDULE_CANCELLED = 'schedule_cancelled',
  SCHEDULE_REMINDER = 'schedule_reminder',

  // System/Security
  PASSWORD_RESET = 'password_reset',
  PASSWORD_CHANGED = 'password_changed',
  ACCOUNT_LOCKED = 'account_locked',
  TWO_FA_CHANGED = 'two_fa_changed',
  ROLE_CHANGED = 'role_changed',
}

export enum NotificationCategory {
  ACADEMIC = 'academic',
  FINANCIAL = 'financial',
  ADMINISTRATIVE = 'administrative',
  SECURITY = 'security',
  SOCIAL = 'social',
  SYSTEM = 'system',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
