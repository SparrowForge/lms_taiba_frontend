'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseMaterialForm from '@/components/courseMaterials/CourseMaterialForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useCourseMaterials} from '@/hooks/useCourseMaterials';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {ICourseMaterial, ICourseMaterialUpdate} from '@/types/courseMaterial';

const CourseMaterialEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedCourseMaterial, detailsStatus, getCourseMaterialById } = useCourseMaterials();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });

  useEffect(() => {
    const courseMaterialId = parseInt(resolvedParams.id);
    getCourseMaterialById(courseMaterialId);
  }, [resolvedParams.id, getCourseMaterialById]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedCourseMaterial || selectedCourseMaterial.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/course-materials" />;
  }

  // Convert ICourseMaterial to ICourseMaterialUpdate for form compatibility
  const convertToFormValues = (courseMaterial: ICourseMaterial): Partial<ICourseMaterialUpdate> => {
    const { id, createdAt, updatedAt, deletedAt, course, subject, semester, batch, faculty, file, ...formValues } = courseMaterial;
    return {
      ...formValues,
      fileId: formValues.fileId ?? undefined,
    };
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
        <CourseMaterialForm
          mode="edit"
          courseMaterialId={parseInt(resolvedParams.id)}
          initialValues={convertToFormValues(selectedCourseMaterial)}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseMaterialEditPage;
