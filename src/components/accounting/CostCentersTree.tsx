import { DownOutlined } from '@ant-design/icons';
import { Empty, Spin, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';

import { useLocalization } from '@/hooks/useLocalization';
import { costCentersService } from '@/services/costCentersService';
import { ICostCenter } from '@/types/costCenters';

interface CostCentersTreeProps {
  onSelect: (node: ICostCenter) => void;
  refreshTrigger: number;
  onDataLoaded?: (nodes: ICostCenter[]) => void;
  selectedKey?: React.Key;
}

const CostCentersTree: React.FC<CostCentersTreeProps> = ({
  onSelect,
  refreshTrigger,
  onDataLoaded,
  selectedKey,
}) => {
  const { t } = useLocalization();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const formatTreeData = (costCenters: ICostCenter[], parent?: ICostCenter): DataNode[] => {
    return costCenters.map((cc) => {
      const nodeWithParent = { ...cc, parent };
      return {
        title: cc.costCode ? `${cc.costCode} - ${cc.costName}` : cc.costName,
        key: cc.id,
        children: formatTreeData(cc.children || [], nodeWithParent),
        isLeaf: !cc.children || cc.children.length === 0,
        data: nodeWithParent, // Store full entity data with parent reference
      };
    });
  };

  const loadTree = async () => {
    setLoading(true);
    try {
      const data = await costCentersService.getTree();
      setTreeData(formatTreeData(data));
      if (onDataLoaded) {
        onDataLoaded(data);
      }
    } catch (error) {
      console.error('Failed to load cost centers tree', error);
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
      const selectedNode = info.node.data as ICostCenter;
      onSelect(selectedNode);
    }
  };

  if (loading) {
    return <Spin />;
  }

  if (treeData.length === 0) {
    return <Empty description="No cost centers found" />;
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
      height={600}
    />
  );
};

export default CostCentersTree;
