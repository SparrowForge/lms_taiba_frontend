import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

// Root state type
export interface RootState {
  auth: ReturnType<typeof authReducer>
}

// Create store
export const store = configureStore({
  reducer: {
    auth: authReducer,
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
