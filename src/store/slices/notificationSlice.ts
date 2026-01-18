import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { INotification } from '@/types/notification';

interface NotificationState {
  notifications: INotification[];
  selectedNotification: INotification | null;
  unreadCount: number;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: NotificationState = {
  notifications: [],
  selectedNotification: null,
  unreadCount: 0,
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setListStatus: (state, action: PayloadAction<IStatusState>) => {
      state.listStatus = action.payload;
    },
    setDetailsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.detailsStatus = action.payload;
    },
    setActionStatus: (state, action: PayloadAction<IStatusState>) => {
      state.actionStatus = action.payload;
    },
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    updateNotification: (state, action: PayloadAction<INotification>) => {
      const index = state.notifications.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].readAt;
        const isNowRead = !!action.payload.readAt;
        state.notifications[index] = action.payload;
        // Update unread count if notification was marked as read
        if (wasUnread && isNowRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    deleteNotification: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.readAt) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setSelectedNotification: (state, action: PayloadAction<INotification | null>) => {
      state.selectedNotification = action.payload;
    },
    setPagination: (state, action: PayloadAction<IPaginationMeta>) => {
      state.pagination = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        readAt: notification.readAt || new Date().toISOString(),
      }));
      state.unreadCount = 0;
    },
    clearActionStatus: (state) => {
      state.actionStatus = { status: Status.INITIAL };
    },
    clearDetailsStatus: (state) => {
      state.detailsStatus = { status: Status.INITIAL };
    },
  },
});

export const {
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setNotifications,
  addNotification,
  updateNotification,
  deleteNotification,
  setSelectedNotification,
  setPagination,
  setUnreadCount,
  markAllAsRead,
  clearActionStatus,
  clearDetailsStatus,
} = notificationSlice.actions;

export default notificationSlice.reducer;
