'use client';

import React, {useEffect, useState} from 'react';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCourses} from '@/hooks/useCourses';
import {ICourse} from '@/types/course';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';
import {createCourseDetailsConfig} from '@/components/courses/courseConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';

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

  const config = createCourseDetailsConfig(
    course,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || t('failed_name', { name: entityName }) : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseDetailPage;
