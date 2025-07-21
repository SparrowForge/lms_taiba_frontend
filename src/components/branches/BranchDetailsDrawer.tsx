'use client';

import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { IBranch } from '@/types/branch';
import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';
import { createBranchDetailsConfig } from './branchConfig';
import { useBranches } from '@/hooks/useBranches';
import { Status } from '@/types/common';
import { useTranslations } from 'next-intl';

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
  const [branch, setBranch] = useState<IBranch | null>(null);
  const { branches, getBranchById, loadBranch, detailsStatus } = useBranches();
  const t = useTranslations();
  const entityName = t('branch', { defaultValue: 'Branch' });
  useEffect(() => {
    if (visible && branchId) {
      // Try to get from current list first
      const existingBranch = getBranchById(branchId);
      if (existingBranch) {
        setBranch(existingBranch);
      } else {
        // Load from API if not in current list
        loadBranch(branchId);
      }
    } else {
      setBranch(null);
    }
  }, [visible, branchId, getBranchById, loadBranch]);

  // Update branch when branches list changes
  useEffect(() => {
    if (branchId && branches.length > 0) {
      const foundBranch = getBranchById(branchId);
      if (foundBranch) {
        setBranch(foundBranch);
      }
    }
  }, [branches, branchId, getBranchById]);

  const handleEdit = (branch: IBranch) => {
    onEdit(branch.id);
  };

  const config = createBranchDetailsConfig(
    branch,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    }
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

export default BranchDetailsDrawer; 