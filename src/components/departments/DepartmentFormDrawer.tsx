import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {useDepartments} from '@/hooks/useDepartments';
import {IDepartment} from '@/types/department';
import DepartmentForm from './DepartmentForm';
import {useTranslations} from 'next-intl';

interface DepartmentFormDrawerProps {
  mode: 'create' | 'edit';
  departmentId?: number;
  initialValues?: Partial<IDepartment>;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const DepartmentFormDrawer: React.FC<DepartmentFormDrawerProps> = ({
  mode,
  departmentId,
  initialValues,
  visible,
  onCancel,
  onSuccess
}) => {
  const { getDepartmentById, loadDepartment } = useDepartments();
  const [department, setDepartment] = useState<IDepartment | null>(null);
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });

  useEffect(() => {
    if (mode === 'edit' && departmentId && visible) {
      const foundDepartment = getDepartmentById(departmentId);
      if (foundDepartment) {
        setDepartment(foundDepartment);
      } else {
        loadDepartment(departmentId);
      }
    }
  }, [mode, departmentId, visible, getDepartmentById, loadDepartment]);

  const getTitle = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  const getFormInitialValues = () => {
    if (mode === 'edit' && department) {
      return {
        branchId: department.branchId,
        name: department.name,
        code: department.code,
      };
    }
    return initialValues;
  };

  return (
    <Drawer
      title={getTitle()}
      open={visible}
      onClose={onCancel}
      width={500}
      placement="right"
    >
      <DepartmentForm
        mode={mode}
        departmentId={departmentId}
        initialValues={getFormInitialValues()}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default DepartmentFormDrawer;
