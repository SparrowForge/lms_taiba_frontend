'use client';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {ScheduleView} from '@/components/dashboard/schedule';
import {MainLayout} from '@/components/layout/MainLayout';

export default function SchedulePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-3 md:p-6">
          <ScheduleView />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
