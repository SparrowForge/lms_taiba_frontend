'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SemesterForm from '@/components/semesters/SemesterForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useSemesters} from '@/hooks/useSemesters';

import {ISemester} from '@/types/semester';


interface SemesterEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SemesterEditPage: React.FC<SemesterEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { semesters, listStatus, loadSemesters, getSemesterById, loadSemester } = useSemesters();
  const [semester, setSemester] = useState<ISemester | null>(null);
  const t = useTranslations();
  const entityName = t('semester');

  useEffect(() => {
    const semesterId = parseInt(resolvedParams.id);
    const foundSemester = getSemesterById(semesterId);
    if (foundSemester) {
      setSemester(foundSemester);
    } else {
      loadSemester(semesterId);
    }
  }, [resolvedParams.id, getSemesterById, loadSemester]);

  useEffect(() => {
    if (semesters.length === 0) {
      loadSemesters();
    }
  }, [semesters.length, loadSemesters]);

  useEffect(() => {
    if (semesters.length > 0) {
      const foundSemester = getSemesterById(parseInt(resolvedParams.id));
      if (foundSemester) {
        setSemester(foundSemester);
      }
    }
  }, [semesters, resolvedParams.id, getSemesterById]);

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

  if (!semester) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/semesters')}>
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
          <SemesterForm
            mode="edit"
            semesterId={semester.id}
            initialValues={semester}
          onCancel={handleBack}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterEditPage;
