import { NotificationType } from "@/enums/notification.enum";

import { INotification } from "@/types/notification";



export function getNotificationRoute(
  notification: INotification
): string | null {
  const { type, resourceId } = notification;

  switch (type) {
    // ===== STUDENT =====
    case NotificationType.STUDENT_REGISTERED:
    case NotificationType.STUDENT_STATUS_CHANGED:
    case NotificationType.STUDENT_GRADUATED:
      return `/students/${resourceId}`;

    case NotificationType.STUDENT_ENROLLED:
      return `/enrollments/${resourceId}`;

    // ===== ASSIGNMENT =====
    case NotificationType.ASSIGNMENT_PUBLISHED:
    case NotificationType.ASSIGNMENT_DUE_REMINDER:
    case NotificationType.ASSIGNMENT_OVERDUE:
    case NotificationType.ASSIGNMENT_SUBMITTED:
    case NotificationType.ASSIGNMENT_GRADED:
    case NotificationType.ASSIGNMENT_FEEDBACK:
      return `/dashboard/course/${resourceId}?tab=assignments`;

    // ===== COURSE MATERIAL =====
    case NotificationType.COURSE_MATERIAL_UPLOADED:
      return `/course-materials/${resourceId}`;

    // ===== DISCUSSION =====
    case NotificationType.DISCUSSION_CREATED:
    case NotificationType.DISCUSSION_REPLY:
      return `/dashboard/course/${resourceId}?tab=discussions`;

    // ===== EXAMS =====
    case NotificationType.EXAM_SCHEDULED:
    case NotificationType.EXAM_SCHEDULE_UPDATED:
    case NotificationType.EXAM_SCHEDULE_CANCELLED:
    case NotificationType.EXAM_REMINDER:
      return `/exams/schedule/${resourceId}`;

    case NotificationType.EXAM_RESULT_PUBLISHED:
    case NotificationType.EXAM_RESULT_UPDATED:
      return `/exam-results/${resourceId}`;

    // ===== ATTENDANCE =====
    case NotificationType.ATTENDANCE_MARKED:
    case NotificationType.LOW_ATTENDANCE_WARNING:
    case NotificationType.ATTENDANCE_REGULARIZED:
      return `/attendance/${resourceId}`;

    // ===== FEES =====
    case NotificationType.FEE_PAYMENT_DUE:
    case NotificationType.FEE_PAYMENT_OVERDUE:
    case NotificationType.FEE_PAYMENT_RECEIVED:
    case NotificationType.FEE_PAYMENT_FAILED:
      return `/fees/${resourceId}`;

    // ===== SCHEDULE =====
    case NotificationType.SCHEDULE_CREATED:
    case NotificationType.SCHEDULE_UPDATED:
    case NotificationType.SCHEDULE_CANCELLED:
    case NotificationType.SCHEDULE_REMINDER:
      return `/schedules/${resourceId}`;

    // ===== SECURITY / SYSTEM =====
    case NotificationType.PASSWORD_RESET:
    case NotificationType.PASSWORD_CHANGED:
    case NotificationType.TWO_FA_CHANGED:
      return `/settings/security`;

    case NotificationType.ROLE_CHANGED:
      return `/settings/roles`;

    case NotificationType.ACCOUNT_LOCKED:
      return `/support`;

    default:
      return null;
  }
}
