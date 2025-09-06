'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateCourseMaterialDetailsConfig} from '@/components/courseMaterials/courseMaterialConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';

import {useCourseMaterials} from '@/hooks/useCourseMaterials';
import {useLocalization} from '@/hooks/useLocalization';


export default function CourseMaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedCourseMaterial, detailsStatus, loadCourseMaterial } = useCourseMaterials();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });

  const resolvedParams = React.use(params);
  const courseMaterialId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getCourseMaterialById(courseMaterialId);
    loadCourseMaterial(courseMaterialId);
  }, [loadCourseMaterial, courseMaterialId]);

  const config = useCreateCourseMaterialDetailsConfig(
    selectedCourseMaterial,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as any} />
      </MainLayout>
    </ProtectedRoute>
  );
}
