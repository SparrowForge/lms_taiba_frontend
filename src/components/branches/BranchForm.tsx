'use client';

import {Button, Form, Input, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import StatusSelect from '@/components/ui/StatusSelect';

import {useAddresses} from '@/hooks/useAddresses';
import {useBranches} from '@/hooks/useBranches';
import {useInstitutes} from '@/hooks/useInstitutes';
import {useUsers} from '@/hooks/useUsers';

import {IBranch, IBranchCreate, IBranchUpdate} from '@/types/branch';
import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import FormLayout from '../layout/FormLayout';


interface BranchFormProps {
  mode: 'create' | 'edit';
  branchId?: number;
  initialValues?: Partial<IBranchCreate | IBranchUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const BranchForm: React.FC<BranchFormProps> = ({
  mode,
  branchId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('branch');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createBranch, editBranch, actionStatus } = useBranches();
  const { addresses, loadAddresses } = useAddresses();
  const { users, loadUsers } = useUsers();
  const { institutes, loadInstitutes } = useInstitutes();

  useEffect(() => {
    // Load related entities for selects
    loadAddresses({ page: 1, limit: 100 });
    loadUsers({ page: 1, limit: 100 });
    loadInstitutes({ page: 1, limit: 100 });
  }, [loadAddresses, loadUsers, loadInstitutes]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IBranch>) => {
    try {
      if (mode === 'create') {
        await createBranch(values as IBranchCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/branches');
        }
      } else if (mode === 'edit' && branchId) {
        await editBranch(branchId, values as IBranchUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/branches/${branchId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
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
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      aria-label={`${mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName })} form`}
      role="form"
    >
      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('pleaseEnterName_name', { name: entityName }) }]}
      >
        <Input placeholder={t('name')} aria-label={t('name')} aria-required="true" />
      </Form.Item>

      <Form.Item
        name="code"
        label={t('code')}
        rules={[{ required: true, message: t('pleaseEnterCode') }]}
      >
        <Input placeholder={t('code')} aria-label={t('code')} aria-required="true" />
      </Form.Item>

      <Form.Item
        name="instituteId"
        label={t('institute')}
        rules={[{ required: true, message: t('required_name', { name: t('institute') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('institute') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {institutes.map((inst) => (
            <Select.Option key={inst.id} value={inst.id}>
              {inst.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="addressId"
        label={t('address')}
        rules={[{ required: true, message: t('required_name', { name: t('address') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('address') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {addresses.map((address) => (
            <Select.Option key={address.id} value={address.id}>
              {address.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="externalInstituteIdNo"
        label={t('externalInstituteIdNo')}
        rules={[
          { required: true, message: t('required_name', { name: t('externalInstituteIdNo') }) },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="campusDirectorUserId"
        label={t('campusDirectorUserId')}
        rules={[
          { required: true, message: t('required_name', { name: t('campusDirectorUserId') }) },
        ]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('user') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label={t('status')}
        rules={[{ required: true, message: t('required_name', { name: t('status') }) }]}
      >
        <StatusSelect preset="binary" />
      </Form.Item>

      <Form.Item style={{ marginTop: '32px', textAlign: embedded ? 'right' : 'center' }}>
        <Space size={embedded ? 'small' : 'large'}>
          <Button
            type="primary"
            htmlType="submit"
            size={embedded ? 'middle' : 'large'}
            style={{ minWidth: embedded ? '80px' : '120px' }}
            loading={actionStatus.status === Status.LOADING}
            aria-label={`${getSubmitText()} button`}
          >
            {getSubmitText()}
          </Button>
          <Button
            onClick={handleCancel}
            size={embedded ? 'middle' : 'large'}
            style={{ minWidth: embedded ? '80px' : '120px' }}
            aria-label={t('cancel', { defaultValue: 'Cancel' }) + ' button'}
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default BranchForm;
