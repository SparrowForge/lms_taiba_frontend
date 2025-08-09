'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useInstitutes} from '@/hooks/useInstitutes';

import {IInstitute} from '@/types/institute';

import InstituteForm from './InstituteForm';


interface Props {
  mode: 'create' | 'edit';
  instituteId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const InstituteFormDrawer: React.FC<Props> = ({
  mode,
  instituteId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<IInstitute> | undefined>();
  const { institutes, getInstituteById, loadInstitute } = useInstitutes();
  const t = useTranslations();
  const entityName = t('institute', { defaultValue: 'Institute' });

  useEffect(() => {
    if (visible && mode === 'edit' && instituteId) {
      const existing = getInstituteById(instituteId);
      if (existing) setInitialValues(existing);
      else loadInstitute(instituteId);
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, instituteId, getInstituteById, loadInstitute]);

  useEffect(() => {
    if (mode === 'edit' && instituteId && institutes.length > 0) {
      const found = getInstituteById(instituteId);
      if (found) setInitialValues(found);
    }
  }, [institutes, instituteId, mode, getInstituteById]);

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
      <InstituteForm
        mode={mode}
        instituteId={instituteId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default InstituteFormDrawer;
