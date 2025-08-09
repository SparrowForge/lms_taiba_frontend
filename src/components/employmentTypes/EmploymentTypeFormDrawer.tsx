'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';

import {IEmploymentType} from '@/types/employmentType';

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
  const [initialValues, setInitialValues] = useState<Partial<IEmploymentType> | undefined>();
  const { employmentTypes, getEmploymentTypeById, loadEmploymentType } = useEmploymentTypes();
  const t = useTranslations();
  const entityName = t('employmentType', { defaultValue: 'Employment Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && employmentTypeId) {
      const existing = getEmploymentTypeById(employmentTypeId);
      if (existing) setInitialValues(existing);
      else loadEmploymentType(employmentTypeId);
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, employmentTypeId, getEmploymentTypeById, loadEmploymentType]);

  useEffect(() => {
    if (mode === 'edit' && employmentTypeId && employmentTypes.length > 0) {
      const found = getEmploymentTypeById(employmentTypeId);
      if (found) setInitialValues(found);
    }
  }, [employmentTypes, employmentTypeId, mode, getEmploymentTypeById]);

  const handleSuccess = () => {
    onSuccess();
    setInitialValues(undefined);
  };
  const handleCancel = () => {
    onCancel();
    setInitialValues(undefined);
  };

  return (
    <Drawer
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
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default EmploymentTypeFormDrawer;
