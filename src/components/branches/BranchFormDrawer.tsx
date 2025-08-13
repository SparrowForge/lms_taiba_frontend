'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useBranches} from '@/hooks/useBranches';

import BranchForm from './BranchForm';


interface BranchFormDrawerProps {
  mode: 'create' | 'edit';
  branchId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const BranchFormDrawer: React.FC<BranchFormDrawerProps> = ({
  mode,
  branchId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getBranchById, selectedBranch } = useBranches();
  const t = useTranslations();
  const entityName = t('branch', { defaultValue: 'Branch' });
  useEffect(() => {
    if (visible && mode === 'edit' && branchId) {
      getBranchById(branchId);
    }
  }, [visible, mode, branchId, getBranchById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={branchId} // Force remount when branchId changes
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
      <BranchForm
        mode={mode}
        branchId={branchId}
        initialValues={selectedBranch || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default BranchFormDrawer;
