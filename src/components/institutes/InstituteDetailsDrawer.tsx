'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useInstitutes} from '@/hooks/useInstitutes';

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
  
  const { selectedInstitute, getInstituteById, detailsStatus } = useInstitutes();
  const t = useTranslations();
  const entityName = t('institute', { defaultValue: 'Institute' });
  useEffect(() => {
    if (visible && instituteId) {
      getInstituteById(instituteId);
    }
  }, [visible, instituteId, getInstituteById]);

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
      title={t('details_name', { name: entityName })}
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
