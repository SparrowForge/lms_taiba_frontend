'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import PanelForm from '@/components/panels/PanelForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {usePanels} from '@/hooks/usePanels';

import {IPanel} from '@/types/panel';


interface PanelEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PanelEditPage: React.FC<PanelEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { panels, listStatus, loadPanels, getPanelById, loadPanel } = usePanels();
  const [panel, setPanel] = useState<IPanel | null>(null);
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });

  useEffect(() => {
    const panelId = parseInt(resolvedParams.id);
    const foundPanel = getPanelById(panelId);
    if (foundPanel) {
      setPanel(foundPanel);
    } else {
      loadPanel(panelId);
    }
  }, [resolvedParams.id, getPanelById, loadPanel]);

  useEffect(() => {
    if (panels.length === 0) {
      loadPanels();
    }
  }, [panels.length, loadPanels]);

  useEffect(() => {
    if (panels.length > 0) {
      const foundPanel = getPanelById(parseInt(resolvedParams.id));
      if (foundPanel) {
        setPanel(foundPanel);
      }
    }
  }, [panels, resolvedParams.id, getPanelById]);

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div>{t('loading', { defaultValue: 'Loading...' })}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!panel) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/panels')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <PanelForm
            mode="edit"
            panelId={parseInt(resolvedParams.id)}
            initialValues={{
              name: panel.name,
              status: panel.status,
          }}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PanelEditPage;
