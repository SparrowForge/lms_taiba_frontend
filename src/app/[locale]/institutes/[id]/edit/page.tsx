'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import InstituteForm from '@/components/institutes/InstituteForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useInstitutes} from '@/hooks/useInstitutes';

import {IInstitute} from '@/types/institute';


interface PageProps {
  params: Promise<{ id: string }>;
}

const InstituteEditPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { institutes, listStatus, loadInstitutes, getInstituteById, loadInstitute } =
    useInstitutes();
  const [item, setItem] = useState<IInstitute | null>(null);
  const t = useTranslations();
  const entityName = t('institute');

  useEffect(() => {
    const itemId = parseInt(resolvedParams.id);
    const found = getInstituteById(itemId);
    if (found) setItem(found);
    else loadInstitute(itemId);
  }, [resolvedParams.id, getInstituteById, loadInstitute]);

  useEffect(() => {
    if (institutes.length === 0) loadInstitutes();
  }, [institutes.length, loadInstitutes]);

  useEffect(() => {
    if (institutes.length > 0) {
      const found = getInstituteById(parseInt(resolvedParams.id));
      if (found) setItem(found);
    }
  }, [institutes, resolvedParams.id, getInstituteById]);

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            {t('loading', { defaultValue: 'Loading...' })}
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!item) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/institutes')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => router.back();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <InstituteForm
            mode="edit"
            instituteId={parseInt(resolvedParams.id)}
            initialValues={{ name: item.name, status: item.status }}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default InstituteEditPage;
