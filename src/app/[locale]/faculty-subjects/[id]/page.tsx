'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFacultySubjectDetailsConfig} from '@/components/facultySubjects/facultySubjectConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {useLocalization} from '@/hooks/useLocalization';

import {IFacultySubject} from '@/types/facultySubject';

export default function FacultySubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedFacultySubject, detailsStatus, loadFacultySubject } = useFacultySubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY_SUBJECT, { defaultValue: 'Faculty Subject' });

  const resolvedParams = React.use(params);
  const facultySubjectId = parseInt(resolvedParams.id);

  // Load faculty subject if not already loaded
  useEffect(() => {
    //getFacultySubjectById(facultySubjectId);
    loadFacultySubject(facultySubjectId);
  }, [loadFacultySubject, facultySubjectId]);

  const config = useCreateFacultySubjectDetailsConfig(
    selectedFacultySubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
