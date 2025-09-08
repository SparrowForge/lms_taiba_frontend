'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentProfileForm from '@/components/studentProfiles/StudentProfileForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentProfiles} from '@/hooks/useStudentProfiles';

export default function StudentProfileEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const studentProfileId = parseInt(resolvedParams.id);
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_PROFILE, { defaultValue: 'Student Profile' });

  const { selectedStudentProfile, detailsStatus, loadStudentProfile } = useStudentProfiles();

  React.useEffect(() => {
    //getStudentProfileById(studentProfileId);
    loadStudentProfile(studentProfileId);
  }, [studentProfileId, loadStudentProfile]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedStudentProfile || selectedStudentProfile.id !== studentProfileId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/student-profiles" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <StudentProfileForm
          mode="edit"
          studentProfileId={studentProfileId}
          initialValues={selectedStudentProfile || undefined}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
