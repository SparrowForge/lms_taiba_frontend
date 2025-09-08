import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useDepartments } from '@/hooks/useDepartments';
import { useLocalization } from '@/hooks/useLocalization';

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
  const { getDepartmentById, selectedDepartment, loadDepartment, detailsStatus } = useDepartments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DEPARTMENT, { defaultValue: 'Department' });

  useEffect(() => {
    if (mode === 'edit' && departmentId && visible) {
      //getDepartmentById(departmentId);
      loadDepartment(departmentId);
    }
  }, [mode, departmentId, visible, loadDepartment]);

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={departmentId} // Force remount when departmentId changes
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
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
