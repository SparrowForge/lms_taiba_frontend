import { useBranches } from '@/hooks/useBranches';
import { useLocalization } from '@/hooks/useLocalization';
import { chartOfAccountsService } from '@/services/chartOfAccountsService';
import {
  AccountType,
  IChartOfAccount,
  IChartOfAccountCreate,
  IChartOfAccountUpdate,
} from '@/types/chartOfAccounts';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

interface ChartOfAccountsFormProps {
  selectedNode?: IChartOfAccount;
  onSuccess: () => void;
  onClear: () => void;
  rootNodes?: IChartOfAccount[];
}

const ChartOfAccountsForm: React.FC<ChartOfAccountsFormProps> = ({
  selectedNode,
  onSuccess,
  onClear,
  rootNodes = [],
}) => {
  const { t } = useLocalization();
  const { branches, loadBranches } = useBranches();
  const [form] = Form.useForm();
  const [parentHead, setParentHead] = React.useState<string>('');

  // Mode: 'create' or 'edit'.

  const [mode, setMode] = React.useState<'create' | 'edit'>('create');
  const [activeParent, setActiveParent] = React.useState<IChartOfAccount | null>(null);
  const [selectedBranchIds, setSelectedBranchIds] = React.useState<number[]>([]);
  const [existingBranchAssignments, setExistingBranchAssignments] = React.useState<
    { id: number; branchId: number }[]
  >([]);

  // Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    const loadNodeAndBranches = async () => {
      if (selectedNode) {
        setMode('edit');
        setActiveParent(selectedNode.parent || null);

        form.setFieldsValue({
          headCode: selectedNode.accountCode,
          headName: selectedNode.accountName,
          parentHead: selectedNode.parent?.accountName || 'Root',
          headLevel: selectedNode.level,
          headType: selectedNode.accountType,
          isTransaction: selectedNode.isTransaction,
          isGL: false,
          isActive: selectedNode.status === '1',
        });
        setParentHead(selectedNode.parent ? selectedNode.parent.accountName : 'Root');

        // Load existing branch assignments
        try {
          const assignments = await chartOfAccountsService.getBranches(Number(selectedNode.id));
          const branchIds = assignments.map((a) => a.branch.id);
          const assignmentMap = assignments.map((a) => ({
            id: a.id,
            branchId: a.branch.id,
          }));
          setSelectedBranchIds(branchIds);
          setExistingBranchAssignments(assignmentMap);
        } catch (error) {
          console.error('Error loading branch assignments', error);
          setSelectedBranchIds([]);
          setExistingBranchAssignments([]);
        }
      } else {
        handleClear();
      }
    };

    loadNodeAndBranches();
  }, [selectedNode, form]);

  const handleNew = () => {
    setMode('create');
    // If a node was selected, it becomes the parent for the new node
    const newParent = selectedNode || null;
    setActiveParent(newParent);

    let nextCode = '';
    if (newParent) {
      const parentCode = newParent.accountCode;
      const children = newParent.children || [];

      const pattern = new RegExp(`^${parentCode}(\\d{2})$`);

      let maxSuffix = 0;
      children.forEach((child) => {
        const match = child.accountCode.match(pattern);
        if (match) {
          const suffix = parseInt(match[1], 10);
          if (suffix > maxSuffix) {
            maxSuffix = suffix;
          }
        }
      });

      const nextSuffix = maxSuffix + 1;
      const paddedSuffix = nextSuffix.toString().padStart(2, '0');
      nextCode = `${parentCode}${paddedSuffix}`;
    } else {
      // Root generation logic
      // Pattern: 101, 201, 301...
      // Find max root code that matches pattern ^\d+01$ or just standard increment?
      // User example says: 101 then 201.
      // Let's assume pattern is X01 where X is 1, 2, 3...
      // Or strictly 3 digits ending in 01?
      // Let's implement: Max code + 100?
      /*
        If roots are empty, 101.
        If roots has 101, next 201.
        If roots has 101, 201, next 301.
        */
      let maxRootPrefix = 0;
      rootNodes.forEach((node) => {
        const code = parseInt(node.accountCode, 10);
        if (!isNaN(code)) {
          // Check if it looks like X01 (e.g. 101, 201)
          if (code % 100 === 1) {
            const prefix = Math.floor(code / 100);
            if (prefix > maxRootPrefix) {
              maxRootPrefix = prefix;
            }
          }
        }
      });

      if (maxRootPrefix === 0) {
        nextCode = '101';
      } else {
        nextCode = `${maxRootPrefix + 1}01`;
      }
    }

    form.resetFields();
    form.setFieldsValue({
      headCode: nextCode,
      parentHead: newParent ? newParent.accountName : 'Root',
      headLevel: newParent ? newParent.level + 1 : 1,
      isActive: true, // Default to active
      isTransaction: true,
    });
    setParentHead(newParent ? newParent.accountName : 'Root');
  };

  const handleClear = () => {
    setMode('create');
    setActiveParent(null);
    form.resetFields();
    setParentHead('');
    setSelectedBranchIds([]);
    setExistingBranchAssignments([]);
    onClear(); // Notify parent to clear selection
  };

  const onFinish = async (values: any) => {
    try {
      const payload: any = {
        accountCode: values.headCode,
        accountName: values.headName,
        accountType: values.headType,
        isTransaction: values.isTransaction,
        status: values.isActive ? '1' : '0',
        parentId: activeParent?.id ? Number(activeParent.id) : undefined,
        level: activeParent ? Number(activeParent.level) + 1 : 1,
      };

      if (mode === 'create') {
        const createdAccount = await chartOfAccountsService.create(
          payload as IChartOfAccountCreate,
        );

        // Assign selected branches to the new account
        if (selectedBranchIds.length > 0) {
          const accountId = Number(createdAccount.id);
          await Promise.all(
            selectedBranchIds.map((branchId) =>
              chartOfAccountsService.assignBranch(accountId, branchId),
            ),
          );
        }

        toast.success('Account created successfully');
      } else if (mode === 'edit' && selectedNode) {
        await chartOfAccountsService.update(selectedNode.id, payload as IChartOfAccountUpdate);

        // Sync branches: remove old, add new
        const accountId = Number(selectedNode.id);
        const existingBranchIds = existingBranchAssignments.map((a) => a.branchId);
        const toRemove = existingBranchAssignments.filter(
          (a) => !selectedBranchIds.includes(a.branchId),
        );
        const toAdd = selectedBranchIds.filter((id) => !existingBranchIds.includes(id));

        // Remove unselected branches
        if (toRemove.length > 0) {
          await Promise.all(
            toRemove.map((a) => chartOfAccountsService.removeBranchAssignment(a.id)),
          );
        }

        // Add newly selected branches
        if (toAdd.length > 0) {
          await Promise.all(
            toAdd.map((branchId) => chartOfAccountsService.assignBranch(accountId, branchId)),
          );
        }

        toast.success('Account updated successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving account', error);
      toast.error('Failed to save account');
    }
  };

  const handleDelete = async () => {
    if (!selectedNode) return;

    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await chartOfAccountsService.delete(selectedNode.id);
        toast.success('Account deleted successfully');
        handleClear();
        onSuccess(); // Refresh tree
      } catch (error) {
        console.error('Error deleting account', error);
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <Card title="Chart of Account" variant="outlined" className="w-full">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isActive: true, isTransaction: true }}
      >
        <Row gutter={16}>
          {/* Row 1: Head Code + Head Name */}
          <Col span={12}>
            <Form.Item
              label="Head Code"
              name="headCode"
              rules={[{ required: true, message: 'Code is required' }]}
            >
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Head Name"
              name="headName"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Row 2: Parent Head + Head Type */}
          <Col span={12}>
            <Form.Item label="Parent Head" name="parentHead">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Head Type" name="headType" rules={[{ required: true }]}>
              <Select options={Object.values(AccountType).map((t) => ({ label: t, value: t }))} />
            </Form.Item>
          </Col>

          {/* Head Level - hidden or removed, keeping for data */}
          <Col span={24} style={{ display: 'none' }}>
            <Form.Item label="Head Level" name="headLevel">
              <InputNumber readOnly className="w-full" />
            </Form.Item>
          </Col>

          {/* Branches */}
          <Col span={24}>
            <Form.Item label="Branches">
              <div>
                <Checkbox
                  indeterminate={
                    selectedBranchIds.length > 0 && selectedBranchIds.length < branches.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      const allIds = branches.map((b) => b.id);
                      setSelectedBranchIds(allIds);
                      form.setFieldsValue({ branchIds: allIds });
                    } else {
                      setSelectedBranchIds([]);
                      form.setFieldsValue({ branchIds: [] });
                    }
                  }}
                  checked={branches.length > 0 && selectedBranchIds.length === branches.length}
                >
                  Select All
                </Checkbox>
                <div className="mt-2 pl-4 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                  <Checkbox.Group
                    className="flex flex-col gap-1"
                    options={[...branches]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((b) => ({ label: b.name, value: b.id }))}
                    value={selectedBranchIds}
                    onChange={(checkedValues) => {
                      setSelectedBranchIds(checkedValues as number[]);
                      form.setFieldsValue({ branchIds: checkedValues });
                    }}
                  />
                </div>
              </div>
            </Form.Item>
          </Col>

          {/* Row 3: IsTransaction + IsActive */}
          <Col span={12}>
            <Form.Item name="isTransaction" valuePropName="checked">
              <Checkbox>IsTransaction</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="isActive" valuePropName="checked">
              <Checkbox>IsActive</Checkbox>
            </Form.Item>
          </Col>
          <Form.Item name="isGL" valuePropName="checked" hidden>
            <Checkbox>IsGL</Checkbox>
          </Form.Item>
        </Row>
        <div className="flex gap-2 mt-4">
          <Button type="primary" onClick={handleNew}>
            New
          </Button>
          <Button type="primary" htmlType="submit">
            {mode === 'create' ? 'Save' : 'Update'}
          </Button>
          <Button
            danger
            onClick={handleDelete}
            disabled={
              mode === 'create' ||
              !selectedNode ||
              (selectedNode.children && selectedNode.children.length > 0)
            }
          >
            Delete
          </Button>
          <Button onClick={handleClear}>Clear</Button>
        </div>
      </Form>
    </Card>
  );
};

export default ChartOfAccountsForm;
