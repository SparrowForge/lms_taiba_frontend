'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useSubjects } from '@/hooks/useSubjects';
import { ISubject } from '@/types/subject';
import { useTranslations } from 'next-intl';
import SubjectForm from '@/components/subjects/SubjectForm';
import { PageHeader } from '@/components/ui/PageHeader';

interface SubjectEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const SubjectEditPage: React.FC<SubjectEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { subjects, listStatus, loadSubjects, getSubjectById, loadSubject } = useSubjects();
  const [subject, setSubject] = useState<ISubject | null>(null);
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });

  useEffect(() => {
    const subjectId = parseInt(resolvedParams.id);
    const foundSubject = getSubjectById(subjectId);
    if (foundSubject) {
      setSubject(foundSubject);
    } else {
      loadSubject(subjectId);
    }
  }, [resolvedParams.id, getSubjectById, loadSubject]);

  useEffect(() => {
    if (subjects.length === 0) {
      loadSubjects();
    }
  }, [subjects.length, loadSubjects]);

  useEffect(() => {
    if (subjects.length > 0) {
      const foundSubject = getSubjectById(parseInt(resolvedParams.id));
      if (foundSubject) {
        setSubject(foundSubject);
      }
    }
  }, [subjects, resolvedParams.id, getSubjectById]);

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

  if (!subject) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/subjects')}>
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

  const getInitialValues = () => ({
    courseId: subject.courseId,
    name: subject.name,
    code: subject.code,
    creditHours: subject.creditHours,
    theoryHours: subject.theoryHours,
    practicalHours: subject.practicalHours,
    description: subject.description,
  });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <SubjectForm
            mode="edit"
            subjectId={subject.id}
            initialValues={getInitialValues()}
            embedded={false}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SubjectEditPage; 