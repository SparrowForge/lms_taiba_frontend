import { configureStore } from '@reduxjs/toolkit';

import addressReducer from './slices/addressSlice';
import attendanceReducer from './slices/attendanceSlice';
import auditReducer from './slices/auditSlice';
import authReducer from './slices/authSlice';
import batchReducer from './slices/batchSlice';
import branchReducer from './slices/branchSlice';
import classScheduleReducer from './slices/classScheduleSlice';
import courseAssignmentReducer from './slices/courseAssignmentSlice';
import courseAssignmentSubmissionReducer from './slices/courseAssignmentSubmissionSlice';
import courseMaterialReducer from './slices/courseMaterialSlice';
import courseReducer from './slices/courseSlice';
import courseTypeReducer from './slices/courseTypeSlice';
import departmentReducer from './slices/departmentSlice';
import employmentTypeReducer from './slices/employmentTypeSlice';
import facultyReducer from './slices/facultySlice';
import facultySubjectReducer from './slices/facultySubjectSlice';
import feeInstallmentPlanReducer from './slices/feeInstallmentPlanSlice';
import feeStructureReducer from './slices/feeStructureSlice';
import instituteReducer from './slices/instituteSlice';
import menuReducer from './slices/menuSlice';
import panelReducer from './slices/panelSlice';
import roleMenuPermissionReducer from './slices/roleMenuPermissionSlice';
import roleReducer from './slices/roleSlice';
import roomReducer from './slices/roomSlice';
import roomTypeReducer from './slices/roomTypeSlice';
import scheduleTypeReducer from './slices/scheduleTypeSlice';
import semesterReducer from './slices/semesterSlice';
import semesterSubjectReducer from './slices/semesterSubjectSlice';
import studentEducationReducer from './slices/studentEducationSlice';
import studentFamilyReducer from './slices/studentFamilySlice';
import studentProfileReducer from './slices/studentProfileSlice';
import studentReducer from './slices/studentSlice';
import subjectReducer from './slices/subjectSlice';
import timeSlotReducer from './slices/timeSlotSlice';
import userRoleReducer from './slices/userRoleSlice';
import userReducer from './slices/userSlice';
import weekDayReducer from './slices/weekDaySlice';

// Root state type
export interface RootState {
  attendances: ReturnType<typeof attendanceReducer>;
  auth: ReturnType<typeof authReducer>;
  users: ReturnType<typeof userReducer>;
  panels: ReturnType<typeof panelReducer>;
  branches: ReturnType<typeof branchReducer>;
  departments: ReturnType<typeof departmentReducer>;
  roles: ReturnType<typeof roleReducer>;
  menus: ReturnType<typeof menuReducer>;
  roleMenuPermissions: ReturnType<typeof roleMenuPermissionReducer>;
  courses: ReturnType<typeof courseReducer>;
  courseAssignments: ReturnType<typeof courseAssignmentReducer>;
  courseAssignmentSubmissions: ReturnType<typeof courseAssignmentSubmissionReducer>;
  courseMaterials: ReturnType<typeof courseMaterialReducer>;
  subjects: ReturnType<typeof subjectReducer>;
  batches: ReturnType<typeof batchReducer>;
  semesters: ReturnType<typeof semesterReducer>;
  semesterSubjects: ReturnType<typeof semesterSubjectReducer>;
  faculties: ReturnType<typeof facultyReducer>;
  facultySubjects: ReturnType<typeof facultySubjectReducer>;
  feeInstallmentPlans: ReturnType<typeof feeInstallmentPlanReducer>;
  feeStructures: ReturnType<typeof feeStructureReducer>;
  audits: ReturnType<typeof auditReducer>;
  userRoles: ReturnType<typeof userRoleReducer>;
  addresses: ReturnType<typeof addressReducer>;
  courseTypes: ReturnType<typeof courseTypeReducer>;
  rooms: ReturnType<typeof roomReducer>;
  roomTypes: ReturnType<typeof roomTypeReducer>;
  scheduleTypes: ReturnType<typeof scheduleTypeReducer>;
  employmentTypes: ReturnType<typeof employmentTypeReducer>;
  institutes: ReturnType<typeof instituteReducer>;
  students: ReturnType<typeof studentReducer>;
  studentEducations: ReturnType<typeof studentEducationReducer>;
  studentFamilies: ReturnType<typeof studentFamilyReducer>;
  studentProfiles: ReturnType<typeof studentProfileReducer>;
  timeSlots: ReturnType<typeof timeSlotReducer>;
  weekDays: ReturnType<typeof weekDayReducer>;
  classSchedules: ReturnType<typeof classScheduleReducer>;
}

// Create store
export const store = configureStore({
  reducer: {
    attendances: attendanceReducer,
    auth: authReducer,
    users: userReducer,
    panels: panelReducer,
    branches: branchReducer,
    departments: departmentReducer,
    roles: roleReducer,
    menus: menuReducer,
    roleMenuPermissions: roleMenuPermissionReducer,
    courses: courseReducer,
    courseAssignments: courseAssignmentReducer,
    courseAssignmentSubmissions: courseAssignmentSubmissionReducer,
    courseMaterials: courseMaterialReducer,
    subjects: subjectReducer,
    batches: batchReducer,
    semesters: semesterReducer,
    semesterSubjects: semesterSubjectReducer,
    faculties: facultyReducer,
    facultySubjects: facultySubjectReducer,
    feeInstallmentPlans: feeInstallmentPlanReducer,
    feeStructures: feeStructureReducer,
    audits: auditReducer,
    userRoles: userRoleReducer,
    addresses: addressReducer,
    courseTypes: courseTypeReducer,
    rooms: roomReducer,
    roomTypes: roomTypeReducer,
    scheduleTypes: scheduleTypeReducer,
    employmentTypes: employmentTypeReducer,
    institutes: instituteReducer,
    students: studentReducer,
    studentEducations: studentEducationReducer,
    studentFamilies: studentFamilyReducer,
    studentProfiles: studentProfileReducer,
    timeSlots: timeSlotReducer,
    weekDays: weekDayReducer,
    classSchedules: classScheduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
