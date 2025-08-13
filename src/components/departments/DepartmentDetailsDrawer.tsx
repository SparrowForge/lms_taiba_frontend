'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useDepartments} from '@/hooks/useDepartments';

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
  
  const { selectedDepartment, getDepartmentById, detailsStatus } = useDepartments();
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });
  useEffect(() => {
    if (visible && departmentId) {
      getDepartmentById(departmentId);
    }
  }, [visible, departmentId, getDepartmentById]);

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

export default DepartmentDetailsDrawer;
