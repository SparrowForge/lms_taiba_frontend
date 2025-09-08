'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useCreateAttendanceDetailsConfig} from '@/components/attendances/attendanceConfig';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useAttendances} from '@/hooks/useAttendances';
import {useLocalization} from '@/hooks/useLocalization';

import {IAttendance} from '@/types/attendance';

export default function AttendanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedAttendance, detailsStatus, loadAttendance } = useAttendances();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });

  const resolvedParams = React.use(params);
  const attendanceId = parseInt(resolvedParams.id);

  // Load attendance if not already loaded
  useEffect(() => {
    //getAttendanceById(attendanceId);
    loadAttendance(attendanceId);
  }, [loadAttendance, attendanceId]);

  const config = useCreateAttendanceDetailsConfig(
    selectedAttendance,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IAttendance>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
