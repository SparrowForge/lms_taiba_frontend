'use client';

import React, {useEffect, useState} from 'react';
import {useSemesters} from '@/hooks/useSemesters';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {ISemester} from '@/types/semester';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {createSemesterDetailsConfig} from '@/components/semesters/semesterConfig';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

interface SemesterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SemesterDetailPage: React.FC<SemesterDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { semesters, listStatus, loadSemesters, getSemesterById, loadSemester } = useSemesters();
  const [semester, setSemester] = useState<ISemester | null>(null);
  const t = useTranslations();
  const entityName = t('semester');

  useEffect(() => {
    const semesterId = parseInt(resolvedParams.id);
    const foundSemester = getSemesterById(semesterId);
    if (foundSemester) {
      setSemester(foundSemester);
    } else {
      loadSemester(semesterId);
    }
  }, [resolvedParams.id, getSemesterById, loadSemester]);

  useEffect(() => {
    if (semesters.length === 0) {
      loadSemesters();
    }
  }, [semesters.length, loadSemesters]);

  useEffect(() => {
    if (semesters.length > 0) {
      const foundSemester = getSemesterById(parseInt(resolvedParams.id));
      if (foundSemester) {
        setSemester(foundSemester);
      }
    }
  }, [semesters, resolvedParams.id, getSemesterById]);

  const config = createSemesterDetailsConfig(
    semester,
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

export default SemesterDetailPage;
