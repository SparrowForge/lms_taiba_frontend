'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { selectedPanel, loadPanel, detailsStatus } = usePanels();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.PANEL, { defaultValue: 'Panel' });
  useEffect(() => {
    if (visible && panelId) {
      //getPanelById(panelId);
      loadPanel(panelId);
    }
  }, [visible, panelId, loadPanel]);

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

export default PanelDetailsDrawer;
