'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useGradeRules } from '@/hooks/useGradeRules';
import { useLocalization } from '@/hooks/useLocalization';

import GradeRuleForm from './GradeRuleForm';

interface GradeRuleFormDrawerProps {
  mode: 'create' | 'edit';
  gradeRuleId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const GradeRuleFormDrawer: React.FC<GradeRuleFormDrawerProps> = ({
  mode,
  gradeRuleId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedGradeRule, loadGradeRule, detailsStatus } = useGradeRules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.GRADE_RULE, { defaultValue: 'Grade Rule' });
  useEffect(() => {
    if (visible && mode === 'edit' && gradeRuleId) {
      loadGradeRule(gradeRuleId);
    }
  }, [visible, mode, gradeRuleId, loadGradeRule]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={gradeRuleId} // Force remount when gradeRuleId changes
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <GradeRuleForm
        mode={mode}
        gradeRuleId={gradeRuleId}
        initialValues={selectedGradeRule || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default GradeRuleFormDrawer;
