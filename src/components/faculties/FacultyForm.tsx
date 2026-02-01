'use client';

import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Switch } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useBranches } from '@/hooks/useBranches';
import { useDepartments } from '@/hooks/useDepartments';
import { useEmploymentTypes } from '@/hooks/useEmploymentTypes';
import { useFaculties } from '@/hooks/useFaculties';
import { useLocalization } from '@/hooks/useLocalization';

import { getErrorMessage } from '@/types/errors';
import { IFaculty, IFacultyCreate, IFacultyUpdate } from '@/types/faculty';

import BranchFormDrawer from '../branches/BranchFormDrawer';
import DepartmentFormDrawer from '../departments/DepartmentFormDrawer';
import EmploymentTypeFormDrawer from '../employmentTypes/EmploymentTypeFormDrawer';
import FormLayout from '../layout/FormLayout';
import QuickAddDrawerButton from '../ui/QuickAddDrawerButton';
import { StatusSelect } from '../ui/StatusSelect';





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
  const { loadEmploymentTypes, employmentTypes } = useEmploymentTypes()

  useEffect(() => {
    loadBranches({ page: 1, limit: 100 });
    loadDepartments({ page: 1, limit: 100 });
    loadEmploymentTypes({ page: 1, limit: 100 });
  }, [loadBranches, loadDepartments, loadEmploymentTypes]);

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
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
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
      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="departmentId"
            label={t(LOCALE_KEYS.DEPARTMENT)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DEPARTMENT) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.DEPARTMENT) })}
              loading={departments.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {departments.map((department) => (
                <Select.Option key={department.id} value={department.id}>
                  {department.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={DepartmentFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadDepartments();
                if (data?.id) {
                  form.setFieldsValue({ departmentId: data.id });
                }
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="fullName"
        label={t(LOCALE_KEYS.FULL_NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FULL_NAME) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={t(LOCALE_KEYS.EMAIL)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMAIL) }),
          },
          { type: 'email', message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_EMAIL) },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="employeeCode"
        label={t(LOCALE_KEYS.EMPLOYEE_CODE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMPLOYEE_CODE) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="employmentTypeId"
            label={t(LOCALE_KEYS.EMPLOYMENT_TYPE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMPLOYMENT_TYPE) }),
              },
            ]}
          >
            <Select
              showSearch
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.EMPLOYMENT_TYPE) })}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {employmentTypes.map((employeeType) => (
                <Select.Option key={employeeType.id} value={employeeType.id}>
                  {employeeType.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={EmploymentTypeFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadEmploymentTypes();
                if (data?.id) {
                  form.setFieldsValue({ employmentTypeId: Number(data.id) });
                }
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="joinedDate"
        label={t(LOCALE_KEYS.JOINED_DATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.JOINED_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STATUS) }),
          },
        ]}
      >
        <StatusSelect options={ENTITY_STATUS_OPTIONS} />
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
  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default FacultyForm;
