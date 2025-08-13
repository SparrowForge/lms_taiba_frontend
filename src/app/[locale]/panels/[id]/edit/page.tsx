'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import PanelForm from '@/components/panels/PanelForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {usePanels} from '@/hooks/usePanels';

import {Status} from '@/types/common';


const PanelEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedPanel, detailsStatus, getPanelById } = usePanels();
  const t = useTranslations();
  const entityName = t('panel');

  useEffect(() => {
    const panelId = parseInt(resolvedParams.id);
    getPanelById(panelId);
  }, [resolvedParams.id, getPanelById]);


  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t('loading', { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedPanel) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/panels')}>
                  {t('backToList_name', { name: entityName })}</Button>
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
          <PageHeader title={t('edit_name', { name: entityName })} onBack={() => router.back()} />
          <PanelForm
            mode="edit"
            panelId={parseInt(resolvedParams.id)}
            initialValues={selectedPanel}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PanelEditPage;
