'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFacultyDetailsConfig} from '@/components/faculties/facultyConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFaculties} from '@/hooks/useFaculties';

import {Status} from '@/types/common';
import {IFaculty} from '@/types/faculty';

export default function FacultyDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedFaculty, detailsStatus, getFacultyById } = useFaculties();
  const t = useTranslations();
  const entityName = t('faculty');

  const resolvedParams = React.use(params);
  const facultyId = parseInt(resolvedParams.id);

  // Load faculty if not already loaded
  useEffect(() => {
    getFacultyById(facultyId);
  }, [getFacultyById, facultyId]);

  const config = useCreateFacultyDetailsConfig(
    selectedFaculty,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IFaculty>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
