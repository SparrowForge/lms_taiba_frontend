import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {usePanels} from '@/hooks/usePanels';
import {IPanel} from '@/types/panel';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';
import {createPanelDetailsConfig} from './panelConfig';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

interface PanelDetailsDrawerProps {
  panelId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit?: (panelId: number) => void;
}

const PanelDetailsDrawer: React.FC<PanelDetailsDrawerProps> = ({
  panelId,
  visible,
  onClose,
  onEdit
}) => {
  const { panels, listStatus, loadPanels, getPanelById, loadPanel } = usePanels();
  const [panel, setPanel] = useState<IPanel | null>(null);
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });
  useEffect(() => {
    if (panelId && visible) {
      const foundPanel = getPanelById(panelId);
      if (foundPanel) {
        setPanel(foundPanel);
      } else {
        loadPanel(panelId);
      }
    }
  }, [panelId, visible, getPanelById, loadPanel]);

  useEffect(() => {
    if (panels.length === 0) {
      loadPanels();
    }
  }, [panels.length, loadPanels]);

  useEffect(() => {
    if (panels.length > 0 && panelId) {
      const foundPanel = getPanelById(panelId);
      if (foundPanel) {
        setPanel(foundPanel);
      }
    }
  }, [panels, panelId, getPanelById]);

  const config = createPanelDetailsConfig(
    panel,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null,
    { embedded: true, onEdit: onEdit ? (p) => onEdit(p.id) : undefined }
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      open={visible}
      onClose={onClose}
      width={500}
      placement="right"
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default PanelDetailsDrawer;
