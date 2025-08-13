'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentDetailsDrawer from '@/components/students/StudentDetailsDrawer';
import StudentFormDrawer from '@/components/students/StudentFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';
import {IStudent} from '@/types/student';


export default function StudentsPage() {
  const t = useTranslations();
  const entityName = t('student', { defaultValue: 'Student' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsStudentId, setSelectedDetailsStudentId] = useState<number | undefined>();

  const { students, listStatus, pagination, loadStudents, removeStudent } = useStudents();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadStudents({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadStudents({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadStudents]);

  const handleEditDrawer = (studentId: number) => {
    setSelectedStudentId(studentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedStudentId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadStudents({ page: 1, limit: 10 });
  };

  const handleViewDetails = (studentId: number) => {
    setSelectedDetailsStudentId(studentId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (studentId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedStudentId(studentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IStudent> = {
    name: entityName,
    title: t('management_name', { name: entityName }),
    route: '/students',
    searchFields: ['name', 'applicationNo', 'cardNo', 'registrationNo'] as (keyof IStudent)[],
    onSearch: (searchText: string) => {
      loadStudents({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: students,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('application_no', { defaultValue: 'Application No' }),
        dataIndex: 'applicationNo',
        key: 'applicationNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('name', { defaultValue: 'Name' }),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('card_no', { defaultValue: 'Card No' }),
        dataIndex: 'cardNo',
        key: 'cardNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('registration_no', { defaultValue: 'Registration No' }),
        dataIndex: 'registrationNo',
        key: 'registrationNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('course'),
        dataIndex: ['course', 'name'],
        key: 'course',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('batch'),
        dataIndex: ['batch', 'name'],
        key: 'batch',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('branch'),
        dataIndex: ['branch', 'name'],
        key: 'branch',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {t(status, { defaultValue: status })}
          </span>
        ),
      },
      {
        title: t('actions'),
        key: 'actions',
        width: 100,
        render: (student: IStudent) => (
          <EntityActions
            onView={() => router.push(`/students/${student.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/students/${student.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeStudent(student.id)}
            id={student.id}
          />
        ),
      },
    ],
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <AsyncErrorBoundary
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
              : null
          }
          onRetry={() => loadStudents({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IStudent>} />
        </AsyncErrorBoundary>

        <StudentFormDrawer
          mode={drawerMode}
          studentId={selectedStudentId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <StudentDetailsDrawer
          studentId={selectedDetailsStudentId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
