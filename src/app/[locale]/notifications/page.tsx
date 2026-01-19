'use client';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {ScheduleView} from '@/components/dashboard/schedule';
import {MainLayout} from '@/components/layout/MainLayout';
import NotificationsPage from '../../../components/notifications/NotificationsPage';

export default function SchedulePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <NotificationsPage/>
      </MainLayout>
    </ProtectedRoute>
  );
}
