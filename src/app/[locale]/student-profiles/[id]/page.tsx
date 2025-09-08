'use client';

import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateStudentProfileDetailsConfig} from '@/components/studentProfiles/studentProfileConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentProfiles} from '@/hooks/useStudentProfiles';

import {IStudentProfile} from '@/types/studentProfile';

export default function StudentProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const studentProfileId = parseInt(resolvedParams.id);
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_PROFILE, { defaultValue: 'Student Profile' });

  const { selectedStudentProfile, detailsStatus, loadStudentProfile } = useStudentProfiles();

  React.useEffect(() => {
    //getStudentProfileById(studentProfileId);
    loadStudentProfile(studentProfileId);
  }, [studentProfileId, loadStudentProfile]);

  const config = useCreateStudentProfileDetailsConfig(
    selectedStudentProfile,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IStudentProfile>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
