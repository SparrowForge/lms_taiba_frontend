'use client';

import ChartOfAccountsForm from '@/components/accounting/ChartOfAccountsForm';
import ChartOfAccountsTree from '@/components/accounting/ChartOfAccountsTree';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { IChartOfAccount } from '@/types/chartOfAccounts';
import { Card, Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ChartOfAccountsPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const [rootNodes, setRootNodes] = useState<IChartOfAccount[]>([]);
  const [selectedNode, setSelectedNode] = useState<IChartOfAccount | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectNode = (node: IChartOfAccount) => {
    setSelectedNode(node);
  };

  const handleDataLoaded = (nodes: IChartOfAccount[]) => {
    setRootNodes(nodes);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    // Optionally clear selection or keep it?
    // Let's keep it to show updated data or just refresh tree
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
              <Card title={t(LOCALE_KEYS.COA, { defaultValue: 'COA' })} className="h-full">
                <ChartOfAccountsTree
                  onSelect={handleSelectNode}
                  refreshTrigger={refreshTrigger}
                  onDataLoaded={handleDataLoaded}
                  selectedKey={selectedNode?.id}
                />
              </Card>
            </Col>
            <Col span={14}>
              <ChartOfAccountsForm
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
