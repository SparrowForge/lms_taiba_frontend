'use client';

import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useAddresses } from '@/hooks/useAddresses';
import { useBranches } from '@/hooks/useBranches';
import { useInstitutes } from '@/hooks/useInstitutes';
import { useLocalization } from '@/hooks/useLocalization';
import { useUsers } from '@/hooks/useUsers';

import { IBranch, IBranchCreate, IBranchUpdate } from '@/types/branch';
import { getErrorMessage } from '@/types/errors';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';
import QuickAddDrawerButton from '../ui/QuickAddDrawerButton';
import InstituteFormDrawer from '../institutes/InstituteFormDrawer';
import AddressFormDrawer from '../addresses/AddressFormDrawer';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BRANCH, { defaultValue: 'Branch' });
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
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IBranch>) => {
    try {
      if (mode === 'create') {
        await createBranch(values as IBranchCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/branches');
        }
      } else if (mode === 'edit' && branchId) {
        await editBranch(branchId, values as IBranchUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/branches/${branchId}`);
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
      aria-label={`${mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName })} form`}
      role="form"
    >
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
        <Input
          placeholder={t(LOCALE_KEYS.NAME)}
          aria-label={t(LOCALE_KEYS.NAME)}
          aria-required="true"
        />
      </Form.Item>

      <Form.Item
        name="code"
        label={t(LOCALE_KEYS.CODE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_CODE) }]}
      >
        <Input
          placeholder={t(LOCALE_KEYS.CODE)}
          aria-label={t(LOCALE_KEYS.CODE)}
          aria-required="true"
        />
      </Form.Item>

      <Form.Item
        name="instituteId"
        label={t(LOCALE_KEYS.INSTITUTE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.INSTITUTE) }),
          },
        ]}
      >
        <Row gutter={8}>
          <Col flex="1">
            <Form.Item name="instituteId" noStyle>
              <Select
                showSearch
                placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.INSTITUTE) })}
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
          </Col>
          <Col>
            <QuickAddDrawerButton
              drawerComponent={InstituteFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadInstitutes()
                if (data?.id) {
                  form.setFieldsValue({ instituteId: data.id })
                }
              }}
              iconOnly
              buttonType="dashed"
            />
          </Col>
        </Row>
        
      </Form.Item>

      <Form.Item
      name="addressId"
      label={t(LOCALE_KEYS.ADDRESS)}
      rules={[
        {
          required: true,
          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADDRESS) }),
        },
      ]}
    >
      <Row gutter={8}>
          <Col flex="1">
          <Form.Item name="addressId" noStyle>
            <Select
              options={addresses.map((addr) => ({
                label: addr.name,
                value: addr.id,
              }))}
              placeholder={t(LOCALE_KEYS.SELECT_NAME, {
                name: t(LOCALE_KEYS.ADDRESS),
              })}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>

        <Col>
          <QuickAddDrawerButton
            drawerComponent={AddressFormDrawer}
            drawerProps={{ mode: 'create' }}
            onComplete={(data) => {
              loadAddresses()
              if (data?.id) {
                form.setFieldsValue({ addressId: data.id })
              }
            }}
            iconOnly
            buttonType="dashed"
          />
        </Col>
      </Row>
    </Form.Item>

      <Form.Item
        name="externalInstituteIdNo"
        label={t(LOCALE_KEYS.EXTERNAL_INSTITUTE_ID_NO)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
              name: t(LOCALE_KEYS.EXTERNAL_INSTITUTE_ID_NO),
            }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="campusDirectorUserId"
        label={t(LOCALE_KEYS.CAMPUS_DIRECTOR_USER_ID)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
              name: t(LOCALE_KEYS.CAMPUS_DIRECTOR_USER_ID),
            }),
          },
        ]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.USER) })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.name || user.email}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

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
            aria-label={t(LOCALE_KEYS.CANCEL) + ' button'}
          >
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default BranchForm;
