'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateCourseDetailsConfig} from '@/components/courses/courseConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useCourses} from '@/hooks/useCourses';

import {Status} from '@/types/common';
import {ICourse} from '@/types/course';

interface CourseDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { courses, listStatus, loadCourses, getCourseById, loadCourse } = useCourses();
  const [course, setCourse] = useState<ICourse | null>(null);
  const t = useTranslations();
  const entityName = t('course', { defaultValue: 'Course' });

  useEffect(() => {
    const courseId = parseInt(resolvedParams.id);
    const foundCourse = getCourseById(courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      loadCourse(courseId);
    }
  }, [resolvedParams.id, getCourseById, loadCourse]);

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses();
    }
  }, [courses.length, loadCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      const foundCourse = getCourseById(parseInt(resolvedParams.id));
      if (foundCourse) {
        setCourse(foundCourse);
      }
    }
  }, [courses, resolvedParams.id, getCourseById]);

  const config = useCreateCourseDetailsConfig(
    course,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ICourse>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseDetailPage;
