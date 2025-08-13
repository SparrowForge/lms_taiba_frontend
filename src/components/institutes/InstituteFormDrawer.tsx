'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useInstitutes} from '@/hooks/useInstitutes';

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
  const { getInstituteById, selectedInstitute } = useInstitutes();
  const t = useTranslations();
  const entityName = t('institute', { defaultValue: 'Institute' });

  useEffect(() => {
    if (visible && mode === 'edit' && instituteId) {
      getInstituteById(instituteId);
    }
  }, [visible, mode, instituteId, getInstituteById]);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={instituteId} // Force remount when instituteId changes
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
        initialValues={selectedInstitute || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default InstituteFormDrawer;
