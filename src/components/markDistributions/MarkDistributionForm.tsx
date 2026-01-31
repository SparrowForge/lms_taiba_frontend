'use client';

import { Button, Col, Form, InputNumber, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import CourseFormDrawer from '@/components/courses/CourseFormDrawer';
import ExamTypeFormDrawer from '@/components/examTypes/ExamTypeFormDrawer';
import FormLayout from '@/components/layout/FormLayout';
import SubjectFormDrawer from '@/components/subjects/SubjectFormDrawer';
import QuickAddDrawerButton from '@/components/ui/QuickAddDrawerButton';
import { StatusSelect } from '@/components/ui/StatusSelect';

import { useCourses } from '@/hooks/useCourses';
import { useExamTypes } from '@/hooks/useExamTypes';
import { useLocalization } from '@/hooks/useLocalization';
import { useMarkDistributions } from '@/hooks/useMarkDistributions';
import { useSubjects } from '@/hooks/useSubjects';

import { getErrorMessage } from '@/types/errors';
import {
  IMarkDistribution,
  IMarkDistributionCreate,
  IMarkDistributionUpdate,
} from '@/types/markDistribution';

interface MarkDistributionFormProps {
  mode: 'create' | 'edit';
  markDistributionId?: number;
  initialValues?: Partial<IMarkDistributionCreate | IMarkDistributionUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const MarkDistributionForm: React.FC<MarkDistributionFormProps> = ({
  mode,
  markDistributionId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MARK_DISTRIBUTION, { defaultValue: 'Mark Distribution' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createMarkDistribution, editMarkDistribution, actionStatus } = useMarkDistributions();
  const { courses, loadCourses } = useCourses();
  const { subjects, loadSubjects, clearSubjects } = useSubjects();
  const { examTypes, loadExamTypes } = useExamTypes();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
    // Load data for dropdowns
    loadCourses({ page: 1, limit: 100 });
    loadExamTypes({ page: 1, limit: 100 });

    // If editing and we have initial values with courseId, load subjects for that course
    if (mode === 'edit' && initialValues?.courseId) {
      loadSubjects({ page: 1, limit: 100, courseId: initialValues.courseId });
    }
  }, [mode, form, loadCourses, loadExamTypes, loadSubjects, initialValues]);

  // Watch for course selection changes to load subjects
  const handleCourseChange = (courseId: number) => {
    if (courseId) {
      // Load subjects for the selected course
      loadSubjects({ page: 1, limit: 100, courseId });
    } else {
      // Clear subjects if no course selected
      clearSubjects();
    }
    // Reset subject selection when course changes
    form.setFieldsValue({ subjectId: undefined });
  };

  const handleSubmit = async (values: Partial<IMarkDistribution>) => {
    try {
      const payload = { ...values };
      if (mode === 'create') {
        await createMarkDistribution(payload as IMarkDistributionCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/mark-distributions');
        }
      } else if (mode === 'edit' && markDistributionId) {
        await editMarkDistribution(markDistributionId, payload as IMarkDistributionUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/mark-distributions/${markDistributionId}`);
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
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_COURSE)}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={courses.map((course) => ({
                value: course.id,
                label: course.name,
              }))}
              onChange={handleCourseChange}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={CourseFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadCourses({ page: 1, limit: 100 });
                if (data?.id) form.setFieldsValue({ courseId: data.id });
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
            name="subjectId"
            label={t(LOCALE_KEYS.SUBJECT)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) }),
              },
            ]}
          >
            <Select
              placeholder={
                form.getFieldValue('courseId')
                  ? t(LOCALE_KEYS.SELECT_SUBJECT)
                  : t(LOCALE_KEYS.PLEASE_SELECT_COURSE_FIRST)
              }
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={subjects.map((subject) => ({
                value: subject.id,
                label: subject.name,
              }))}
              disabled={!form.getFieldValue('courseId')}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={SubjectFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                const courseId = form.getFieldValue('courseId');
                if (courseId) loadSubjects({ page: 1, limit: 100, courseId });
                if (data?.id) form.setFieldsValue({ subjectId: data.id });
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
            name="examTypeId"
            label={t(LOCALE_KEYS.EXAM_TYPE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.EXAM_TYPE) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_EXAM_TYPE)}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={examTypes.map((examType) => ({
                value: examType.id,
                label: examType.name,
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={ExamTypeFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadExamTypes({ page: 1, limit: 100 });
                if (data?.id) form.setFieldsValue({ examTypeId: data.id });
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="weightage"
        label={t(LOCALE_KEYS.WEIGHTAGE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.WEIGHTAGE) }),
          },
          {
            type: 'number',
            min: 0,
            max: 100,
            message: 'Weightage must be between 0 and 100',
          },
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.WEIGHTAGE)}
        />
      </Form.Item>

      <Form.Item
        name="maxMarks"
        label={t(LOCALE_KEYS.MAX_MARKS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MAX_MARKS) }),
          },
          {
            type: 'number',
            min: 0,
            message: 'Max marks must be at least 0',
          },
        ]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder={t(LOCALE_KEYS.MAX_MARKS)} />
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
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default MarkDistributionForm;
