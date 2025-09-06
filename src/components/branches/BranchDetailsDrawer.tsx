'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useBranches} from '@/hooks/useBranches';
import {useLocalization} from '@/hooks/useLocalization';

import {IBranch} from '@/types/branch';
import {Status} from '@/types/common';

import {useCreateBranchDetailsConfig} from './branchConfig';

interface BranchDetailsDrawerProps {
  branchId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (branchId: number) => void;
}

const BranchDetailsDrawer: React.FC<BranchDetailsDrawerProps> = ({
  branchId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedBranch, loadBranch, detailsStatus } = useBranches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BRANCH, { defaultValue: 'Branch' });
  useEffect(() => {
    if (visible && branchId) {
      //getBranchById(branchId);
      loadBranch(branchId);
    }
  }, [visible, branchId, loadBranch]);

  const handleEdit = (branch: IBranch) => {
    onEdit(branch.id);
  };

  const config = useCreateBranchDetailsConfig(
    selectedBranch,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={branchId} // Force remount when branchId changes
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

export default BranchDetailsDrawer;
