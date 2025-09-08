'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseMaterialDetailsDrawer from '@/components/courseMaterials/CourseMaterialDetailsDrawer';
import CourseMaterialFormDrawer from '@/components/courseMaterials/CourseMaterialFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useCourseMaterials} from '@/hooks/useCourseMaterials';
import {useLocalization} from '@/hooks/useLocalization';

import {ICourseMaterial} from '@/types/courseMaterial';

export default function CourseMaterialsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCourseMaterialId, setSelectedCourseMaterialId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsCourseMaterialId, setSelectedDetailsCourseMaterialId] = useState<
    number | undefined
  >();

  const { courseMaterials, listStatus, pagination, loadCourseMaterials, removeCourseMaterial } =
    useCourseMaterials();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadCourseMaterials({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadCourseMaterials({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadCourseMaterials]);

  const handleEditDrawer = (courseMaterialId: number) => {
    setSelectedCourseMaterialId(courseMaterialId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedCourseMaterialId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadCourseMaterials({ page: 1, limit: 10 });
  };

  const handleViewDetails = (courseMaterialId: number) => {
    setSelectedDetailsCourseMaterialId(courseMaterialId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (courseMaterialId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedCourseMaterialId(courseMaterialId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<ICourseMaterial> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/course-materials',
    searchFields: ['title', 'type', 'status'] as (keyof ICourseMaterial)[],
    onSearch: (searchText: string) => {
      loadCourseMaterials({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: courseMaterials,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.TITLE),
        dataIndex: 'title',
        key: 'title',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.COURSE),
        key: 'course',
        render: (courseMaterial: ICourseMaterial) => (
          <span>{courseMaterial.course?.name || 'N/A'}</span>
        ),
      },
      {
        title: t(LOCALE_KEYS.SUBJECT),
        key: 'subject',
        render: (courseMaterial: ICourseMaterial) => (
          <span>{courseMaterial.subject?.name || 'N/A'}</span>
        ),
      },
      {
        title: t(LOCALE_KEYS.TYPE),
        dataIndex: 'type',
        key: 'type',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.ACCESS_LEVEL),
        dataIndex: 'accessLevel',
        key: 'accessLevel',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
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
        render: (courseMaterial: ICourseMaterial) => (
          <EntityActions
            onView={() => router.push(`/course-materials/${courseMaterial.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/course-materials/${courseMaterial.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeCourseMaterial(courseMaterial.id)}
            id={courseMaterial.id}
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
          onRetry={() => loadCourseMaterials({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<ICourseMaterial>} />
        </AsyncErrorBoundary>

        <CourseMaterialFormDrawer
          mode={drawerMode}
          courseMaterialId={selectedCourseMaterialId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <CourseMaterialDetailsDrawer
          courseMaterialId={selectedDetailsCourseMaterialId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
