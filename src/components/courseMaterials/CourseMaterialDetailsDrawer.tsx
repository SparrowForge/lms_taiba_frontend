'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useCourseMaterials } from '@/hooks/useCourseMaterials';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourseMaterial } from '@/types/courseMaterial';

import { useCreateCourseMaterialDetailsConfig } from './courseMaterialConfig';

interface CourseMaterialDetailsDrawerProps {
  courseMaterialId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (courseMaterialId: number) => void;
}

const CourseMaterialDetailsDrawer: React.FC<CourseMaterialDetailsDrawerProps> = ({
  courseMaterialId,
  visible,
  onClose,
  onEdit,
}) => {
  const { t } = useLocalization();
  const { selectedCourseMaterial, loadCourseMaterial, detailsStatus } = useCourseMaterials();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });

  useEffect(() => {
    if (visible && courseMaterialId) {
      //getCourseMaterialById(courseMaterialId);
      loadCourseMaterial(courseMaterialId);
    }
  }, [visible, courseMaterialId, loadCourseMaterial]);

  const handleEdit = (courseMaterial: ICourseMaterial) => {
    onEdit(courseMaterial.id);
  };

  const config = useCreateCourseMaterialDetailsConfig(
    selectedCourseMaterial,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    { embedded: true, onEdit: handleEdit },
  );

  return (
    <Drawer
      key={courseMaterialId} // Force remount when courseMaterialId changes
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

export default CourseMaterialDetailsDrawer;
