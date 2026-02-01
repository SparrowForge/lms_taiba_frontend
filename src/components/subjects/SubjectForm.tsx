'use client';

import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useCourses } from '@/hooks/useCourses';
import { useLocalization } from '@/hooks/useLocalization';
import { useSubjects } from '@/hooks/useSubjects';

import { getErrorMessage } from '@/types/errors';
import { ISubject, ISubjectCreate, ISubjectUpdate } from '@/types/subject';

import CourseFormDrawer from '../courses/CourseFormDrawer';
import FormLayout from '../layout/FormLayout';
import LexicalEditor from '../ui/LexicalEditor';
import QuickAddDrawerButton from '../ui/QuickAddDrawerButton';
import { StatusSelectFormItem } from '../ui/StatusSelect';

interface SubjectFormProps {
  mode: 'create' | 'edit';
  subjectId?: number;
  initialValues?: Partial<ISubjectCreate | ISubjectUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  mode,
  subjectId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createSubject, editSubject, actionStatus } = useSubjects();
  const { courses, loadCourses } = useCourses();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
  }, [loadCourses]);

  const handleSubmit = async (values: Partial<ISubject>) => {
    try {
      if (mode === 'create') {
        await createSubject(values as ISubjectCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/subjects');
        }
      } else if (mode === 'edit' && subjectId) {
        await editSubject(subjectId, values as ISubjectUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/subjects/${subjectId}`);
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
            name="courseId"
            label={t(LOCALE_KEYS.COURSE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.COURSE) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_COURSE)}
              loading={courses.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {courses.map((course) => (
                <Select.Option key={course.id} value={course.id}>
                  {course.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={CourseFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadCourses();
                if (data?.id) {
                  form.setFieldsValue({ courseId: data.id });
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
        <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.NAME) })} />
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
        <Input placeholder={t(LOCALE_KEYS.ENTER_CODE)} />
      </Form.Item>

      <Form.Item
        name="creditHours"
        label={t(LOCALE_KEYS.CREDIT_HOURS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CREDIT_HOURS) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_CREDIT_HOURS)} />
      </Form.Item>

      <Form.Item
        name="theoryHours"
        label={t(LOCALE_KEYS.THEORY_HOURS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.THEORY_HOURS) }),
          },
        ]}
      >
        <InputNumber
          placeholder={t(LOCALE_KEYS.ENTER_THEORY_HOURS)}
          min={0}
          max={20}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="practicalHours"
        label={t(LOCALE_KEYS.PRACTICAL_HOURS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PRACTICAL_HOURS) }),
          },
        ]}
      >
        <InputNumber
          placeholder={t(LOCALE_KEYS.ENTER_PRACTICAL_HOURS)}
          min={0}
          max={20}
          style={{ width: '100%' }}
        />
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
        <LexicalEditor />
      </Form.Item>

      <Form.Item name="prerequisite" label={t(LOCALE_KEYS.PREREQUISITE)}>
        <Input />
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <Input.TextArea rows={3} />
      </Form.Item>

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

export default SubjectForm;
