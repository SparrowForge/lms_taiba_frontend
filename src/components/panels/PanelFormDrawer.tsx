'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { getPanelById, selectedPanel, loadPanel, detailsStatus } = usePanels();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.PANEL, { defaultValue: 'Panel' });
  useEffect(() => {
    if (visible && mode === 'edit' && panelId) {
      //getPanelById(panelId);
      loadPanel(panelId);
    }
  }, [visible, mode, panelId, loadPanel]);

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
      key={panelId} // Force remount when panelId changes
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
