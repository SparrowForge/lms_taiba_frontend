'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FacultyForm from '@/components/faculties/FacultyForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFaculties} from '@/hooks/useFaculties';

import {IFaculty} from '@/types/faculty';


interface FacultyEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const FacultyEditPage: React.FC<FacultyEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { faculties, listStatus, loadFaculties, getFacultyById, loadFaculty } = useFaculties();
  const [faculty, setFaculty] = useState<IFaculty | null>(null);
  const t = useTranslations();
  const entityName = t('faculty', { defaultValue: 'Faculty' });

  useEffect(() => {
    const facultyId = parseInt(resolvedParams.id);
    const foundFaculty = getFacultyById(facultyId);
    if (foundFaculty) {
      setFaculty(foundFaculty);
    } else {
      loadFaculty(facultyId);
    }
  }, [resolvedParams.id, getFacultyById, loadFaculty]);

  useEffect(() => {
    if (faculties.length === 0) {
      loadFaculties();
    }
  }, [faculties.length, loadFaculties]);

  useEffect(() => {
    if (faculties.length > 0) {
      const foundFaculty = getFacultyById(parseInt(resolvedParams.id));
      if (foundFaculty) {
        setFaculty(foundFaculty);
      }
    }
  }, [faculties, resolvedParams.id, getFacultyById]);

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

  if (!faculty) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/faculty')}>
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
          <FacultyForm
            mode="edit"
            facultyId={faculty.id}
            initialValues={faculty}
          onCancel={handleBack}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultyEditPage;
