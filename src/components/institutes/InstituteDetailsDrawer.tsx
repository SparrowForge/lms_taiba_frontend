'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';


import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';


import {useInstitutes} from '@/hooks/useInstitutes';

import {Status} from '@/types/common';
import {IInstitute} from '@/types/institute';

import {useCreateInstituteDetailsConfig} from './instituteConfig';


interface Props {
  instituteId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (instituteId: number) => void;
}

const InstituteDetailsDrawer: React.FC<Props> = ({ instituteId, visible, onClose, onEdit }) => {
  const [item, setItem] = useState<IInstitute | null>(null);
  const { institutes, getInstituteById, loadInstitute, detailsStatus } = useInstitutes();
  const t = useTranslations();
  const entityName = t('institute', { defaultValue: 'Institute' });

  useEffect(() => {
    if (visible && instituteId) {
      const existing = getInstituteById(instituteId);
      if (existing) setItem(existing);
      else loadInstitute(instituteId);
    } else {
      setItem(null);
    }
  }, [visible, instituteId, getInstituteById, loadInstitute]);

  useEffect(() => {
    if (instituteId && institutes.length > 0) {
      const found = getInstituteById(instituteId);
      if (found) setItem(found);
    }
  }, [institutes, instituteId, getInstituteById]);

  const handleEdit = (it: IInstitute) => onEdit(it.id);

  const config = useCreateInstituteDetailsConfig(
    item,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    { embedded: true, onEdit: handleEdit },
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
