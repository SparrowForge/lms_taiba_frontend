'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentForm from '@/components/students/StudentForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';


const StudentEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedStudent, detailsStatus, getStudentById } = useStudents();
  const t = useTranslations();
  const entityName = t('student');

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
            <div>{t('loading', { defaultValue: 'Loading...' })} {entityName}</div>
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
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/students')}>
                  {t('backToList_name', { name: entityName })}
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
          <PageHeader title={t('edit_name', { name: entityName })} onBack={() => router.back()} />
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
