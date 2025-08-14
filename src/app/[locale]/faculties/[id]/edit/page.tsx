'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FacultyForm from '@/components/faculties/FacultyForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const FacultyEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFaculty, detailsStatus, getFacultyById } = useFaculties();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY, { defaultValue: 'Faculty' });

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
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
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
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/faculties')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}</Button>
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
