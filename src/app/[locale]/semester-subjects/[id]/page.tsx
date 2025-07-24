'use client';

import React, {useEffect, useState} from 'react';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {ISemesterSubject} from '@/types/semesterSubject';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateSemesterSubjectDetailsConfig} from '@/components/semesterSubjects/semesterSubjectConfig';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

interface SemesterSubjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SemesterSubjectDetailPage: React.FC<SemesterSubjectDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { semesterSubjects, listStatus, loadSemesterSubjects, getSemesterSubjectById, loadSemesterSubject } = useSemesterSubjects();
  const [semesterSubject, setSemesterSubject] = useState<ISemesterSubject | null>(null);
  const t = useTranslations();
  const entityName = t('semesterSubject', { defaultValue: 'Semester Subject' });

  useEffect(() => {
    const semesterSubjectId = parseInt(resolvedParams.id);
    const foundSemesterSubject = getSemesterSubjectById(semesterSubjectId);
    if (foundSemesterSubject) {
      setSemesterSubject(foundSemesterSubject);
    } else {
      loadSemesterSubject(semesterSubjectId);
    }
  }, [resolvedParams.id, getSemesterSubjectById, loadSemesterSubject]);

  useEffect(() => {
    if (semesterSubjects.length === 0) {
      loadSemesterSubjects();
    }
  }, [semesterSubjects.length, loadSemesterSubjects]);

  useEffect(() => {
    if (semesterSubjects.length > 0) {
      const foundSemesterSubject = getSemesterSubjectById(parseInt(resolvedParams.id));
      if (foundSemesterSubject) {
        setSemesterSubject(foundSemesterSubject);
      }
    }
  }, [semesterSubjects, resolvedParams.id, getSemesterSubjectById]);

  const config = useCreateSemesterSubjectDetailsConfig(
    semesterSubject,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || t('failed_name', { name: entityName }) : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ISemesterSubject>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterSubjectDetailPage;
