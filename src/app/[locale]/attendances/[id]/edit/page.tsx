'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import AttendanceForm from '@/components/attendances/AttendanceForm';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useAttendances} from '@/hooks/useAttendances';
import {useLocalization} from '@/hooks/useLocalization';

const AttendanceEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedAttendance, detailsStatus, loadAttendance } = useAttendances();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });

  useEffect(() => {
    const attendanceId = parseInt(resolvedParams.id);
    //getAttendanceById(attendanceId);
    loadAttendance(attendanceId);
  }, [resolvedParams.id, loadAttendance]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedAttendance || selectedAttendance.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/attendances" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <AttendanceForm
          mode="edit"
          attendanceId={parseInt(resolvedParams.id)}
          initialValues={selectedAttendance}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AttendanceEditPage;
