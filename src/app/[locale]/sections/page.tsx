'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SectionDetailsDrawer from '@/components/sections/SectionDetailsDrawer';
import SectionFormDrawer from '@/components/sections/SectionFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useSections } from '@/hooks/useSections';
import { useLocalization } from '@/hooks/useLocalization';
import { useBatches } from '@/hooks/useBatches';
import { useTranslations } from 'next-intl';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';

import { ISection } from '@/types/section';
import { IBatch } from '@/types/batch';

export default function SectionsPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.SECTION, { defaultValue: 'Section' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedSectionId, setSelectedSectionId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsSectionId, setSelectedDetailsSectionId] = useState<number | undefined>();

  const { sections, listStatus, pagination, loadSections, removeSection } = useSections();
  const { batches, loadBatches } = useBatches();

  //get skip & limit from url
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
    loadSections({ page, limit: limitNum, ...params });
    loadBatches({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadSections, loadBatches]);

  const handleEditDrawer = (sectionId: number) => {
    setSelectedSectionId(sectionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedSectionId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadSections({ page: 1, limit: 10 });
  };

  const handleViewDetails = (sectionId: number) => {
    setSelectedDetailsSectionId(sectionId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (sectionId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedSectionId(sectionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<ISection> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/sections',
    searchFields: ['name', 'code'] as (keyof ISection)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadSections({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: sections,
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
        key: 'batchId',
        label: t(LOCALE_KEYS.BATCH),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...batches.map((b) => ({ label: b.name, value: String(b.id) })),
        ],
      },
    ],
    columns: [
      {
        title: t(LOCALE_KEYS.NAME),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.CODE),
        dataIndex: 'code',
        key: 'code',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t(LOCALE_KEYS.REMARKS),
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.BATCH),
        dataIndex: 'batch',
        key: 'batch',
        render: (batch: IBatch) => <span>{batch?.name || 'N/A'}</span>,
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
        render: (section: ISection) => (
          <EntityActions
            onView={() => router.push(`/sections/${section.id}`)}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeSection(section.id)}
            id={section.id}
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
          onRetry={() => loadSections({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<ISection>} />
        </AsyncErrorBoundary>

        <SectionFormDrawer
          mode={drawerMode}
          sectionId={selectedSectionId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <SectionDetailsDrawer
          sectionId={selectedDetailsSectionId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}

