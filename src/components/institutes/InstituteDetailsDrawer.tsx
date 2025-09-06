'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useInstitutes} from '@/hooks/useInstitutes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IInstitute} from '@/types/institute';

import {useCreateInstituteDetailsConfig} from './instituteConfig';

interface InstituteDetailsDrawerProps {
  instituteId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (instituteId: number) => void;
}

const InstituteDetailsDrawer: React.FC<InstituteDetailsDrawerProps> = ({
  instituteId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedInstitute, getInstituteById, detailsStatus, loadInstitute } = useInstitutes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.INSTITUTE, { defaultValue: 'Institute' });
  useEffect(() => {
    if (visible && instituteId) {
      //getInstituteById(instituteId);
      loadInstitute(instituteId);
    }
  }, [visible, instituteId, loadInstitute]);

  const handleEdit = (institute: IInstitute) => {
    onEdit(institute.id);
  };

  const config = useCreateInstituteDetailsConfig(
    selectedInstitute,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={instituteId} // Force remount when instituteId changes
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

export default InstituteDetailsDrawer;
