'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useBranches} from '@/hooks/useBranches';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';

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
  const { getBranchById, selectedBranch, loadBranch, detailsStatus } = useBranches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BRANCH, { defaultValue: 'Branch' });
  useEffect(() => {
    if (visible && mode === 'edit' && branchId) {
      //getBranchById(branchId);
      loadBranch(branchId);
    }
  }, [visible, mode, branchId, loadBranch]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={branchId} // Force remount when branchId changes
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
