'use client';

import { Card, Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import CostCentersForm from '@/components/accounting/CostCentersForm';
import CostCentersTree from '@/components/accounting/CostCentersTree';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { ICostCenter } from '@/types/costCenters';

export default function CostCentersPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const [rootNodes, setRootNodes] = useState<ICostCenter[]>([]);
  const [selectedNode, setSelectedNode] = useState<ICostCenter | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectNode = (node: ICostCenter) => {
    setSelectedNode(node);
  };

  const handleDataLoaded = (nodes: ICostCenter[]) => {
    setRootNodes(nodes);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleClear = () => {
    setSelectedNode(undefined);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-4">
          <Row gutter={16}>
            <Col span={10}>
              <Card
                title={t(LOCALE_KEYS.COST_CENTERS, { defaultValue: 'Cost Centers' })}
                className="h-full"
              >
                <CostCentersTree
                  onSelect={handleSelectNode}
                  refreshTrigger={refreshTrigger}
                  onDataLoaded={handleDataLoaded}
                  selectedKey={selectedNode?.id}
                />
              </Card>
            </Col>
            <Col span={14}>
              <CostCentersForm
                selectedNode={selectedNode}
                onSuccess={handleSuccess}
                onClear={handleClear}
                rootNodes={rootNodes}
              />
            </Col>
          </Row>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
