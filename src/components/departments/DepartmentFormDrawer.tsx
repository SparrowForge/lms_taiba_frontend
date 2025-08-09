import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useDepartments} from '@/hooks/useDepartments';

import {IDepartment} from '@/types/department';

import DepartmentForm from './DepartmentForm';


interface DepartmentFormDrawerProps {
  mode: 'create' | 'edit';
  departmentId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const DepartmentFormDrawer: React.FC<DepartmentFormDrawerProps> = ({
  mode,
  departmentId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getDepartmentById, loadDepartment } = useDepartments();
  const [initialValues, setInitialValues] = useState<Partial<IDepartment> | undefined>();
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });

  useEffect(() => {
    if (mode === 'edit' && departmentId && visible) {
      const foundDepartment = getDepartmentById(departmentId);
      if (foundDepartment) {
        setInitialValues(foundDepartment);
      } else {
        loadDepartment(departmentId);
      }
    }
  }, [mode, departmentId, visible, getDepartmentById, loadDepartment]);

  const getTitle = () =>
    mode === 'create'
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };


  return (
    <Drawer title={getTitle()} open={visible} onClose={onCancel} width={500} placement="right">
      <DepartmentForm
        mode={mode}
        departmentId={departmentId}
        initialValues={initialValues}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default DepartmentFormDrawer;
