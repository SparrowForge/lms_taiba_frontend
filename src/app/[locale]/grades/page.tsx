import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import GradeDashboard from '@/components/gradeDashboard/GradeDashboard';
import {MainLayout} from '@/components/layout/MainLayout';

const GradePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
          <GradeDashboard />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default GradePage;
