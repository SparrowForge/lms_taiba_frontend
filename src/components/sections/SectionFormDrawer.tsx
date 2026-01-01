'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useSections } from '@/hooks/useSections';
import { useLocalization } from '@/hooks/useLocalization';

import { ISection } from '@/types/section';

import SectionForm from './SectionForm';

interface SectionFormDrawerProps {
  mode: 'create' | 'edit';
  sectionId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const SectionFormDrawer: React.FC<SectionFormDrawerProps> = ({
  mode,
  sectionId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getSectionById, selectedSection, loadSection, detailsStatus } = useSections();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SECTION, { defaultValue: 'Section' });

  useEffect(() => {
    if (visible && mode === 'edit' && sectionId) {
      loadSection(sectionId);
    }
  }, [visible, mode, sectionId, loadSection]);

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
      key={sectionId} // Force remount when sectionId changes
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
      <SectionForm
        mode={mode}
        sectionId={sectionId}
        initialValues={selectedSection || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SectionFormDrawer;

