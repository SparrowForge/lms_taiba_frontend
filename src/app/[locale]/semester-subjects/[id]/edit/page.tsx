'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SemesterSubjectForm from '@/components/semesterSubjects/SemesterSubjectForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

import {ISemesterSubject} from '@/types/semesterSubject';


interface SemesterSubjectEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SemesterSubjectEditPage: React.FC<SemesterSubjectEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const {
    semesterSubjects,
    listStatus,
    loadSemesterSubjects,
    getSemesterSubjectById,
    loadSemesterSubject,
  } = useSemesterSubjects();
  const [semesterSubject, setSemesterSubject] = useState<ISemesterSubject | null>(null);
  const t = useTranslations();
  const entityName = t('semesterSubject', { defaultValue: 'Semester Subject' });

  useEffect(() => {
    const semesterSubjectId = parseInt(resolvedParams.id);
    const foundSemesterSubject = getSemesterSubjectById(semesterSubjectId);
    if (foundSemesterSubject) {
      setSemesterSubject(foundSemesterSubject);
    } else {
      loadSemesterSubject(semesterSubjectId);
    }
  }, [resolvedParams.id, getSemesterSubjectById, loadSemesterSubject]);

  useEffect(() => {
    if (semesterSubjects.length === 0) {
      loadSemesterSubjects();
    }
  }, [semesterSubjects.length, loadSemesterSubjects]);

  useEffect(() => {
    if (semesterSubjects.length > 0) {
      const foundSemesterSubject = getSemesterSubjectById(parseInt(resolvedParams.id));
      if (foundSemesterSubject) {
        setSemesterSubject(foundSemesterSubject);
      }
    }
  }, [semesterSubjects, resolvedParams.id, getSemesterSubjectById]);

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div>{t('loading', { defaultValue: 'Loading...' })}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!semesterSubject) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/semester-subjects')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <SemesterSubjectForm
            mode="edit"
            semesterSubjectId={semesterSubject.id}
            initialValues={semesterSubject}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterSubjectEditPage;
