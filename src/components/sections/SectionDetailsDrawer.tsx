'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useSections } from '@/hooks/useSections';
import { useLocalization } from '@/hooks/useLocalization';

import { ISection } from '@/types/section';

import { useCreateSectionDetailsConfig } from './sectionConfig';

interface SectionDetailsDrawerProps {
  sectionId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (sectionId: number) => void;
}

const SectionDetailsDrawer: React.FC<SectionDetailsDrawerProps> = ({
  sectionId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedSection, loadSection, detailsStatus } = useSections();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SECTION, { defaultValue: 'Section' });

  useEffect(() => {
    if (visible && sectionId) {
      loadSection(sectionId);
    }
  }, [visible, sectionId, loadSection]);

  const handleEdit = (section: ISection) => {
    onEdit(section.id);
  };

  const config = useCreateSectionDetailsConfig(
    selectedSection,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={sectionId} // Force remount when sectionId changes
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

export default SectionDetailsDrawer;

