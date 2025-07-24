import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {useDepartments} from '@/hooks/useDepartments';
import {IDepartment} from '@/types/department';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';
import {useCreateDepartmentDetailsConfig} from './departmentConfig';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

interface DepartmentDetailsDrawerProps {
  departmentId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit?: (departmentId: number) => void;
}

const DepartmentDetailsDrawer: React.FC<DepartmentDetailsDrawerProps> = ({
  departmentId,
  visible,
  onClose,
  onEdit
}) => {
  const { departments, listStatus, loadDepartments, getDepartmentById, loadDepartment } = useDepartments();
  const [department, setDepartment] = useState<IDepartment | null>(null);
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });

  useEffect(() => {
    if (departmentId && visible) {
      const foundDepartment = getDepartmentById(departmentId);
      if (foundDepartment) {
        setDepartment(foundDepartment);
      } else {
        loadDepartment(departmentId);
      }
    }
  }, [departmentId, visible, getDepartmentById, loadDepartment]);

  useEffect(() => {
    if (departments.length === 0) {
      loadDepartments();
    }
  }, [departments.length, loadDepartments]);

  useEffect(() => {
    if (departments.length > 0 && departmentId) {
      const foundDepartment = getDepartmentById(departmentId);
      if (foundDepartment) {
        setDepartment(foundDepartment);
      }
    }
  }, [departments, departmentId, getDepartmentById]);

  const config = useCreateDepartmentDetailsConfig(
    department,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null,
    { embedded: true, onEdit: onEdit ? (p) => onEdit(p.id) : undefined }
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      open={visible}
      onClose={onClose}
      width={500}
      placement="right"
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default DepartmentDetailsDrawer;
