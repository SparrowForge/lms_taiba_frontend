'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFacultyDetailsConfig} from '@/components/faculties/facultyConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFaculties} from '@/hooks/useFaculties';

import {Status} from '@/types/common';
import {IFaculty} from '@/types/faculty';

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

  const config = useCreateFacultyDetailsConfig(
    faculty,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IFaculty>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultyDetailPage;
