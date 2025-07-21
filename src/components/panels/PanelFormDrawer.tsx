import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {usePanels} from '@/hooks/usePanels';
import {IPanel} from '@/types/panel';
import PanelForm from './PanelForm';
import { useTranslations } from 'next-intl';

interface PanelFormDrawerProps {
  mode: 'create' | 'edit';
  panelId?: number;
  initialValues?: Partial<IPanel>;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const PanelFormDrawer: React.FC<PanelFormDrawerProps> = ({
  mode,
  panelId,
  initialValues,
  visible,
  onCancel,
  onSuccess
}) => {
  const { getPanelById, loadPanel } = usePanels();
  const [panel, setPanel] = useState<IPanel | null>(null);
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' }); 
  useEffect(() => {
    if (mode === 'edit' && panelId && visible) {
      const foundPanel = getPanelById(panelId);
      if (foundPanel) {
        setPanel(foundPanel);
      } else {
        loadPanel(panelId);
      }
    }
  }, [mode, panelId, visible, getPanelById, loadPanel]);

  const getTitle = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  const getFormInitialValues = () => {
    if (mode === 'edit' && panel) {
      return {
        name: panel.name,
      };
    }
    return initialValues;
  };

  return (
    <Drawer
      title={getTitle()}
      open={visible}
      onClose={onCancel}
      width={500}
      placement="right"
    >
      <PanelForm
        mode={mode}
        panelId={panelId}
        initialValues={getFormInitialValues()}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default PanelFormDrawer;
