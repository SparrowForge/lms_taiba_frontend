'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useGradeRules } from '@/hooks/useGradeRules';
import { useLocalization } from '@/hooks/useLocalization';

import { IGradeRule } from '@/types/gradeRule';

import { useCreateGradeRuleDetailsConfig } from './gradeRuleConfig';

interface GradeRuleDetailsDrawerProps {
  gradeRuleId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (gradeRuleId: number) => void;
}

const GradeRuleDetailsDrawer: React.FC<GradeRuleDetailsDrawerProps> = ({
  gradeRuleId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedGradeRule, loadGradeRule, detailsStatus } = useGradeRules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.GRADE_RULE, { defaultValue: 'Grade Rule' });
  useEffect(() => {
    if (visible && gradeRuleId) {
      //getGradeRuleById(gradeRuleId);
      loadGradeRule(gradeRuleId);
    }
  }, [visible, gradeRuleId, loadGradeRule]);

  const handleEdit = (gradeRule: IGradeRule) => {
    onEdit(gradeRule.id);
  };

  const config = useCreateGradeRuleDetailsConfig(
    selectedGradeRule,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={gradeRuleId} // Force remount when gradeRuleId changes
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default GradeRuleDetailsDrawer;
