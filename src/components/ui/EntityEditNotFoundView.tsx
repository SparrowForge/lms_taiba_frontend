import { Button, Card } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

import { useLocalization } from '@/hooks/useLocalization';

interface EntityEditNotFoundViewProps {
  entityName: string;
  backRoute: string;
}

const EntityEditNotFoundView: React.FC<EntityEditNotFoundViewProps> = ({
  entityName,
  backRoute,
}) => {
  const { t } = useLocalization();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
              <Button type="primary" onClick={() => router.push(backRoute)}>
                {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default EntityEditNotFoundView;
