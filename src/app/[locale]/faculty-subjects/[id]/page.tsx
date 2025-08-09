'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFacultySubjectDetailsConfig} from '@/components/facultySubjects/facultySubjectConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';

import {Status} from '@/types/common';
import {IFacultySubject} from '@/types/facultySubject';

interface FacultySubjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const FacultySubjectDetailPage: React.FC<FacultySubjectDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const {
    facultySubjects,
    listStatus,
    loadFacultySubjects,
    getFacultySubjectById,
    loadFacultySubject,
  } = useFacultySubjects();
  const [facultySubject, setFacultySubject] = useState<IFacultySubject | null>(null);
  const t = useTranslations();
  const entityName = t('facultySubject', { defaultValue: 'Faculty Subject' });

  useEffect(() => {
    const facultySubjectId = parseInt(resolvedParams.id);
    const foundFacultySubject = getFacultySubjectById(facultySubjectId);
    if (foundFacultySubject) {
      setFacultySubject(foundFacultySubject);
    } else {
      loadFacultySubject(facultySubjectId);
    }
  }, [resolvedParams.id, getFacultySubjectById, loadFacultySubject]);

  useEffect(() => {
    if (facultySubjects.length === 0) {
      loadFacultySubjects();
    }
  }, [facultySubjects.length, loadFacultySubjects]);

  useEffect(() => {
    if (facultySubjects.length > 0) {
      const foundFacultySubject = getFacultySubjectById(parseInt(resolvedParams.id));
      if (foundFacultySubject) {
        setFacultySubject(foundFacultySubject);
      }
    }
  }, [facultySubjects, resolvedParams.id, getFacultySubjectById]);

  const config = useCreateFacultySubjectDetailsConfig(
    facultySubject,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IFacultySubject>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultySubjectDetailPage;
