'use client';

import React, {useEffect, useState} from 'react';
import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {IFacultySubject} from '@/types/facultySubject';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {createFacultySubjectDetailsConfig} from '@/components/facultySubjects/facultySubjectConfig';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

interface FacultySubjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const FacultySubjectDetailPage: React.FC<FacultySubjectDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { facultySubjects, listStatus, loadFacultySubjects, getFacultySubjectById, loadFacultySubject } = useFacultySubjects();
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

  const config = createFacultySubjectDetailsConfig(
    facultySubject,
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

export default FacultySubjectDetailPage; 