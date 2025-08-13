'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFacultySubjectDetailsConfig} from '@/components/facultySubjects/facultySubjectConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';

import {Status} from '@/types/common';
import {IFacultySubject} from '@/types/facultySubject';

export default function FacultySubjectDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedFacultySubject, detailsStatus, getFacultySubjectById } = useFacultySubjects();
  const t = useTranslations();
  const entityName = t('facultySubject');

  const resolvedParams = React.use(params);
  const facultySubjectId = parseInt(resolvedParams.id);

  // Load faculty subject if not already loaded
  useEffect(() => {
    getFacultySubjectById(facultySubjectId);
  }, [getFacultySubjectById, facultySubjectId]);

  const config = useCreateFacultySubjectDetailsConfig(
    selectedFacultySubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IFacultySubject>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
