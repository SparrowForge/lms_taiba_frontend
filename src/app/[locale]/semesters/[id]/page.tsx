'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateSemesterDetailsConfig} from '@/components/semesters/semesterConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useSemesters} from '@/hooks/useSemesters';

import {Status} from '@/types/common';
import {ISemester} from '@/types/semester';

export default function SemesterDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedSemester, detailsStatus, getSemesterById } = useSemesters();
  const t = useTranslations();
  const entityName = t('semester');

  const resolvedParams = React.use(params);
  const semesterId = parseInt(resolvedParams.id);

  // Load semester if not already loaded
  useEffect(() => {
    getSemesterById(semesterId);
  }, [getSemesterById, semesterId]);

  const config = useCreateSemesterDetailsConfig(
    selectedSemester,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
