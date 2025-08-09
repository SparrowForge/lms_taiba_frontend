'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';


import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';


import {useCourseTypes} from '@/hooks/useCourseTypes';

import {Status} from '@/types/common';
import {ICourseType} from '@/types/courseType';

import {useCreateCourseTypeDetailsConfig} from './courseTypeConfig';


interface Props {
  courseTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (courseTypeId: number) => void;
}

const CourseTypeDetailsDrawer: React.FC<Props> = ({ courseTypeId, visible, onClose, onEdit }) => {
  const [courseType, setCourseType] = useState<ICourseType | null>(null);
  const { courseTypes, getCourseTypeById, loadCourseType, detailsStatus } = useCourseTypes();
  const t = useTranslations();
  const entityName = t('courseType', { defaultValue: 'Course Type' });

  useEffect(() => {
    if (visible && courseTypeId) {
      const existing = getCourseTypeById(courseTypeId);
      if (existing) setCourseType(existing);
      else loadCourseType(courseTypeId);
    } else {
      setCourseType(null);
    }
  }, [visible, courseTypeId, getCourseTypeById, loadCourseType]);

  useEffect(() => {
    if (courseTypeId && courseTypes.length > 0) {
      const found = getCourseTypeById(courseTypeId);
      if (found) setCourseType(found);
    }
  }, [courseTypes, courseTypeId, getCourseTypeById]);

  const handleEdit = (ct: ICourseType) => onEdit(ct.id);

  const config = useCreateCourseTypeDetailsConfig(
    courseType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    { embedded: true, onEdit: handleEdit },
  );

  return (
    <Drawer
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
