'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseForm from '@/components/courses/CourseForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useCourses} from '@/hooks/useCourses';

import {ICourse} from '@/types/course';

interface CourseEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const CourseEditPage: React.FC<CourseEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
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

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div>{t('loading', { defaultValue: 'Loading...' })}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/courses')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const getInitialValues = () => ({
    departmentId: course.departmentId,
    name: course.name,
    code: course.code,
    courseTypeId: course.courseTypeId,
    scheduleTypeId: course.scheduleTypeId,
    status: course.status,
    remarks: course.remarks,
    durationInSemesters: course.durationInSemesters,
    description: course.description,
  });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <CourseForm
            mode="edit"
            courseId={course.id}
            initialValues={getInitialValues()}
            embedded={false}
          onCancel={handleBack}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseEditPage;
