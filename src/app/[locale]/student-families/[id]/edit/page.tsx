'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentFamilyForm from '@/components/studentFamilies/StudentFamilyForm';
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

  const { selectedStudentFamily, detailsStatus, getStudentFamilyById } = useStudentFamilies();

  React.useEffect(() => {
    getStudentFamilyById(studentFamilyId);
  }, [studentFamilyId, getStudentFamilyById]);

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

  if (!selectedStudentFamily || selectedStudentFamily.id !== studentFamilyId) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/student-families')}>
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
        <StudentFamilyForm
          mode="edit"
          studentFamilyId={studentFamilyId}
          initialValues={selectedStudentFamily || undefined}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
