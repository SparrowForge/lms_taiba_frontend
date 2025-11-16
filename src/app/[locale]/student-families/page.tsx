'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import StudentFamilyDetailsDrawer from '@/components/studentFamilies/StudentFamilyDetailsDrawer';
import StudentFamilyFormDrawer from '@/components/studentFamilies/StudentFamilyFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useLocalization } from '@/hooks/useLocalization';
import { useStudentFamilies } from '@/hooks/useStudentFamilies';

import { IStudent } from '@/types/student';
import { IStudentFamily } from '@/types/studentFamily';
import { STUDENT_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useTranslations } from 'next-intl';

export default function StudentFamiliesPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.STUDENT_FAMILY, { defaultValue: 'Student Family' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedStudentFamilyId, setSelectedStudentFamilyId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsStudentFamilyId, setSelectedDetailsStudentFamilyId] = useState<
    number | undefined
  >();

  const { studentFamilies, listStatus, pagination, loadStudentFamilies, removeStudentFamily } =
    useStudentFamilies();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  const loadWithParams = (
    searchParams: URLSearchParams,
    skip: string | null,
    limit: string | null,
  ) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    loadStudentFamilies({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadStudentFamilies]);

  const handleEditDrawer = (studentFamilyId: number) => {
    setSelectedStudentFamilyId(studentFamilyId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedStudentFamilyId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadStudentFamilies({ page: 1, limit: 10 });
  };

  const handleViewDetails = (studentFamilyId: number) => {
    setSelectedDetailsStudentFamilyId(studentFamilyId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (studentFamilyId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedStudentFamilyId(studentFamilyId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IStudentFamily> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/student-families',
    searchFields: [
      'student.name',
      'fatherName',
      'motherName',
      'fatherPhone',
      'motherPhone',
    ] as (keyof IStudentFamily)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadStudentFamilies({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: studentFamilies,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
      
    columns: [
      {
        title: t(LOCALE_KEYS.STUDENT),
        dataIndex: 'student',
        key: 'student',
        render: (student: IStudent) => <span>{student?.firstName || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.FATHER_NAME),
        dataIndex: 'fatherName',
        key: 'fatherName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.MOTHER_NAME),
        dataIndex: 'motherName',
        key: 'motherName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.FATHER_PHONE),
        dataIndex: 'fatherPhone',
        key: 'fatherPhone',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.MOTHER_PHONE),
        dataIndex: 'motherPhone',
        key: 'motherPhone',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.NO_OF_SIBLINGS),
        dataIndex: 'noOfSiblings',
        key: 'noOfSiblings',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.CREATED_AT),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (studentFamily: IStudentFamily) => (
          <EntityActions
            onView={() => router.push(`/student-families/${studentFamily.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/student-families/${studentFamily.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeStudentFamily(studentFamily.id)}
            id={studentFamily.id}
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
          onRetry={() => loadStudentFamilies({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IStudentFamily>} />
        </AsyncErrorBoundary>

        <StudentFamilyFormDrawer
          mode={drawerMode}
          studentFamilyId={selectedStudentFamilyId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <StudentFamilyDetailsDrawer
          studentFamilyId={selectedDetailsStudentFamilyId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
