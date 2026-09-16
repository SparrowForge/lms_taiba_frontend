'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useLeads } from '@/hooks/useLeads';
import { useLocalization } from '@/hooks/useLocalization';

import { ILead } from '@/types/lead';

import { useCreateLeadDetailsConfig } from './leadConfig';

interface LeadDetailsDrawerProps {
  leadId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (leadId: number) => void;
}

const LeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({
  leadId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedLead, loadLead, detailsStatus } = useLeads();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.LEAD, { defaultValue: 'Lead' });
  useEffect(() => {
    if (visible && leadId) {
      loadLead(leadId);
    }
  }, [visible, leadId, loadLead]);

  const handleEdit = (lead: ILead) => {
    onEdit(lead.id);
  };

  const config = useCreateLeadDetailsConfig(
    selectedLead,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={leadId} // Force remount when leadId changes
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

export default LeadDetailsDrawer;
