import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import panelReducer from './slices/panelSlice'
import branchReducer from './slices/branchSlice'
import departmentReducer from './slices/departmentSlice'
import roleReducer from './slices/roleSlice'
import menuReducer from './slices/menuSlice'
import roleMenuPermissionReducer from './slices/roleMenuPermissionSlice'
import courseReducer from './slices/courseSlice'
import subjectReducer from './slices/subjectSlice'
import batchReducer from './slices/batchSlice'
import semesterReducer from './slices/semesterSlice'
import semesterSubjectReducer from './slices/semesterSubjectSlice'

// Root state type
export interface RootState {
  auth: ReturnType<typeof authReducer>
  users: ReturnType<typeof userReducer>
  panels: ReturnType<typeof panelReducer>
  branches: ReturnType<typeof branchReducer>
  departments: ReturnType<typeof departmentReducer>
  roles: ReturnType<typeof roleReducer>
  menus: ReturnType<typeof menuReducer>
  roleMenuPermissions: ReturnType<typeof roleMenuPermissionReducer>
  courses: ReturnType<typeof courseReducer>
  subjects: ReturnType<typeof subjectReducer>
  batches: ReturnType<typeof batchReducer>
  semesters: ReturnType<typeof semesterReducer>
  semesterSubjects: ReturnType<typeof semesterSubjectReducer>
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
})

// Export types
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
