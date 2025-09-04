'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';

import EmploymentTypeForm from './EmploymentTypeForm';

interface Props {
  mode: 'create' | 'edit';
  employmentTypeId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const EmploymentTypeFormDrawer: React.FC<Props> = ({
  mode,
  employmentTypeId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getEmploymentTypeById, selectedEmploymentType, loadEmploymentType, detailsStatus } =
    useEmploymentTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EMPLOYMENT_TYPE, { defaultValue: 'Employment Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && employmentTypeId) {
      //getEmploymentTypeById(employmentTypeId);
      loadEmploymentType(employmentTypeId);
    }
  }, [visible, mode, employmentTypeId, loadEmploymentType]);

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
      key={employmentTypeId} // Force remount when employmentTypeId changes
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
      <EmploymentTypeForm
        mode={mode}
        employmentTypeId={employmentTypeId}
        initialValues={selectedEmploymentType || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default EmploymentTypeFormDrawer;
