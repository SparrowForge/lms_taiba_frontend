'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';

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
  const { getEmploymentTypeById, selectedEmploymentType } = useEmploymentTypes();
  const t = useTranslations();
  const entityName = t('employmentType', { defaultValue: 'Employment Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && employmentTypeId) {
      getEmploymentTypeById(employmentTypeId);
    }
  }, [visible, mode, employmentTypeId, getEmploymentTypeById]);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={employmentTypeId} // Force remount when employmentTypeId changes
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
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
