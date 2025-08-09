'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FacultySubjectForm from '@/components/facultySubjects/FacultySubjectForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';

import {IFacultySubject} from '@/types/facultySubject';


interface FacultySubjectEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const FacultySubjectEditPage: React.FC<FacultySubjectEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const {
    facultySubjects,
    listStatus,
    loadFacultySubjects,
    getFacultySubjectById,
    loadFacultySubject,
  } = useFacultySubjects();
  const [facultySubject, setFacultySubject] = useState<IFacultySubject | null>(null);
  const t = useTranslations();
  const entityName = t('facultySubject', { defaultValue: 'Faculty Subject' });

  useEffect(() => {
    const facultySubjectId = parseInt(resolvedParams.id);
    const foundFacultySubject = getFacultySubjectById(facultySubjectId);
    if (foundFacultySubject) {
      setFacultySubject(foundFacultySubject);
    } else {
      loadFacultySubject(facultySubjectId);
    }
  }, [resolvedParams.id, getFacultySubjectById, loadFacultySubject]);

  useEffect(() => {
    if (facultySubjects.length === 0) {
      loadFacultySubjects();
    }
  }, [facultySubjects.length, loadFacultySubjects]);

  useEffect(() => {
    if (facultySubjects.length > 0) {
      const foundFacultySubject = getFacultySubjectById(parseInt(resolvedParams.id));
      if (foundFacultySubject) {
        setFacultySubject(foundFacultySubject);
      }
    }
  }, [facultySubjects, resolvedParams.id, getFacultySubjectById]);

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

  if (!facultySubject) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/faculty-subjects')}>
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
          <FacultySubjectForm
            mode="edit"
            facultySubjectId={facultySubject.id}
            initialValues={facultySubject}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultySubjectEditPage;
