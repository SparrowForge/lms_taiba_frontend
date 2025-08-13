'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useAudit} from '@/hooks/useAudit';

import {IAudit} from '@/types/audit';
import {Status} from '@/types/common';

import {useCreateAuditDetailsConfig} from './auditConfig';


interface AuditDetailsDrawerProps {
  auditId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (auditId: number) => void;
}

const AuditDetailsDrawer: React.FC<AuditDetailsDrawerProps> = ({
  auditId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedAudit, getAuditById, detailsStatus } = useAudit();
  const t = useTranslations();
  const entityName = t('audit', { defaultValue: 'Audit' });
  useEffect(() => {
    if (visible && auditId) {
      getAuditById(auditId);
    }
  }, [visible, auditId, getAuditById]);

  const handleEdit = (audit: IAudit) => {
    onEdit(audit.id);
  };

  const config = useCreateAuditDetailsConfig(
    selectedAudit,
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

export default AuditDetailsDrawer;
