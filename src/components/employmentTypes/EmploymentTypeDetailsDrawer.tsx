'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';

import {Status} from '@/types/common';
import {IEmploymentType} from '@/types/employmentType';

import {useCreateEmploymentTypeDetailsConfig} from './employmentTypeConfig';


interface EmploymentTypeDetailsDrawerProps {
  employmentTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (employmentTypeId: number) => void;
}

const EmploymentTypeDetailsDrawer: React.FC<EmploymentTypeDetailsDrawerProps> = ({
  employmentTypeId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedEmploymentType, getEmploymentTypeById, detailsStatus } = useEmploymentTypes();
  const t = useTranslations();
  const entityName = t('employmentType', { defaultValue: 'Employment Type' });
  useEffect(() => {
    if (visible && employmentTypeId) {
      getEmploymentTypeById(employmentTypeId);
    }
  }, [visible, employmentTypeId, getEmploymentTypeById]);

  const handleEdit = (employmentType: IEmploymentType) => {
    onEdit(employmentType.id);
  };

  const config = useCreateEmploymentTypeDetailsConfig(
    selectedEmploymentType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={employmentTypeId} // Force remount when employmentTypeId changes
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
