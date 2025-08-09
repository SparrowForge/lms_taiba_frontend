'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateSubjectDetailsConfig} from '@/components/subjects/subjectConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {ISubject} from '@/types/subject';

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

  const config = useCreateSubjectDetailsConfig(
    subject,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ISubject>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SubjectDetailPage;
