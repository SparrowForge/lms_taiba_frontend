'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import InstituteForm from '@/components/institutes/InstituteForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useInstitutes} from '@/hooks/useInstitutes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const InstituteEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedInstitute, detailsStatus, getInstituteById } = useInstitutes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.INSTITUTE, { defaultValue: 'Institute' });

  useEffect(() => {
    const instituteId = parseInt(resolvedParams.id);
    getInstituteById(instituteId);
  }, [resolvedParams.id, getInstituteById]);


  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedInstitute || selectedInstitute.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/institutes')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}</Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <InstituteForm
            mode="edit"
            instituteId={parseInt(resolvedParams.id)}
            initialValues={selectedInstitute}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default InstituteEditPage;
