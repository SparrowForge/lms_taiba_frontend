'use client';

import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateStudentFamilyDetailsConfig} from '@/components/studentFamilies/studentFamilyConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentFamilies} from '@/hooks/useStudentFamilies';

import {Status} from '@/types/common';
import {IStudentFamily} from '@/types/studentFamily';


export default function StudentFamilyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const studentFamilyId = parseInt(resolvedParams.id);
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_FAMILY, { defaultValue: 'Student Family' });

  const { selectedStudentFamily, detailsStatus, getStudentFamilyById } = useStudentFamilies();

  React.useEffect(() => {
    getStudentFamilyById(studentFamilyId);
  }, [studentFamilyId, getStudentFamilyById]);

  const config = useCreateStudentFamilyDetailsConfig(
    selectedStudentFamily,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IStudentFamily>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
