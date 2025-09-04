'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';
import {useLocalization} from '@/hooks/useLocalization';

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
  const { selectedEmploymentType, loadEmploymentType, detailsStatus } = useEmploymentTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EMPLOYMENT_TYPE, { defaultValue: 'Employment Type' });
  useEffect(() => {
    if (visible && employmentTypeId) {
      //getEmploymentTypeById(employmentTypeId);
      loadEmploymentType(employmentTypeId);
    }
  }, [visible, employmentTypeId, loadEmploymentType]);

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

export default EmploymentTypeDetailsDrawer;
