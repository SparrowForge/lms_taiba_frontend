'use client';

import { Button, Col, Form, Input, Row, Select, Space, Checkbox } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import BranchFormDrawer from '@/components/branches/BranchFormDrawer';
import FormLayout from '@/components/layout/FormLayout';
import QuickAddDrawerButton from '@/components/ui/QuickAddDrawerButton';
import { StatusSelectFormItem } from '@/components/ui/StatusSelect';

import { useBranches } from '@/hooks/useBranches';
import { useLocalization } from '@/hooks/useLocalization';
import { useRoles } from '@/hooks/useRoles';

import { getErrorMessage } from '@/types/errors';
import { IRole, IRoleCreate, IRoleUpdate } from '@/types/role';

interface RoleFormProps {
  mode: 'create' | 'edit';
  roleId?: number;
  initialValues?: Partial<IRoleCreate | IRoleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
  mode,
  roleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE, { defaultValue: 'Role' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createRole, editRole, actionStatus } = useRoles();
  const { branches, loadBranches } = useBranches();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
      form.setFieldsValue({
        isHeadOfDepartment: false,
        isHeadOfHR: false,
        isHeadOfAccount: false,
      });
    }
  }, [mode, form]);

  useEffect(() => {
    loadBranches({ page: 1, limit: 100 });
  }, [loadBranches]);

  const handleSubmit = async (values: Partial<IRole>) => {
    try {
      if (mode === 'create') {
        await createRole(values as IRoleCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        onSuccess ? onSuccess() : router.push('/roles');
      } else if (mode === 'edit' && roleId) {
        await editRole(roleId, values as IRoleUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        onSuccess ? onSuccess() : router.push(`/roles/${roleId}`);
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    onCancel ? onCancel() : router.back();
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        isHeadOfDepartment: false,
        isHeadOfHR: false,
        isHeadOfAccount: false,
        ...(mode === 'edit' ? initialValues : {}),
      }}
    >
      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="branchId"
            label={t(LOCALE_KEYS.BRANCH)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BRANCH) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BRANCH) })}
              loading={branches.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {branches.map((branch) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={BranchFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadBranches({ page: 1, limit: 100 });
                if (data?.id) form.setFieldsValue({ branchId: data.id });
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label={t(LOCALE_KEYS.DESCRIPTION)}
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      {/* ✅ New Boolean Fields */}
      <Form.Item name="isHeadOfDepartment" valuePropName="checked">
        <Checkbox>Head of Department</Checkbox>
      </Form.Item>

      <Form.Item name="isHeadOfHR" valuePropName="checked">
        <Checkbox>Head of HR</Checkbox>
      </Form.Item>

      <Form.Item name="isHeadOfAccount" valuePropName="checked">
        <Checkbox>Head of Account</Checkbox>
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={actionStatus.status === Status.LOADING}
          >
            {mode === 'create'
              ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
              : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName })}
          </Button>
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default RoleForm;
