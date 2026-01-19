import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { INotification, INotificationCreate } from '@/types/notification';

import { notificationService } from '@/services/notificationService';

import {
  addNotification,
  clearActionStatus,
  clearDetailsStatus,
  deleteNotification,
  markAllAsRead,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setNotifications,
  setPagination,
  setSelectedNotification,
  setUnreadCount,
  updateNotification,
} from '@/store/slices/notificationSlice';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const {
    notifications,
    selectedNotification,
    unreadCount,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.notifications);

  const loadNotifications = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response = await notificationService.getNotifications(params);
        dispatch(setNotifications(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load notifications'
            : 'Failed to load notifications';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadNotification = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response = await notificationService.getNotification(id);
        dispatch(setSelectedNotification(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load notification'
            : 'Failed to load notification';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createNotification = useCallback(
    async (data: INotificationCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await notificationService.createNotification(data);
        dispatch(addNotification(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create notification'
            : 'Failed to create notification';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const markNotificationAsRead = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await notificationService.markNotificationAsRead(id);
        dispatch(updateNotification(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to mark notification as read'
            : 'Failed to mark notification as read';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      dispatch(setActionStatus({ status: Status.LOADING }));
      await notificationService.markAllNotificationsAsRead();
      dispatch(markAllAsRead());
      dispatch(setActionStatus({ status: Status.SUCCESS }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message ||
            error?.message ||
            'Failed to mark all notifications as read'
          : 'Failed to mark all notifications as read';
      dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
      throw error;
    }
  }, [dispatch]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      dispatch(setUnreadCount(response.count));
      return response.count;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Failed to load unread count'
          : 'Failed to load unread count';
      console.error(errorMessage);
      return 0;
    }
  }, [dispatch]);

  const removeNotification = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await notificationService.deleteNotification(id);
        dispatch(deleteNotification(id));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete notification'
            : 'Failed to delete notification';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getNotificationById = useCallback(
    (id: number) => {
      if (selectedNotification && selectedNotification.id === id) {
        return;
      }
      const notification = notifications.find((n: INotification) => n.id === id);
      if (notification) {
        dispatch(setSelectedNotification(notification));
      } else {
        loadNotification(id);
      }
    },
    [notifications, dispatch, loadNotification],
  );

  const clearStatuses = useCallback(() => {
    dispatch(clearActionStatus());
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  return {
    notifications,
    selectedNotification,
    unreadCount,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadNotifications,
    loadNotification,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loadUnreadCount,
    removeNotification,
    getNotificationById,
    clearStatuses,
  };
};
