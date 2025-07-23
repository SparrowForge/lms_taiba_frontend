'use client';

import React, {useEffect, useState} from 'react';
import {useFaculties} from '@/hooks/useFaculties';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {IFaculty} from '@/types/faculty';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {createFacultyDetailsConfig} from '@/components/faculties/facultyConfig';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

interface FacultyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const FacultyDetailPage: React.FC<FacultyDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
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

  const config = createFacultyDetailsConfig(
    faculty,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || t('failed_name', { name: entityName }) : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultyDetailPage; 