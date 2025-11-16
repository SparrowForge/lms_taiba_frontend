'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { DEGREE_TYPE_OPTIONS, Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import StudentEducationDetailsDrawer from '@/components/studentEducations/StudentEducationDetailsDrawer';
import StudentEducationFormDrawer from '@/components/studentEducations/StudentEducationFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useLocalization } from '@/hooks/useLocalization';
import { useStudentEducations } from '@/hooks/useStudentEducations';

import { IStudent } from '@/types/student';
import { IStudentEducation } from '@/types/studentEducation';
import { STUDENT_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useTranslations } from 'next-intl';
import { useInstitutes } from '@/hooks/useInstitutes';

export default function StudentEducationsPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.STUDENT_EDUCATION, { defaultValue: 'Student Education' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedStudentEducationId, setSelectedStudentEducationId] = useState<
    number | undefined
  >();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsStudentEducationId, setSelectedDetailsStudentEducationId] = useState<
    number | undefined
  >();
  const {loadInstitutes,institutes} = useInstitutes()

  const {
    studentEducations,
    listStatus,
    pagination,
    loadStudentEducations,
    removeStudentEducation,
  } = useStudentEducations();

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
      loadStudentEducations({ page, limit: limitNum, ...params });
    };
  
    useEffect(() => {
      loadWithParams(searchParams, skip, limit);
    }, [searchParams, skip, limit, loadStudentEducations]);

    useEffect(()=>{
      loadInstitutes({page:1, limit:99})
    },[loadInstitutes])



  const handleEditDrawer = (studentEducationId: number) => {
    setSelectedStudentEducationId(studentEducationId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedStudentEducationId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadStudentEducations({ page: 1, limit: 10 });
  };

  const handleViewDetails = (studentEducationId: number) => {
    setSelectedDetailsStudentEducationId(studentEducationId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (studentEducationId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedStudentEducationId(studentEducationId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IStudentEducation> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/student-educations',
    searchFields: [
      'student.name',
      'degreeName',
      'institute',
      'groupMajor',
    ] as (keyof IStudentEducation)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadStudentEducations({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: studentEducations,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    filters: [
          {
            key: 'status',
            label: t(LOCALE_KEYS.STATUS),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...STUDENT_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
            ],
          },
          {
            key: 'degreeType',
            label: t(LOCALE_KEYS.DEGREE_TYPE),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...DEGREE_TYPE_OPTIONS.map((s) => ({ label: translate(s.value), value: s.value })),
            ],
          },
          {
            key: 'institute',
            label: t(LOCALE_KEYS.INSTITUTE),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...institutes.map((i) => ({ label: i.name, value: String(i.id) })),
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
        title: t(LOCALE_KEYS.DEGREE_TYPE),
        dataIndex: 'degreeType',
        key: 'degreeType',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.DEGREE_NAME),
        dataIndex: 'degreeName',
        key: 'degreeName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.PASSING_YEAR),
        dataIndex: 'passingYear',
        key: 'passingYear',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.INSTITUTE),
        dataIndex: 'institute',
        key: 'institute',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.RESULT),
        dataIndex: 'result',
        key: 'result',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.GROUP_MAJOR),
        dataIndex: 'groupMajor',
        key: 'groupMajor',
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
        render: (studentEducation: IStudentEducation) => (
          <EntityActions
            onView={() => router.push(`/student-educations/${studentEducation.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t('quick_view')}
            onEdit={() => router.push(`/student-educations/${studentEducation.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quick_edit')}
            onDelete={() => removeStudentEducation(studentEducation.id)}
            id={studentEducation.id}
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
          onRetry={() => loadStudentEducations({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IStudentEducation>} />
        </AsyncErrorBoundary>

        <StudentEducationFormDrawer
          mode={drawerMode}
          studentEducationId={selectedStudentEducationId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <StudentEducationDetailsDrawer
          studentEducationId={selectedDetailsStudentEducationId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
