'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useBranches} from '@/hooks/useBranches';

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
  
  const { selectedBranch, getBranchById, detailsStatus } = useBranches();
  const t = useTranslations();
  const entityName = t('branch', { defaultValue: 'Branch' });
  useEffect(() => {
    if (visible && branchId) {
      getBranchById(branchId);
    }
  }, [visible, branchId, getBranchById]);

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
