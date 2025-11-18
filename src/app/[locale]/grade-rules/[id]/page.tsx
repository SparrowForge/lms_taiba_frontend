'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateGradeRuleDetailsConfig } from '@/components/gradeRules/gradeRuleConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useGradeRules } from '@/hooks/useGradeRules';
import { useLocalization } from '@/hooks/useLocalization';

import { IGradeRule } from '@/types/gradeRule';

export default function GradeRuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.GRADE_RULE, { defaultValue: 'Grade Rule' });
  const { selectedGradeRule, loadGradeRule, detailsStatus } = useGradeRules();

  const resolvedParams = React.use(params);
  const gradeRuleId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadGradeRule(gradeRuleId);
  }, [gradeRuleId, loadGradeRule]);

  const config = useCreateGradeRuleDetailsConfig(
    selectedGradeRule,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IGradeRule>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
