'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import GradeRuleForm from '@/components/gradeRules/GradeRuleForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useGradeRules } from '@/hooks/useGradeRules';
import { useLocalization } from '@/hooks/useLocalization';

export default function EditGradeRulePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedGradeRule, loadGradeRule, detailsStatus } = useGradeRules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.GRADE_RULE, { defaultValue: 'Grade Rule' });

  const resolvedParams = React.use(params);
  const gradeRuleId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getGradeRuleById(gradeRuleId);
    loadGradeRule(gradeRuleId);
  }, [gradeRuleId, loadGradeRule]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedGradeRule || selectedGradeRule.id !== gradeRuleId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/grade-rules" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <GradeRuleForm mode="edit" gradeRuleId={gradeRuleId} initialValues={selectedGradeRule} />
      </MainLayout>
    </ProtectedRoute>
  );
}
