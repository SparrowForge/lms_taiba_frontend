'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentForm from '@/components/students/StudentForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';


const StudentEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedStudent, detailsStatus, getStudentById } = useStudents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });

  const studentId = parseInt(resolvedParams.id);

  useEffect(() => {
    getStudentById(studentId);
  }, [studentId, getStudentById]);


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

  if (!selectedStudent || selectedStudent.id !== studentId) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/students')}>
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
          <StudentForm
            mode="edit"
            studentId={studentId}
            initialValues={selectedStudent}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default StudentEditPage;
