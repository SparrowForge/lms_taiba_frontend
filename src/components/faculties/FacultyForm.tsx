'use client';

import React, {useEffect} from 'react';
import {Button, DatePicker, Form, Input, Select, Space, Switch} from 'antd';
import {useRouter} from 'next/navigation';
import {useFaculties} from '@/hooks/useFaculties';
import {useBranches} from '@/hooks/useBranches';
import {useDepartments} from '@/hooks/useDepartments';
import {IFacultyCreate, IFacultyUpdate} from '@/types/faculty';
import {Status} from '@/types/common';
import {toast} from 'react-toastify';
import {useTranslations} from 'next-intl';
import {getErrorMessage} from '@/types/errors';
import dayjs from 'dayjs';

interface FacultyFormProps {
  mode: 'create' | 'edit';
  facultyId?: number;
  initialValues?: Partial<IFacultyCreate | IFacultyUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const FacultyForm: React.FC<FacultyFormProps> = ({
  mode,
  facultyId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false
}) => {
  const t = useTranslations();
  const entityName = t('faculty');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createFaculty, editFaculty, actionStatus } = useFaculties();
  const { branches, loadBranches } = useBranches();
  const { departments, loadDepartments } = useDepartments();

  useEffect(() => {
    loadBranches({ page: 1, limit: 100 });
    loadDepartments({ page: 1, limit: 100 });
  }, [loadBranches, loadDepartments]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        joinedDate: initialValues.joinedDate ? dayjs(initialValues.joinedDate) : undefined,
      });
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        joinedDate: values.joinedDate ? values.joinedDate.format('YYYY-MM-DD') : undefined,
      };
      if (mode === 'create') {
        await createFaculty(payload as IFacultyCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/faculties');
        }
      } else if (mode === 'edit' && facultyId) {
        await editFaculty(facultyId, payload as IFacultyUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/faculties/${facultyId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', { name: entityName, defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}` });
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
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const getSubmitText = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('update_name', { name: entityName }));

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="branchId"
        label={t('branch')}
        rules={[{ required: true, message: t('required_name', { name: t('branch') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('branch') })}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())}
        >
          {branches.map(branch => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="departmentId"
        label={t('department')}
        rules={[{ required: true, message: t('required_name', { name: t('department') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('department') })}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())}
        >
          {departments.map(department => (
            <Select.Option key={department.id} value={department.id}>
              {department.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="fullName"
        label={t('fullName')}
        rules={[{ required: true, message: t('required_name', { name: t('fullName') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={t('email')}
        rules={[
          { required: true, message: t('required_name', { name: t('email') }) },
          { type: 'email', message: t('pleaseEnterValidEmail') }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="employeeCode"
        label={t('employeeCode')}
        rules={[{ required: true, message: t('required_name', { name: t('employeeCode') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="employmentType"
        label={t('employmentType')}
        rules={[{ required: true, message: t('required_name', { name: t('employmentType') }) }]}
      >
        <Select
          placeholder={t('select_name', { name: t('employmentType') })}
        >
          <Select.Option value="full-time">{t('fullTime')}</Select.Option>
          <Select.Option value="part-time">{t('partTime')}</Select.Option>
          <Select.Option value="visiting">{t('visiting')}</Select.Option>
          <Select.Option value="contract">{t('contract')}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="joinedDate"
        label={t('joinedDate')}
        rules={[{ required: true, message: t('required_name', { name: t('joinedDate') }) }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="isActive"
        label={t('status')}
        valuePropName="checked"
      >
        <Switch checkedChildren={t('active')} unCheckedChildren={t('inactive')} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t('cancel')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
  return embedded ? formContent : (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {formContent}
      </div>
    </div>
  );
};

export default FacultyForm; 