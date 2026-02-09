import { useLocalization } from '@/hooks/useLocalization';
import { chartOfAccountsService } from '@/services/chartOfAccountsService';
import { IChartOfAccount } from '@/types/chartOfAccounts';
import { DownOutlined } from '@ant-design/icons';
import { Empty, Spin, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';

interface ChartOfAccountsTreeProps {
  onSelect: (node: IChartOfAccount) => void;
  refreshTrigger: number;
  onDataLoaded?: (nodes: IChartOfAccount[]) => void;
  selectedKey?: React.Key;
}

const ChartOfAccountsTree: React.FC<ChartOfAccountsTreeProps> = ({
  onSelect,
  refreshTrigger,
  onDataLoaded,
  selectedKey,
}) => {
  const { t } = useLocalization();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const formatTreeData = (accounts: IChartOfAccount[], parent?: IChartOfAccount): DataNode[] => {
    return accounts.map((account) => {
      const nodeWithParent = { ...account, parent };
      return {
        title: `${account.accountCode} - ${account.accountName} (${account.accountType})`,
        key: account.id,
        children: formatTreeData(account.children || [], nodeWithParent),
        isLeaf: !account.children || account.children.length === 0,
        data: nodeWithParent, // Store full entity data with parent reference
      };
    });
  };

  const loadTree = async () => {
    setLoading(true);
    try {
      const data = await chartOfAccountsService.getTree();
      setTreeData(formatTreeData(data));
      if (onDataLoaded) {
        onDataLoaded(data);
      }
      // Optionally expand all initially or just first level
      // setExpandedKeys(data.map(d => d.id));
    } catch (error) {
      console.error('Failed to load chart of accounts tree', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, [refreshTrigger]);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
  };

  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys.length > 0) {
      const selectedNode = info.node.data as IChartOfAccount;
      onSelect(selectedNode);
    }
  };

  if (loading) {
    return <Spin />;
  }

  if (treeData.length === 0) {
    return <Empty description="No accounts found" />;
  }

  return (
    <Tree
      showLine
      switcherIcon={<DownOutlined />}
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={true}
      onSelect={handleSelect}
      treeData={treeData}
      selectedKeys={selectedKey ? [selectedKey] : []}
      height={600} // Virtual scroll if many items
    />
  );
};

export default ChartOfAccountsTree;
