'use client';

import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useBranches } from '@/hooks/useBranches';
import { useDepartments } from '@/hooks/useDepartments';
import { useFaculties } from '@/hooks/useFaculties';
import { useLocalization } from '@/hooks/useLocalization';

import { IDepartment, IDepartmentCreate, IDepartmentUpdate } from '@/types/department';
import { getErrorMessage } from '@/types/errors';

import FormLayout from '../layout/FormLayout';
import QuickAddDrawerButton from '../ui/QuickAddDrawerButton';
import QuickAddRouteButton from '../ui/QuickAddRouteButton';
import { StatusSelectFormItem } from '../ui/StatusSelect';
import BranchFormDrawer from '../branches/BranchFormDrawer';

interface DepartmentFormProps {
  mode: 'create' | 'edit';
  departmentId?: number;
  initialValues?: Partial<IDepartmentCreate | IDepartmentUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  mode,
  departmentId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DEPARTMENT, { defaultValue: 'Department' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createDepartment, editDepartment, actionStatus } = useDepartments();
  const { branches, loadBranches } = useBranches();
  const { faculties, loadFaculties } = useFaculties();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadFaculties({ page: 1, limit: 100 });
    loadBranches({ page: 1, limit: 100 });
  }, [loadFaculties, loadBranches]);

  const handleSubmit = async (values: Partial<IDepartment>) => {
    try {
      if (mode === 'create') {
        await createDepartment(values as IDepartmentCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/departments');
        }
      } else if (mode === 'edit' && departmentId) {
        await editDepartment(departmentId, values as IDepartmentUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/departments/${departmentId}`);
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
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {branches.map((branch) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch?.name}
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
                loadBranches();
                if (data?.id) {
                  form.setFieldsValue({ branchId: data.id });
                }
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
        name="code"
        label={t(LOCALE_KEYS.CODE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CODE) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.CODE)} />
      </Form.Item>

      <Row gutter={8}>
        <Col flex="1">
          <Form.Item name="headId" label={t(LOCALE_KEYS.HEAD)}>
            <Select
              showSearch
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.HEAD) })}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {faculties.map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddRouteButton route="/faculties" iconOnly buttonType="dashed" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="email"
        label={t(LOCALE_KEYS.EMAIL)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMAIL) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label={t(LOCALE_KEYS.PHONE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PHONE) }),
          },
        ]}
      >
        <Input />
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

export default DepartmentForm;
