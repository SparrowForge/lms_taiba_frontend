'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useBranches} from '@/hooks/useBranches';

import {IBranch} from '@/types/branch';

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
  const [initialValues, setInitialValues] = useState<Partial<IBranch> | undefined>();
  const { branches, getBranchById, loadBranch } = useBranches();
  const t = useTranslations();
  const entityName = t('branch', { defaultValue: 'Branch' });
  useEffect(() => {
    if (visible && mode === 'edit' && branchId) {
      // Try to get from current list first
      const existingBranch = getBranchById(branchId);
      if (existingBranch) {
        setInitialValues(existingBranch);
      } else {
        // Load from API if not in current list
        loadBranch(branchId);
      }
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, branchId, getBranchById, loadBranch]);

  // Update initial values when branches list changes
  useEffect(() => {
    if (mode === 'edit' && branchId && branches.length > 0) {
      const branch = getBranchById(branchId);
      if (branch) {
        setInitialValues(branch);
      }
    }
  }, [branches, branchId, mode, getBranchById]);

  const handleSuccess = () => {
    onSuccess();
    setInitialValues(undefined);
  };

  const handleCancel = () => {
    onCancel();
    setInitialValues(undefined);
  };

  return (
    <Drawer
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
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default BranchFormDrawer;
