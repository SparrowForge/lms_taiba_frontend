'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {usePanels} from '@/hooks/usePanels';

import {Status} from '@/types/common';
import {IPanel} from '@/types/panel';

import {useCreatePanelDetailsConfig} from './panelConfig';


interface PanelDetailsDrawerProps {
  panelId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (panelId: number) => void;
}

const PanelDetailsDrawer: React.FC<PanelDetailsDrawerProps> = ({
  panelId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedPanel, getPanelById, detailsStatus } = usePanels();
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });
  useEffect(() => {
    if (visible && panelId) {
      getPanelById(panelId);
    }
  }, [visible, panelId, getPanelById]);

  const handleEdit = (panel: IPanel) => {
    onEdit(panel.id);
  };

  const config = useCreatePanelDetailsConfig(
    selectedPanel,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={panelId} // Force remount when panelId changes
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

export default PanelDetailsDrawer;
