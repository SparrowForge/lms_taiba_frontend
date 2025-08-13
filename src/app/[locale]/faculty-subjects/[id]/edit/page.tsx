'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FacultySubjectForm from '@/components/facultySubjects/FacultySubjectForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';

import {Status} from '@/types/common';


const FacultySubjectEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFacultySubject, detailsStatus, getFacultySubjectById } = useFacultySubjects();
  const t = useTranslations();
  const entityName = t('facultySubject');

  useEffect(() => {
    const facultySubjectId = parseInt(resolvedParams.id);
    getFacultySubjectById(facultySubjectId);
  }, [resolvedParams.id, getFacultySubjectById]);


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

  if (!selectedFacultySubject) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/faculty-subjects')}>
                  {t('backToList_name', { name: entityName })}</Button>
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
          <FacultySubjectForm
            mode="edit"
            facultySubjectId={parseInt(resolvedParams.id)}
            initialValues={selectedFacultySubject}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultySubjectEditPage;
