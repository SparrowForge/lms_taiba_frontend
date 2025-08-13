'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {usePanels} from '@/hooks/usePanels';

import PanelForm from './PanelForm';


interface PanelFormDrawerProps {
  mode: 'create' | 'edit';
  panelId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const PanelFormDrawer: React.FC<PanelFormDrawerProps> = ({
  mode,
  panelId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getPanelById, selectedPanel } = usePanels();
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });
  useEffect(() => {
    if (visible && mode === 'edit' && panelId) {
      getPanelById(panelId);
    }
  }, [visible, mode, panelId, getPanelById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <PanelForm
        mode={mode}
        panelId={panelId}
        initialValues={selectedPanel || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default PanelFormDrawer;
