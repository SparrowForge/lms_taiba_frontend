'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useLeads } from '@/hooks/useLeads';
import { useLocalization } from '@/hooks/useLocalization';

import LeadForm from './LeadForm';

interface Props {
  mode: 'create' | 'edit';
  leadId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const LeadFormDrawer: React.FC<Props> = ({ mode, leadId, visible, onCancel, onSuccess }) => {
  const { selectedLead, loadLead, detailsStatus } = useLeads();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.LEAD, { defaultValue: 'Lead' });

  useEffect(() => {
    if (visible && mode === 'edit' && leadId) {
      loadLead(leadId);
    }
  }, [visible, mode, leadId, loadLead]);

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
      key={leadId} // Force remount when leadId changes
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
      <LeadForm
        mode={mode}
        leadId={leadId}
        initialValues={selectedLead || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default LeadFormDrawer;
