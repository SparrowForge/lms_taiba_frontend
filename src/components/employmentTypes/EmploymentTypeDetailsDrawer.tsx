'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';


import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';


import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';

import {Status} from '@/types/common';
import {IEmploymentType} from '@/types/employmentType';

import {useCreateEmploymentTypeDetailsConfig} from './employmentTypeConfig';


interface Props {
  employmentTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (employmentTypeId: number) => void;
}

const EmploymentTypeDetailsDrawer: React.FC<Props> = ({
  employmentTypeId,
  visible,
  onClose,
  onEdit,
}) => {
  const [item, setItem] = useState<IEmploymentType | null>(null);
  const { employmentTypes, getEmploymentTypeById, loadEmploymentType, detailsStatus } =
    useEmploymentTypes();
  const t = useTranslations();
  const entityName = t('employmentType', { defaultValue: 'Employment Type' });

  useEffect(() => {
    if (visible && employmentTypeId) {
      const existing = getEmploymentTypeById(employmentTypeId);
      if (existing) setItem(existing);
      else loadEmploymentType(employmentTypeId);
    } else {
      setItem(null);
    }
  }, [visible, employmentTypeId, getEmploymentTypeById, loadEmploymentType]);

  useEffect(() => {
    if (employmentTypeId && employmentTypes.length > 0) {
      const found = getEmploymentTypeById(employmentTypeId);
      if (found) setItem(found);
    }
  }, [employmentTypes, employmentTypeId, getEmploymentTypeById]);

  const handleEdit = (et: IEmploymentType) => onEdit(et.id);

  const config = useCreateEmploymentTypeDetailsConfig(
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

export default EmploymentTypeDetailsDrawer;
