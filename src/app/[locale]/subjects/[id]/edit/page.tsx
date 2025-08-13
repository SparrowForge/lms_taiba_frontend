'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SubjectForm from '@/components/subjects/SubjectForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';


const SubjectEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedSubject, detailsStatus, getSubjectById } = useSubjects();
  const t = useTranslations();
  const entityName = t('subject');

  useEffect(() => {
    const subjectId = parseInt(resolvedParams.id);
    getSubjectById(subjectId);
  }, [resolvedParams.id, getSubjectById]);


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

  if (!selectedSubject) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/subjects')}>
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
          <SubjectForm
            mode="edit"
            subjectId={parseInt(resolvedParams.id)}
            initialValues={selectedSubject}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SubjectEditPage;
