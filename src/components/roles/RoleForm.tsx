'use client';

import { Button, Form, Input, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { StatusSelectFormItem } from '@/components/ui/StatusSelect';

import { useBranches } from '@/hooks/useBranches';
import { useLocalization } from '@/hooks/useLocalization';
import { useRoles } from '@/hooks/useRoles';

import { getErrorMessage } from '@/types/errors';
import { IRole, IRoleCreate, IRoleUpdate } from '@/types/role';

import FormLayout from '../layout/FormLayout';

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
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/roles');
        }
      } else if (mode === 'edit' && roleId) {
        await editRole(roleId, values as IRoleUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/roles/${roleId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        // Use the helper function for other error types
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
    >
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
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {branches.map((branch) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name} ({branch.code})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.NAME)} />
      </Form.Item>

      <Form.Item
        name="description"
        label={t(LOCALE_KEYS.DESCRIPTION)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) }),
          },
        ]}
      >
        <Input.TextArea placeholder={t(LOCALE_KEYS.DESCRIPTION)} rows={4} />
      </Form.Item>
      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default RoleForm;
