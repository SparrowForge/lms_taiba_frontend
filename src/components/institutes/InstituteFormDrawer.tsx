'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useInstitutes} from '@/hooks/useInstitutes';
import {useLocalization} from '@/hooks/useLocalization';

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
  const { getInstituteById, selectedInstitute, detailsStatus, loadInstitute } = useInstitutes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.INSTITUTE, { defaultValue: 'Institute' });

  useEffect(() => {
    if (visible && mode === 'edit' && instituteId) {
      //getInstituteById(instituteId);
      loadInstitute(instituteId);
    }
  }, [visible, mode, instituteId, loadInstitute]);

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
      key={instituteId} // Force remount when instituteId changes
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
