import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {usePanels} from '@/hooks/usePanels';

import {IPanel} from '@/types/panel';

import PanelForm from './PanelForm';


interface PanelFormDrawerProps {
  mode: 'create' | 'edit';
  panelId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const PanelFormDrawer: React.FC<PanelFormDrawerProps> = ({
  mode,
  panelId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getPanelById, loadPanel } = usePanels();
  const [initialValues, setInitialValues] = useState<Partial<IPanel> | undefined>();
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });
  useEffect(() => {
    if (mode === 'edit' && panelId && visible) {
      const foundPanel = getPanelById(panelId);
      if (foundPanel) {
        setInitialValues(foundPanel);
      } else {
        loadPanel(panelId);
      }
    }
  }, [mode, panelId, visible, getPanelById, loadPanel]);

  const getTitle = () =>
    mode === 'create'
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  return (
    <Drawer title={getTitle()} open={visible} onClose={onCancel} width={500} placement="right">
      <PanelForm
        mode={mode}
        panelId={panelId}
        initialValues={initialValues}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default PanelFormDrawer;
