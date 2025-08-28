'use client';

import {Button, DatePicker, Form, Input, Select, Space, Switch} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useBranches} from '@/hooks/useBranches';
import {useDepartments} from '@/hooks/useDepartments';
import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IFaculty, IFacultyCreate, IFacultyUpdate} from '@/types/faculty';

import FormLayout from '../layout/FormLayout';


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
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY, { defaultValue: 'Faculty' });
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
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IFaculty>) => {
    try {
      const payload = {
        ...values,
        joinedDate: values.joinedDate ? dayjs(values.joinedDate).toISOString() : undefined,
      };
      if (mode === 'create') {
        await createFaculty(payload as IFacultyCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/faculties');
        }
      } else if (mode === 'edit' && facultyId) {
        await editFaculty(facultyId, payload as IFacultyUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/faculties/${facultyId}`);
        }
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
      initialValues={mode === 'edit' ? initialValues : undefined}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="branchId"
        label={t(LOCALE_KEYS.BRANCH)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BRANCH) }) }]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BRANCH) })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {branches.map((branch) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="departmentId"
        label={t(LOCALE_KEYS.DEPARTMENT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DEPARTMENT) }) }]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.DEPARTMENT) })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {departments.map((department) => (
            <Select.Option key={department.id} value={department.id}>
              {department.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="fullName"
        label={t(LOCALE_KEYS.FULL_NAME)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FULL_NAME) }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={t(LOCALE_KEYS.EMAIL)}
        rules={[
          { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMAIL) }) },
          { type: 'email', message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_EMAIL) },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="employeeCode"
        label={t(LOCALE_KEYS.EMPLOYEE_CODE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMPLOYEE_CODE) }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="employmentType"
        label={t(LOCALE_KEYS.EMPLOYMENT_TYPE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMPLOYMENT_TYPE) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.EMPLOYMENT_TYPE) })}>
          <Select.Option value="full-time">{t(LOCALE_KEYS.FULL_TIME)}</Select.Option>
          <Select.Option value="part-time">{t(LOCALE_KEYS.PART_TIME)}</Select.Option>
          <Select.Option value="visiting">{t(LOCALE_KEYS.VISITING)}</Select.Option>
          <Select.Option value="contract">{t(LOCALE_KEYS.CONTRACT)}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="joinedDate"
        label={t(LOCALE_KEYS.JOINED_DATE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.JOINED_DATE) }) }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item name="isActive" label={t(LOCALE_KEYS.STATUS)} valuePropName="checked">
        <Switch checkedChildren={t(LOCALE_KEYS.ACTIVE)} unCheckedChildren={t(LOCALE_KEYS.INACTIVE)} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t(LOCALE_KEYS.CANCEL)}
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

export default FacultyForm;
