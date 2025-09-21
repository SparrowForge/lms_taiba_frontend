'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import GradeRuleDetailsDrawer from '@/components/gradeRules/GradeRuleDetailsDrawer';
import GradeRuleFormDrawer from '@/components/gradeRules/GradeRuleFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useGradeRules } from '@/hooks/useGradeRules';
import { useLocalization } from '@/hooks/useLocalization';

import { IGradeRule } from '@/types/gradeRule';

export default function GradeRulesPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.GRADE_RULE, { defaultValue: 'Grade Rule' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedGradeRuleId, setSelectedGradeRuleId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsGradeRuleId, setSelectedDetailsGradeRuleId] = useState<
    number | undefined
  >();

  const { gradeRules, listStatus, pagination, loadGradeRules, removeGradeRule } = useGradeRules();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadGradeRules({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadGradeRules({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadGradeRules]);

  const handleEditDrawer = (gradeRuleId: number) => {
    setSelectedGradeRuleId(gradeRuleId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedGradeRuleId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadGradeRules({ page: 1, limit: 10 });
  };

  const handleViewDetails = (gradeRuleId: number) => {
    setSelectedDetailsGradeRuleId(gradeRuleId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (gradeRuleId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedGradeRuleId(gradeRuleId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IGradeRule> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/grade-rules',
    searchFields: ['grade', 'remarks'] as (keyof IGradeRule)[],
    onSearch: (searchText: string) => {
      loadGradeRules({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: gradeRules,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.GRADE),
        dataIndex: 'grade',
        key: 'grade',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.COURSE_ID),
        dataIndex: 'courseId',
        key: 'courseId',
        render: (text: number | null) => <span>{text || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.MIN_MARKS),
        dataIndex: 'minMarks',
        key: 'minMarks',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.MAX_MARKS),
        dataIndex: 'maxMarks',
        key: 'maxMarks',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.GRADE_POINT),
        dataIndex: 'gradePoint',
        key: 'gradePoint',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.REMARKS),
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
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
        render: (gradeRule: IGradeRule) => (
          <EntityActions
            onView={() => router.push(`/grade-rules/${gradeRule.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/grade-rules/${gradeRule.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeGradeRule(gradeRule.id)}
            id={gradeRule.id}
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
          onRetry={() => loadGradeRules({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IGradeRule>} />
        </AsyncErrorBoundary>

        <GradeRuleFormDrawer
          mode={drawerMode}
          gradeRuleId={selectedGradeRuleId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <GradeRuleDetailsDrawer
          gradeRuleId={selectedDetailsGradeRuleId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
