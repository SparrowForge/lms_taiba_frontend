import { Spin } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

import { useLocalization } from '@/hooks/useLocalization';

interface EntityEditLoadingViewProps {
  entityName: string;
}

const EntityEditLoadingView: React.FC<EntityEditLoadingViewProps> = ({ entityName }) => {
  const { t } = useLocalization();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Spin />
          <div>
            {t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default EntityEditLoadingView;
