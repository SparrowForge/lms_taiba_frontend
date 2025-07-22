'use client';

import React, {useEffect, useState} from 'react';
import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCourses} from '@/hooks/useCourses';
import {ICourse} from '@/types/course';
import {useTranslations} from 'next-intl';
import CourseForm from '@/components/courses/CourseForm';
import {PageHeader} from '@/components/ui/PageHeader';

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
    courseType: course.courseType,
    durationInSemesters: course.durationInSemesters,
    description: course.description,
  });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <CourseForm
            mode="edit"
            courseId={course.id}
            initialValues={getInitialValues()}
            embedded={false}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseEditPage;
