'use client';

import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {IAudit} from '@/types/audit';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';
import {useCreateAuditDetailsConfig} from './auditConfig';
import {useAudit} from '@/hooks/useAudit';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

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
  const [audit, setAudit] = useState<IAudit | null>(null);
  const { audits, getAuditById, loadAudit, detailsStatus } = useAudit();
  const t = useTranslations();
  const entityName = t('audit', { defaultValue: 'Audit' });

  useEffect(() => {
    if (visible && auditId) {
      // Try to get from current list first
      const existingAudit = getAuditById(auditId);
      if (existingAudit) {
        setAudit(existingAudit);
      } else {
        // Load from API if not in current list
        loadAudit(auditId);
      }
    } else {
      setAudit(null);
    }
  }, [visible, auditId, getAuditById, loadAudit]);

  // Update audit when audits list changes
  useEffect(() => {
    if (auditId && audits.length > 0) {
      const foundAudit = getAuditById(auditId);
      if (foundAudit) {
        setAudit(foundAudit);
      }
    }
  }, [audits, auditId, getAuditById]);

  const handleEdit = (audit: IAudit) => {
    onEdit(audit.id);
  };

  const config = useCreateAuditDetailsConfig(
    audit,
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

export default AuditDetailsDrawer;
