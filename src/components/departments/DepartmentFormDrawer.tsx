import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useDepartments} from '@/hooks/useDepartments';

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
  const { getDepartmentById, selectedDepartment } = useDepartments();
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });

  useEffect(() => {
    if (mode === 'edit' && departmentId && visible) {
      getDepartmentById(departmentId);
    }
  }, [mode, departmentId, visible, getDepartmentById]);

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };


  return (
    <Drawer 
      key={departmentId} // Force remount when departmentId changes
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
      }
      width={600}
      open={visible} 
      onClose={handleCancel} 
      destroyOnHidden={true}
    >
      <DepartmentForm
        mode={mode}
        departmentId={departmentId}
        initialValues={selectedDepartment || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default DepartmentFormDrawer;
