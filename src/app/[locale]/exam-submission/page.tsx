'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import AddressDetailsDrawer from '@/components/addresses/AddressDetailsDrawer';
import AddressFormDrawer from '@/components/addresses/AddressFormDrawer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';


import { useExamSubmissions } from '@/hooks/useExamSubmissions';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamSubmission } from '@/types/examSubmission';
import { MdRateReview } from 'react-icons/md';
import { IExam } from '../../../types/exam';

export default function ExamSubmissionPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SUBMISSION, { defaultValue: 'Exam Submission' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsAddressId, setSelectedDetailsAddressId] = useState<number | undefined>();

  const { listStatus, pagination, loadExamSubmissions, examSubmissions, removeExamSubmission } = useExamSubmissions();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadExamSubmissions({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadExamSubmissions({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadExamSubmissions]);

  const handleEditDrawer = (addressId: number) => {
    setSelectedAddressId(addressId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };



  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExamSubmissions({ page: 1, limit: 10 });
  };

  const handleViewDetails = (addressId: number) => {
    setSelectedDetailsAddressId(addressId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (addressId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedAddressId(addressId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleReviewExamSubmission = (examSubmissionId: number) => {
    router.push(`/exam-submission/review?submissionId=${examSubmissionId}`);
  }

  const config: EntityConfig<IExamSubmission> = {
    name: entityName,
    title: t(LOCALE_KEYS.EXAM_SUBMISSION, { name: entityName }),
    route: '/exam-submission',
    searchFields: ['exam'] as (keyof IExamSubmission)[],
    onSearch: (searchText: string) => {
      loadExamSubmissions({ page: 1, limit: 10, search: searchText });
    },

    items: examSubmissions,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.NAME, { defaultValue: 'Name' }),
        key: 'name',
        render: (data: IExam) => (
          <span>
            {data.name}
          </span>
        ),
      },
      {
        title: t(LOCALE_KEYS.STATE),
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
        render: (examSubmission: IExamSubmission) => (
          <EntityActions
            onView={() => router.push(`/addresses/${examSubmission.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/addresses/${examSubmission.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeExamSubmission(examSubmission.id)}
            id={examSubmission.id}
            extraActions={[
              {
                key: 'assignReview',
                icon: <MdRateReview />,
                label: t(LOCALE_KEYS.REVIEW),
                onClick: () => handleReviewExamSubmission(examSubmission.id),
              }

            ]}
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
          onRetry={() => loadExamSubmissions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IExamSubmission>} />
        </AsyncErrorBoundary>

        <AddressFormDrawer
          mode={drawerMode}
          addressId={selectedAddressId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <AddressDetailsDrawer
          addressId={selectedDetailsAddressId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
