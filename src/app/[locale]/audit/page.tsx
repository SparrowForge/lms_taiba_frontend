'use client';

import {DeleteOutlined} from '@ant-design/icons';
import {Button, Modal, Tag} from 'antd';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import AuditDetailsDrawer from '@/components/audits/AuditDetailsDrawer';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useAudit} from '@/hooks/useAudit';
import {useLocalization} from '@/hooks/useLocalization';

import {IAudit} from '@/types/audit';
import {Status} from '@/types/common';


export default function AuditPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.AUDIT, { defaultValue: 'Audit' });
  const router = useRouter();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsAuditId, setSelectedDetailsAuditId] = useState<number | undefined>();

  const { audits, listStatus, pagination, loadAudits, cleanAudit, actionStatus } = useAudit();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadAudits({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadAudits({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadAudits]);

  useEffect(() => {
    if (actionStatus.status === Status.SUCCESS) {
      toast.success(actionStatus.message || t(LOCALE_KEYS.ACTION_SUCCESSFUL));
      loadAudits({ page: 1, limit: 10 });
    } else if (actionStatus.status === Status.FAILED) {
      toast.error(actionStatus.message || t(LOCALE_KEYS.ACTION_FAILED));
    }
  }, [actionStatus, loadAudits, t]);

  const handleViewDetails = (auditId: number) => {
    setSelectedDetailsAuditId(auditId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (auditId: number) => {
    // Audit logs are read-only, so this won't do anything
    console.log('onDetailsEdit', auditId);
    console.log('Edit not available for audit logs');
  };

  const handleCleanAudit = () => {
    Modal.confirm({
      title: t(LOCALE_KEYS.CONFIRM_CLEAN_AUDIT),
      content: t(LOCALE_KEYS.CONFIRM_CLEAN_AUDIT_MESSAGE),
      okText: t(LOCALE_KEYS.YES),
      cancelText: t(LOCALE_KEYS.NO),
      onOk: async () => {
        await cleanAudit();
      },
    });
  };

  const config: EntityConfig<IAudit> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/audit',
    searchFields: ['username', 'action', 'resource', 'method', 'ip'] as (keyof IAudit)[],
    onSearch: (searchText: string) => {
      loadAudits({ page: 1, limit: 10, search: searchText });
    },
    extraActions: [
      <Button
        key={'clean_audit'}
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={handleCleanAudit}
        loading={actionStatus.status === Status.LOADING}
      >
        {t(LOCALE_KEYS.CLEAN_AUDIT)}
      </Button>,
    ],
    disableAddNew: true,
    items: audits,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.USERNAME),
        dataIndex: 'username',
        key: 'username',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.ACTION),
        dataIndex: 'action',
        key: 'action',
        render: (action: string) => (
          <Tag
            color={
              action === 'CREATE'
                ? 'green'
                : action === 'UPDATE'
                  ? 'blue'
                  : action === 'DELETE'
                    ? 'red'
                    : 'orange'
            }
          >
            {action}
          </Tag>
        ),
      },
      {
        title: t(LOCALE_KEYS.RESOURCE),
        dataIndex: 'resource',
        key: 'resource',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.METHOD),
        dataIndex: 'method',
        key: 'method',
        render: (method: string) => (
          <Tag
            color={
              method === 'GET'
                ? 'blue'
                : method === 'POST'
                  ? 'green'
                  : method === 'PUT'
                    ? 'orange'
                    : method === 'DELETE'
                      ? 'red'
                      : 'default'
            }
          >
            {method}
          </Tag>
        ),
      },
      {
        title: t(LOCALE_KEYS.RESPONSE_STATUS),
        dataIndex: 'responseStatus',
        key: 'responseStatus',
        render: (status: number) => (
          <Tag
            color={
              status >= 200 && status < 300
                ? 'green'
                : status >= 400 && status < 500
                  ? 'orange'
                  : status >= 500
                    ? 'red'
                    : 'default'
            }
          >
            {status}
          </Tag>
        ),
      },
      {
        title: t(LOCALE_KEYS.RESPONSE_TIME),
        dataIndex: 'responseTime',
        key: 'responseTime',
        render: (time: number) => <span>{time}ms</span>,
      },
      {
        title: t(LOCALE_KEYS.SUCCESS),
        dataIndex: 'success',
        key: 'success',
        render: (success: boolean) => (
          <Tag color={success ? 'green' : 'red'}>{success ? t('yes') : t('no')}</Tag>
        ),
      },
      {
        title: t(LOCALE_KEYS.IP),
        dataIndex: 'ip',
        key: 'ip',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.TIMESTAMP),
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (audit: IAudit) => (
          <EntityActions
            onView={() => router.push(`/audit/${audit.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={undefined} // No edit for audit logs
            onDelete={undefined} // No delete for individual audit logs
            id={audit.id}
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
          onRetry={() => loadAudits({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IAudit>} />
        </AsyncErrorBoundary>

        <AuditDetailsDrawer
          auditId={selectedDetailsAuditId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
