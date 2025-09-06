'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useDepartments} from '@/hooks/useDepartments';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IDepartment} from '@/types/department';

import {useCreateDepartmentDetailsConfig} from './departmentConfig';

interface DepartmentDetailsDrawerProps {
  departmentId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (departmentId: number) => void;
}

const DepartmentDetailsDrawer: React.FC<DepartmentDetailsDrawerProps> = ({
  departmentId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedDepartment, loadDepartment, detailsStatus } = useDepartments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DEPARTMENT, { defaultValue: 'Department' });
  useEffect(() => {
    if (visible && departmentId) {
      //getDepartmentById(departmentId);
      loadDepartment(departmentId);
    }
  }, [visible, departmentId, loadDepartment]);

  const handleEdit = (department: IDepartment) => {
    onEdit(department.id);
  };

  const config = useCreateDepartmentDetailsConfig(
    selectedDepartment,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={departmentId} // Force remount when departmentId changes
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

export default DepartmentDetailsDrawer;
