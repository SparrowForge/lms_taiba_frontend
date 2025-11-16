'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { GENDER_OPTIONS, Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import StudentProfileDetailsDrawer from '@/components/studentProfiles/StudentProfileDetailsDrawer';
import StudentProfileFormDrawer from '@/components/studentProfiles/StudentProfileFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useLocalization } from '@/hooks/useLocalization';
import { useStudentProfiles } from '@/hooks/useStudentProfiles';

import { IStudent } from '@/types/student';
import { IStudentProfile } from '@/types/studentProfile';
import { ENTITY_STATUS_OPTIONS, MARITAL_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useTranslations } from 'next-intl';

export default function StudentProfilesPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.STUDENT_PROFILE, { defaultValue: 'Student Profile' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedStudentProfileId, setSelectedStudentProfileId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsStudentProfileId, setSelectedDetailsStudentProfileId] = useState<
    number | undefined
  >();

  const { studentProfiles, listStatus, pagination, loadStudentProfiles, removeStudentProfile } =
    useStudentProfiles();

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
      loadStudentProfiles({ page, limit: limitNum, ...params });
    };
  
    useEffect(() => {
      loadWithParams(searchParams, skip, limit);
    }, [searchParams, skip, limit, loadStudentProfiles]);



  const handleEditDrawer = (studentProfileId: number) => {
    setSelectedStudentProfileId(studentProfileId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedStudentProfileId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadStudentProfiles({ page: 1, limit: 10 });
  };

  const handleViewDetails = (studentProfileId: number) => {
    setSelectedDetailsStudentProfileId(studentProfileId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (studentProfileId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedStudentProfileId(studentProfileId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IStudentProfile> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/student-profiles',
    searchFields: [
      'student.name',
      'phone',
      'mobile',
      'email',
      'identityNo',
    ] as (keyof IStudentProfile)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadStudentProfiles( {age: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: studentProfiles,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    filters: [
          {
            key: 'status',
            label: t(LOCALE_KEYS.STATUS),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...ENTITY_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
            ],
          },
          {
            key: 'gender',
            label: t(LOCALE_KEYS.GENDER),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...GENDER_OPTIONS.map((g) => ({ label: translate(g.labelKey), value: g.value })),
            ],
          },
          {
            key: 'maritalStatus',
            label: t(LOCALE_KEYS.MARITAL_STATUS),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...MARITAL_STATUS_OPTIONS.map((g) => ({ label: translate(g.labelKey), value: g.value })),
            ],
          },
          
        ],
    columns: [
      {
        title: t(LOCALE_KEYS.STUDENT),
        dataIndex: 'student',
        key: 'student',
        render: (student: IStudent) => <span>{student?.firstName || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.DATE_OF_BIRTH),
        dataIndex: 'dob',
        key: 'dob',
        render: (text: string) => <span>{text ? new Date(text).toLocaleDateString() : 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.GENDER),
        dataIndex: 'gender',
        key: 'gender',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.PHONE),
        dataIndex: 'phone',
        key: 'phone',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.MOBILE),
        dataIndex: 'mobile',
        key: 'mobile',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.EMAIL),
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.IDENTITY_TYPE),
        dataIndex: 'identityType',
        key: 'identityType',
        render: (text: string) => <span>{text}</span>,
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
        render: (studentProfile: IStudentProfile) => (
          <EntityActions
            onView={() => router.push(`/student-profiles/${studentProfile.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/student-profiles/${studentProfile.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeStudentProfile(studentProfile.id)}
            id={studentProfile.id}
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
          onRetry={() => loadStudentProfiles({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IStudentProfile>} />
        </AsyncErrorBoundary>

        <StudentProfileFormDrawer
          mode={drawerMode}
          studentProfileId={selectedStudentProfileId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <StudentProfileDetailsDrawer
          studentProfileId={selectedDetailsStudentProfileId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
