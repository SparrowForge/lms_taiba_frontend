'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentProfileForm from '@/components/studentProfiles/StudentProfileForm';
import {PageHeader} from '@/components/ui/PageHeader';


import {useLocalization} from '@/hooks/useLocalization';
import {useStudentProfiles} from '@/hooks/useStudentProfiles';

import {Status} from '@/types/common';


export default function StudentProfileEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const studentProfileId = parseInt(resolvedParams.id);
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_PROFILE, { defaultValue: 'Student Profile' });

  const { selectedStudentProfile, detailsStatus, getStudentProfileById } = useStudentProfiles();

  React.useEffect(() => {
    getStudentProfileById(studentProfileId);
  }, [studentProfileId, getStudentProfileById]);

  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedStudentProfile || selectedStudentProfile.id !== studentProfileId) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/student-profiles')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
        <StudentProfileForm
          mode="edit"
          studentProfileId={studentProfileId}
          initialValues={selectedStudentProfile || undefined}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
