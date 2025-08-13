'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FacultyForm from '@/components/faculties/FacultyForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFaculties} from '@/hooks/useFaculties';

import {Status} from '@/types/common';


const FacultyEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFaculty, detailsStatus, getFacultyById } = useFaculties();
  const t = useTranslations();
  const entityName = t('faculty');

  useEffect(() => {
    const facultyId = parseInt(resolvedParams.id);
    getFacultyById(facultyId);
  }, [resolvedParams.id, getFacultyById]);


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

  if (!selectedFaculty || selectedFaculty.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/faculties')}>
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
          <FacultyForm
            mode="edit"
            facultyId={parseInt(resolvedParams.id)}
            initialValues={selectedFaculty}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultyEditPage;
