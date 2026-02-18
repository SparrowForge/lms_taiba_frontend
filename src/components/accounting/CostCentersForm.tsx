import { Button, Card, Checkbox, Col, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { costCentersService } from '@/services/costCentersService';
import { ICostCenter, ICostCenterCreate, ICostCenterUpdate } from '@/types/costCenters';

const { TextArea } = Input;

interface CostCentersFormProps {
  selectedNode?: ICostCenter;
  onSuccess: () => void;
  onClear: () => void;
  rootNodes?: ICostCenter[];
}

const CostCentersForm: React.FC<CostCentersFormProps> = ({
  selectedNode,
  onSuccess,
  onClear,
  rootNodes = [],
}) => {
  const { t } = useLocalization();
  const [form] = Form.useForm();

  // Mode: 'create' or 'edit'
  const [mode, setMode] = React.useState<'create' | 'edit'>('create');
  const [activeParent, setActiveParent] = React.useState<ICostCenter | null>(null);

  useEffect(() => {
    if (selectedNode) {
      setMode('edit');
      setActiveParent(selectedNode.parent || null);

      form.setFieldsValue({
        costName: selectedNode.costName,
        parentName: selectedNode.parent?.costName || 'Root',
        remarks: selectedNode.remarks || '',
        isActive: selectedNode.status === '1',
      });
    } else {
      handleClear();
    }
  }, [selectedNode, form]);

  const handleNew = () => {
    setMode('create');
    // If a node was selected, it becomes the parent for the new node
    const newParent = selectedNode || null;
    setActiveParent(newParent);

    form.resetFields();
    form.setFieldsValue({
      parentName: newParent ? newParent.costName : 'Root',
      isActive: true, // Default to active
    });
  };

  const handleClear = () => {
    setMode('create');
    setActiveParent(null);
    form.resetFields();
    onClear(); // Notify parent to clear selection
  };

  const onFinish = async (values: any) => {
    try {
      const payload: ICostCenterCreate = {
        costName: values.costName,
        remarks: values.remarks,
        status: values.isActive ? '1' : '0',
        parentId: activeParent?.id ? Number(activeParent.id) : undefined,
        level: activeParent ? (activeParent.level || 0) + 1 : 1,
      };

      if (mode === 'create') {
        await costCentersService.create(payload);
        toast.success(t(LOCALE_KEYS.COST_CENTER_CREATED_SUCCESSFULLY));
      } else if (mode === 'edit' && selectedNode) {
        await costCentersService.update(selectedNode.id, payload as ICostCenterUpdate);
        toast.success(t(LOCALE_KEYS.COST_CENTER_UPDATED_SUCCESSFULLY));
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving cost center', error);
      toast.error(t(LOCALE_KEYS.FAILED_SAVE_COST_CENTER));
    }
  };

  const handleDelete = async () => {
    if (!selectedNode) return;

    if (window.confirm(t(LOCALE_KEYS.CONFIRM_DELETE_COST_CENTER))) {
      try {
        await costCentersService.delete(selectedNode.id);
        toast.success(t(LOCALE_KEYS.COST_CENTER_DELETED_SUCCESSFULLY));
        handleClear();
        onSuccess(); // Refresh tree
      } catch (error) {
        console.error('Error deleting cost center', error);
        toast.error(t(LOCALE_KEYS.FAILED_DELETE_COST_CENTER));
      }
    }
  };

  return (
    <Card
      title={t(LOCALE_KEYS.COST_CENTER, { defaultValue: 'Cost Center' })}
      variant="outlined"
      className="w-full"
    >
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }}>
        <Row gutter={16}>
          {/* Name */}
          <Col span={24}>
            <Form.Item
              label={t(LOCALE_KEYS.NAME, { defaultValue: 'Name' })}
              name="costName"
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.REQUIRED_FIELD, {
                    field: t(LOCALE_KEYS.NAME, { defaultValue: 'Name' }),
                  }),
                },
              ]}
            >
              <Input
                placeholder={t(LOCALE_KEYS.ENTER_COST_CENTER_NAME, {
                  defaultValue: 'Enter cost center name',
                })}
              />
            </Form.Item>
          </Col>

          {/* Parent (read-only) */}
          <Col span={24}>
            <Form.Item label={t(LOCALE_KEYS.PARENT, { defaultValue: 'Parent' })} name="parentName">
              <Input readOnly />
            </Form.Item>
          </Col>

          {/* Description */}
          <Col span={24}>
            <Form.Item
              label={t(LOCALE_KEYS.DESCRIPTION, { defaultValue: 'Description' })}
              name="remarks"
            >
              <TextArea
                rows={4}
                placeholder={t(LOCALE_KEYS.ENTER_DESCRIPTION, {
                  defaultValue: 'Enter description',
                })}
              />
            </Form.Item>
          </Col>

          {/* Active Checkbox */}
          <Col span={24}>
            <Form.Item name="isActive" valuePropName="checked">
              <Checkbox>{t(LOCALE_KEYS.IS_ACTIVE, { defaultValue: 'Active' })}</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex gap-2 mt-4">
          <Button type="primary" onClick={handleNew}>
            {t(LOCALE_KEYS.NEW, { defaultValue: 'New' })}
          </Button>
          <Button type="primary" htmlType="submit">
            {mode === 'create'
              ? t(LOCALE_KEYS.SAVE, { defaultValue: 'Save' })
              : t(LOCALE_KEYS.UPDATE, { defaultValue: 'Update' })}
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
            {t(LOCALE_KEYS.DELETE, { defaultValue: 'Delete' })}
          </Button>
          <Button onClick={handleClear}>{t(LOCALE_KEYS.CLEAR, { defaultValue: 'Clear' })}</Button>
        </div>
      </Form>
    </Card>
  );
};

export default CostCentersForm;
