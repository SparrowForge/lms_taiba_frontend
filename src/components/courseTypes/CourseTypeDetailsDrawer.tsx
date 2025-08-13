'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useCourseTypes} from '@/hooks/useCourseTypes';

import {Status} from '@/types/common';
import {ICourseType} from '@/types/courseType';

import {useCreateCourseTypeDetailsConfig} from './courseTypeConfig';


interface CourseTypeDetailsDrawerProps {
  courseTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (courseTypeId: number) => void;
}

const CourseTypeDetailsDrawer: React.FC<CourseTypeDetailsDrawerProps> = ({
  courseTypeId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedCourseType, getCourseTypeById, detailsStatus } = useCourseTypes();
  const t = useTranslations();
  const entityName = t('courseType', { defaultValue: 'Course Type' });
  useEffect(() => {
    if (visible && courseTypeId) {
      getCourseTypeById(courseTypeId);
    }
  }, [visible, courseTypeId, getCourseTypeById]);

  const handleEdit = (courseType: ICourseType) => {
    onEdit(courseType.id);
  };

  const config = useCreateCourseTypeDetailsConfig(
    selectedCourseType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={courseTypeId} // Force remount when courseTypeId changes
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

export default CourseTypeDetailsDrawer;
