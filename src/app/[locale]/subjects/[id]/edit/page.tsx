'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SubjectForm from '@/components/subjects/SubjectForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useSubjects} from '@/hooks/useSubjects';


const SubjectEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedSubject, detailsStatus, loadSubject } = useSubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' });

  useEffect(() => {
    const subjectId = parseInt(resolvedParams.id);
    //getSubjectById(subjectId);
    loadSubject(subjectId);
  }, [resolvedParams.id, loadSubject]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedSubject || selectedSubject.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/subjects" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <SubjectForm
          mode="edit"
          subjectId={parseInt(resolvedParams.id)}
          initialValues={selectedSubject}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SubjectEditPage;
