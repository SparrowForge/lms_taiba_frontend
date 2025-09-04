'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useCourseTypes} from '@/hooks/useCourseTypes';
import {useLocalization} from '@/hooks/useLocalization';

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
  const { selectedCourseType, loadCourseType, detailsStatus } = useCourseTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_TYPE, { defaultValue: 'Course Type' });
  useEffect(() => {
    if (visible && courseTypeId) {
      //getCourseTypeById(courseTypeId);
      loadCourseType(courseTypeId);
    }
  }, [visible, courseTypeId, loadCourseType]);

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

export default CourseTypeDetailsDrawer;
