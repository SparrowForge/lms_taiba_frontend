'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentFamilyForm from '@/components/studentFamilies/StudentFamilyForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';


import {useLocalization} from '@/hooks/useLocalization';
import {useStudentFamilies} from '@/hooks/useStudentFamilies';

import {Status} from '@/types/common';


export default function StudentFamilyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const studentFamilyId = parseInt(resolvedParams.id);
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_FAMILY, { defaultValue: 'Student Family' });

  const { selectedStudentFamily, detailsStatus, loadStudentFamily } = useStudentFamilies();

  React.useEffect(() => {
    //getStudentFamilyById(studentFamilyId);
    loadStudentFamily(studentFamilyId);
  }, [studentFamilyId, loadStudentFamily]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedStudentFamily || selectedStudentFamily.id !== studentFamilyId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/student-families" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
        <StudentFamilyForm
          mode="edit"
          studentFamilyId={studentFamilyId}
          initialValues={selectedStudentFamily || undefined}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
