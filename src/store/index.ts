import {configureStore} from '@reduxjs/toolkit';

import {adminStatsApi} from './api/adminStatsApi';
import {classScheduleApi} from './api/classScheduleApi';
import {examApi} from './api/examApi';
import {studentApi} from './api/studentApi';
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
import examCandidateReducer from './slices/examCandidateSlice';
import examQuestionReducer from './slices/examQuestionSlice';
import examResultReducer from './slices/examResultSlice';
import examScheduleReducer from './slices/examScheduleSlice';
import examReducer from './slices/examSlice';
import examSubmissionReducer from './slices/examSubmissionSlice';
import examTypeReducer from './slices/examTypeSlice';
import facultyReducer from './slices/facultySlice';
import facultySubjectReducer from './slices/facultySubjectSlice';
import feeInstallmentPlanReducer from './slices/feeInstallmentPlanSlice';
import feePaymentCollectionReducer from './slices/feePaymentCollectionSlice';
import feePaymentDetailsReducer from './slices/feePaymentDetailsSlice';
import feeStructureReducer from './slices/feeStructureSlice';
import gradeRuleReducer from './slices/gradeRuleSlice';
import instituteReducer from './slices/instituteSlice';
import markDistributionReducer from './slices/markDistributionSlice';
import menuReducer from './slices/menuSlice';
import notificationReducer from './slices/notificationSlice';
import panelReducer from './slices/panelSlice';
import questionSetReducer from './slices/questionSetSlice';
import roleMenuPermissionReducer from './slices/roleMenuPermissionSlice';
import roleReducer from './slices/roleSlice';
import roomReducer from './slices/roomSlice';
import roomTypeReducer from './slices/roomTypeSlice';
import scheduleTypeReducer from './slices/scheduleTypeSlice';
import sectionReducer from './slices/sectionSlice';
import semesterReducer from './slices/semesterSlice';
import semesterSubjectReducer from './slices/semesterSubjectSlice';
import settingsReducer from './slices/settingsSlice';
import studentEducationReducer from './slices/studentEducationSlice';
import studentFamilyReducer from './slices/studentFamilySlice';
import studentProfileReducer from './slices/studentProfileSlice';
import studentReducer from './slices/studentSlice';
import subjectDiscussionReplyReducer from './slices/subjectDiscussionReplySlice';
import subjectDiscussionReducer from './slices/subjectDiscussionSlice';
import subjectResultReducer from './slices/subjectResultSlice';
import subjectReducer from './slices/subjectSlice';
import timeSlotReducer from './slices/timeSlotSlice';
import twofaReducer from './slices/twofaSlice';
import userRoleReducer from './slices/userRoleSlice';
import userReducer from './slices/userSlice';
import weekDayReducer from './slices/weekDaySlice';


// Root state type
export interface RootState {
  [adminStatsApi.reducerPath]: ReturnType<typeof adminStatsApi.reducer>;
  [classScheduleApi.reducerPath]: ReturnType<typeof classScheduleApi.reducer>;
  [examApi.reducerPath]: ReturnType<typeof examApi.reducer>;
  [studentApi.reducerPath]: ReturnType<typeof studentApi.reducer>;
  attendances: ReturnType<typeof attendanceReducer>;
  auth: ReturnType<typeof authReducer>;
  users: ReturnType<typeof userReducer>;
  panels: ReturnType<typeof panelReducer>;
  questionSets: ReturnType<typeof questionSetReducer>;
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
  subjectDiscussions: ReturnType<typeof subjectDiscussionReducer>;
  subjectDiscussionReplies: ReturnType<typeof subjectDiscussionReplyReducer>;
  batches: ReturnType<typeof batchReducer>;
  semesters: ReturnType<typeof semesterReducer>;
  semesterSubjects: ReturnType<typeof semesterSubjectReducer>;
  faculties: ReturnType<typeof facultyReducer>;
  facultySubjects: ReturnType<typeof facultySubjectReducer>;
  feeInstallmentPlans: ReturnType<typeof feeInstallmentPlanReducer>;
  feePaymentCollections: ReturnType<typeof feePaymentCollectionReducer>;
  feePaymentDetails: ReturnType<typeof feePaymentDetailsReducer>;
  feeStructures: ReturnType<typeof feeStructureReducer>;
  gradeRules: ReturnType<typeof gradeRuleReducer>;
  markDistributions: ReturnType<typeof markDistributionReducer>;
  notifications: ReturnType<typeof notificationReducer>;
  audits: ReturnType<typeof auditReducer>;
  userRoles: ReturnType<typeof userRoleReducer>;
  addresses: ReturnType<typeof addressReducer>;
  courseTypes: ReturnType<typeof courseTypeReducer>;
  exams: ReturnType<typeof examReducer>;
  examCandidates: ReturnType<typeof examCandidateReducer>;
  examQuestions: ReturnType<typeof examQuestionReducer>;
  examResults: ReturnType<typeof examResultReducer>;
  examSchedules: ReturnType<typeof examScheduleReducer>;
  examSubmissions: ReturnType<typeof examSubmissionReducer>;
  examTypes: ReturnType<typeof examTypeReducer>;
  rooms: ReturnType<typeof roomReducer>;
  roomTypes: ReturnType<typeof roomTypeReducer>;
  scheduleTypes: ReturnType<typeof scheduleTypeReducer>;
  sections: ReturnType<typeof sectionReducer>;
  employmentTypes: ReturnType<typeof employmentTypeReducer>;
  institutes: ReturnType<typeof instituteReducer>;
  twofa: ReturnType<typeof twofaReducer>
  students: ReturnType<typeof studentReducer>;
  studentEducations: ReturnType<typeof studentEducationReducer>;
  studentFamilies: ReturnType<typeof studentFamilyReducer>;
  studentProfiles: ReturnType<typeof studentProfileReducer>;
  timeSlots: ReturnType<typeof timeSlotReducer>;
  weekDays: ReturnType<typeof weekDayReducer>;
  classSchedules: ReturnType<typeof classScheduleReducer>;
  settings: ReturnType<typeof settingsReducer>;
  subjectResults: ReturnType<typeof subjectResultReducer>;
}

// Create store
export const store = configureStore({
  reducer: {
    [adminStatsApi.reducerPath]: adminStatsApi.reducer,
    [classScheduleApi.reducerPath]: classScheduleApi.reducer,
    [examApi.reducerPath]: examApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    attendances: attendanceReducer,
    auth: authReducer,
    users: userReducer,
    panels: panelReducer,
    questionSets: questionSetReducer,
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
    subjectDiscussions: subjectDiscussionReducer,
    subjectDiscussionReplies: subjectDiscussionReplyReducer,
    batches: batchReducer,
    semesters: semesterReducer,
    semesterSubjects: semesterSubjectReducer,
    faculties: facultyReducer,
    facultySubjects: facultySubjectReducer,
    feeInstallmentPlans: feeInstallmentPlanReducer,
    feePaymentCollections: feePaymentCollectionReducer,
    feePaymentDetails: feePaymentDetailsReducer,
    feeStructures: feeStructureReducer,
    gradeRules: gradeRuleReducer,
    markDistributions: markDistributionReducer,
    notifications: notificationReducer,
    audits: auditReducer,
    userRoles: userRoleReducer,
    addresses: addressReducer,
    courseTypes: courseTypeReducer,
    exams: examReducer,
    examCandidates: examCandidateReducer,
    examQuestions: examQuestionReducer,
    examResults: examResultReducer,
    examSchedules: examScheduleReducer,
    examSubmissions: examSubmissionReducer,
    examTypes: examTypeReducer,
    rooms: roomReducer,
    roomTypes: roomTypeReducer,
    scheduleTypes: scheduleTypeReducer,
    sections: sectionReducer,
    employmentTypes: employmentTypeReducer,
    institutes: instituteReducer,
    twofa:twofaReducer,
    students: studentReducer,
    studentEducations: studentEducationReducer,
    studentFamilies: studentFamilyReducer,
    studentProfiles: studentProfileReducer,
    timeSlots: timeSlotReducer,
    weekDays: weekDayReducer,
    classSchedules: classScheduleReducer,
    settings: settingsReducer,
    subjectResults:subjectResultReducer,
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
    }).concat(adminStatsApi.middleware, classScheduleApi.middleware, examApi.middleware, studentApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
