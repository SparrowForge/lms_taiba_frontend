'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentDetailsDrawer from '@/components/students/StudentDetailsDrawer';
import StudentFormDrawer from '@/components/students/StudentFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';
import {IStudent} from '@/types/student';


export default function StudentsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });
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
    setDrawerVisible(false)
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
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
        title: t(LOCALE_KEYS.APPLICATION_NO, { defaultValue: 'Application No' }),
        dataIndex: 'applicationNo',
        key: 'applicationNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.NAME, { defaultValue: 'Name' }),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.CARD_NO, { defaultValue: 'Card No' }),
        dataIndex: 'cardNo',
        key: 'cardNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.REGISTRATION_NO, { defaultValue: 'Registration No' }),
        dataIndex: 'registrationNo',
        key: 'registrationNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.COURSE),
        dataIndex: ['course', 'name'],
        key: 'course',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.BATCH),
        dataIndex: ['batch', 'name'],
        key: 'batch',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.BRANCH),
        dataIndex: ['branch', 'name'],
        key: 'branch',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {t(LOCALE_KEYS.STATUS, { defaultValue: status })}
          </span>
        ),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (student: IStudent) => (
          <EntityActions
            onView={() => router.push(`/students/${student.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/students/${student.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
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
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
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
