'use client';

import { Button, Segmented, Space, Statistic, Tag, Tooltip } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import ConvertLeadDrawer from '@/components/leads/ConvertLeadDrawer';
import { LeadStageTag, leadStageLabel } from '@/components/leads/leadConfig';
import LeadDetailsDrawer from '@/components/leads/LeadDetailsDrawer';
import LeadFormDrawer from '@/components/leads/LeadFormDrawer';
import LeadPipelineBoard from '@/components/leads/LeadPipelineBoard';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useLeads } from '@/hooks/useLeads';
import { useLocalization } from '@/hooks/useLocalization';

import { ILead, LeadStage } from '@/types/lead';

export default function LeadsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.LEAD, { defaultValue: 'Lead' });
  const router = useRouter();

  const [view, setView] = useState<'table' | 'pipeline'>('table');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();
  const [convertLead, setConvertLead] = useState<ILead | null>(null);

  const { leads, listStatus, pagination, funnelStats, loadLeads, removeLead, loadFunnelStats } =
    useLeads();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    // The pipeline view needs the whole funnel, not one page of it.
    loadLeads({ page, limit: view === 'pipeline' ? 200 : limitNum, ...params });
  }, [searchParams, skip, limit, loadLeads, view]);

  useEffect(() => {
    loadFunnelStats();
  }, [loadFunnelStats]);

  const reload = () => {
    loadLeads({ page: 1, limit: view === 'pipeline' ? 200 : 10 });
    loadFunnelStats();
  };

  const handleCreateDrawer = () => {
    setSelectedId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };
  const handleEditDrawer = (id: number) => {
    setSelectedId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };
  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    reload();
  };
  const handleViewDetails = (id: number) => {
    setSelectedDetailsId(id);
    setDetailsDrawerVisible(true);
  };
  const handleDetailsEdit = (id: number) => {
    setDetailsDrawerVisible(false);
    setSelectedId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const isOverdue = (lead: ILead) =>
    !!lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date();

  const config: EntityConfig<ILead> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/leads',
    searchFields: ['firstName', 'lastName', 'email', 'phone'] as (keyof ILead)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadLeads({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: leads,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    filters: [
      {
        key: 'stage',
        label: t(LOCALE_KEYS.LEAD_STAGE, { defaultValue: 'Stage' }),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...Object.values(LeadStage).map((stage) => ({
            label: leadStageLabel(stage),
            value: stage,
          })),
        ],
      },
    ],
    columns: [
      {
        title: 'Lead No',
        dataIndex: 'leadNo',
        key: 'leadNo',
        render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.NAME),
        key: 'name',
        render: (item: ILead) => (
          <Space direction="vertical" size={0}>
            <span>{[item.firstName, item.lastName].filter(Boolean).join(' ')}</span>
            <span style={{ fontSize: 12, opacity: 0.65 }}>{item.email ?? item.phone ?? ''}</span>
          </Space>
        ),
      },
      {
        title: t(LOCALE_KEYS.LEAD_STAGE, { defaultValue: 'Stage' }),
        dataIndex: 'stage',
        key: 'stage',
        render: (stage: LeadStage) => <LeadStageTag stage={stage} />,
      },
      {
        title: t(LOCALE_KEYS.COURSE),
        key: 'course',
        render: (item: ILead) => item.course?.name ?? '—',
      },
      {
        title: 'Source',
        key: 'source',
        render: (item: ILead) => item.source?.name ?? '—',
      },
      {
        title: 'Assigned',
        key: 'assignedTo',
        render: (item: ILead) =>
          item.assignedToUserId ? (
            (item.assignedTo?.name ?? `User #${item.assignedToUserId}`)
          ) : (
            <Tag>Unassigned</Tag>
          ),
      },
      {
        title: 'Follow-up',
        key: 'nextFollowUpAt',
        render: (item: ILead) =>
          item.nextFollowUpAt ? (
            <Tooltip title={new Date(item.nextFollowUpAt).toLocaleString()}>
              <Tag color={isOverdue(item) ? 'orange' : 'default'}>
                {isOverdue(item) ? 'Overdue' : 'Scheduled'}
              </Tag>
            </Tooltip>
          ) : (
            '—'
          ),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 160,
        render: (item: ILead) => (
          <Space size={4}>
            {item.stage !== LeadStage.ENROLLED && item.stage !== LeadStage.LOST && (
              <Button size="small" type="link" onClick={() => setConvertLead(item)}>
                {t(LOCALE_KEYS.CONVERT_TO_STUDENT, { defaultValue: 'Convert' })}
              </Button>
            )}
            <EntityActions
              onView={() => router.push(`/leads/${item.id}`)}
              onViewModal={handleViewDetails}
              viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
              onEdit={() => router.push(`/leads/${item.id}/edit`)}
              onEditModal={handleEditDrawer}
              editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
              onDelete={() => removeLead(item.id)}
              id={item.id}
            />
          </Space>
        ),
      },
    ],
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        {funnelStats && (
          <Space size="large" wrap style={{ marginBottom: 16 }}>
            <Statistic title="Total leads" value={funnelStats.total} />
            <Statistic title="Open" value={funnelStats.open} />
            <Statistic title="Enrolled" value={funnelStats.enrolled} />
            <Statistic
              title="Conversion"
              value={funnelStats.conversionRate}
              suffix="%"
              precision={2}
            />
          </Space>
        )}

        <div style={{ marginBottom: 16 }}>
          <Segmented
            value={view}
            onChange={(value) => setView(value as 'table' | 'pipeline')}
            options={[
              { label: 'Table', value: 'table' },
              {
                label: t(LOCALE_KEYS.LEAD_PIPELINE, { defaultValue: 'Pipeline' }),
                value: 'pipeline',
              },
            ]}
          />
        </div>

        <AsyncErrorBoundary
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
              : null
          }
          onRetry={reload}
        >
          {view === 'table' ? (
            <EntityList config={config as EntityConfig<ILead>} />
          ) : (
            <LeadPipelineBoard onOpenLead={handleViewDetails} />
          )}
        </AsyncErrorBoundary>

        <LeadFormDrawer
          mode={drawerMode}
          leadId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <LeadDetailsDrawer
          leadId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />

        <ConvertLeadDrawer
          lead={convertLead}
          visible={!!convertLead}
          onCancel={() => setConvertLead(null)}
          onSuccess={() => {
            setConvertLead(null);
            reload();
          }}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
