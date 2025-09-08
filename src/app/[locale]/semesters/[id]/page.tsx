'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateSemesterDetailsConfig} from '@/components/semesters/semesterConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';

import {ISemester} from '@/types/semester';

export default function SemesterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedSemester, detailsStatus, loadSemester } = useSemesters();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' });

  const resolvedParams = React.use(params);
  const semesterId = parseInt(resolvedParams.id);

  // Load semester if not already loaded
  useEffect(() => {
    //getSemesterById(semesterId);
    loadSemester(semesterId);
  }, [loadSemester, semesterId]);

  const config = useCreateSemesterDetailsConfig(
    selectedSemester,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ISemester>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
