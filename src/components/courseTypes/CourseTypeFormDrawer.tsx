'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useCourseTypes} from '@/hooks/useCourseTypes';

import {ICourseType} from '@/types/courseType';

import CourseTypeForm from './CourseTypeForm';


interface Props {
  mode: 'create' | 'edit';
  courseTypeId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CourseTypeFormDrawer: React.FC<Props> = ({
  mode,
  courseTypeId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<ICourseType> | undefined>();
  const { courseTypes, getCourseTypeById, loadCourseType } = useCourseTypes();
  const t = useTranslations();
  const entityName = t('courseType', { defaultValue: 'Course Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && courseTypeId) {
      const existing = getCourseTypeById(courseTypeId);
      if (existing) setInitialValues(existing);
      else loadCourseType(courseTypeId);
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, courseTypeId, getCourseTypeById, loadCourseType]);

  useEffect(() => {
    if (mode === 'edit' && courseTypeId && courseTypes.length > 0) {
      const found = getCourseTypeById(courseTypeId);
      if (found) setInitialValues(found);
    }
  }, [courseTypes, courseTypeId, mode, getCourseTypeById]);

  const handleSuccess = () => {
    onSuccess();
    setInitialValues(undefined);
  };
  const handleCancel = () => {
    onCancel();
    setInitialValues(undefined);
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
      <CourseTypeForm
        mode={mode}
        courseTypeId={courseTypeId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default CourseTypeFormDrawer;
