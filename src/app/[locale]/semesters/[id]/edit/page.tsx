'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useSemesters} from '@/hooks/useSemesters';
import {ISemester} from '@/types/semester';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {PageHeader} from '@/components/ui/PageHeader';
import SemesterForm from '@/components/semesters/SemesterForm';
import {Button, Card} from 'antd';
import {useTranslations} from 'next-intl';

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
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <SemesterForm
            mode="edit"
            semesterId={semester.id}
            initialValues={semester}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterEditPage;
