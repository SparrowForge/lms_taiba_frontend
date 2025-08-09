import {configureStore} from '@reduxjs/toolkit';

import addressReducer from './slices/addressSlice';
import auditReducer from './slices/auditSlice';
import authReducer from './slices/authSlice';
import batchReducer from './slices/batchSlice';
import branchReducer from './slices/branchSlice';
import courseReducer from './slices/courseSlice';
import courseTypeReducer from './slices/courseTypeSlice';
import departmentReducer from './slices/departmentSlice';
import employmentTypeReducer from './slices/employmentTypeSlice';
import facultyReducer from './slices/facultySlice';
import facultySubjectReducer from './slices/facultySubjectSlice';
import instituteReducer from './slices/instituteSlice';
import menuReducer from './slices/menuSlice';
import panelReducer from './slices/panelSlice';
import roleMenuPermissionReducer from './slices/roleMenuPermissionSlice';
import roleReducer from './slices/roleSlice';
import scheduleTypeReducer from './slices/scheduleTypeSlice';
import semesterReducer from './slices/semesterSlice';
import semesterSubjectReducer from './slices/semesterSubjectSlice';
import subjectReducer from './slices/subjectSlice';
import userRoleReducer from './slices/userRoleSlice';
import userReducer from './slices/userSlice';

// Root state type
export interface RootState {
  auth: ReturnType<typeof authReducer>;
  users: ReturnType<typeof userReducer>;
  panels: ReturnType<typeof panelReducer>;
  branches: ReturnType<typeof branchReducer>;
  departments: ReturnType<typeof departmentReducer>;
  roles: ReturnType<typeof roleReducer>;
  menus: ReturnType<typeof menuReducer>;
  roleMenuPermissions: ReturnType<typeof roleMenuPermissionReducer>;
  courses: ReturnType<typeof courseReducer>;
  subjects: ReturnType<typeof subjectReducer>;
  batches: ReturnType<typeof batchReducer>;
  semesters: ReturnType<typeof semesterReducer>;
  semesterSubjects: ReturnType<typeof semesterSubjectReducer>;
  faculties: ReturnType<typeof facultyReducer>;
  facultySubjects: ReturnType<typeof facultySubjectReducer>;
  audits: ReturnType<typeof auditReducer>;
  userRoles: ReturnType<typeof userRoleReducer>;
  addresses: ReturnType<typeof addressReducer>;
  courseTypes: ReturnType<typeof courseTypeReducer>;
  scheduleTypes: ReturnType<typeof scheduleTypeReducer>;
  employmentTypes: ReturnType<typeof employmentTypeReducer>;
  institutes: ReturnType<typeof instituteReducer>;
}

// Create store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    panels: panelReducer,
    branches: branchReducer,
    departments: departmentReducer,
    roles: roleReducer,
    menus: menuReducer,
    roleMenuPermissions: roleMenuPermissionReducer,
    courses: courseReducer,
    subjects: subjectReducer,
    batches: batchReducer,
    semesters: semesterReducer,
    semesterSubjects: semesterSubjectReducer,
    faculties: facultyReducer,
    facultySubjects: facultySubjectReducer,
    audits: auditReducer,
    userRoles: userRoleReducer,
    addresses: addressReducer,
    courseTypes: courseTypeReducer,
    scheduleTypes: scheduleTypeReducer,
    employmentTypes: employmentTypeReducer,
    institutes: instituteReducer,
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
