'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useSubjects } from '@/hooks/useSubjects';
import { ISubject } from '@/types/subject';
import { Status } from '@/types/common';
import { useTranslations } from 'next-intl';
import { createSubjectDetailsConfig } from '@/components/subjects/subjectConfig';
import { EntityDetails } from '@/components/ui/EntityDetails';

interface SubjectDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const SubjectDetailPage: React.FC<SubjectDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { subjects, listStatus, loadSubjects, getSubjectById, loadSubject } = useSubjects();
  const [subject, setSubject] = useState<ISubject | null>(null);
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });

  useEffect(() => {
    const subjectId = parseInt(resolvedParams.id);
    const foundSubject = getSubjectById(subjectId);
    if (foundSubject) {
      setSubject(foundSubject);
    } else {
      loadSubject(subjectId);
    }
  }, [resolvedParams.id, getSubjectById, loadSubject]);

  useEffect(() => {
    if (subjects.length === 0) {
      loadSubjects();
    }
  }, [subjects.length, loadSubjects]);

  useEffect(() => {
    if (subjects.length > 0) {
      const foundSubject = getSubjectById(parseInt(resolvedParams.id));
      if (foundSubject) {
        setSubject(foundSubject);
      }
    }
  }, [subjects, resolvedParams.id, getSubjectById]);

  const config = createSubjectDetailsConfig(
    subject,
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

export default SubjectDetailPage; 