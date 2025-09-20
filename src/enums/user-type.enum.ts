export enum UserType {
  ADMIN = 'admin',
  FACULTY = 'faculty',
  STUDENT = 'student',
  EMPLOYEE = 'employee',
}

export const USER_TYPE_OPTIONS = [
  { key: 'user_type_admin', value: UserType.ADMIN, labelKey: 'user_type_admin' },
  { key: 'user_type_faculty', value: UserType.FACULTY, labelKey: 'user_type_faculty' },
  { key: 'user_type_student', value: UserType.STUDENT, labelKey: 'user_type_student' },
  { key: 'user_type_employee', value: UserType.EMPLOYEE, labelKey: 'user_type_employee' },
];
