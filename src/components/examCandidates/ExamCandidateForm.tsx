'use client';

import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import FormLayout from '@/components/layout/FormLayout';
import QuickAddRouteButton from '@/components/ui/QuickAddRouteButton';
import { StatusSelect } from '@/components/ui/StatusSelect';

import { useExamCandidates } from '@/hooks/useExamCandidates';
import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { getErrorMessage } from '@/types/errors';
import { IExamCandidate, IExamCandidateCreate, IExamCandidateUpdate } from '@/types/examCandidate';

interface ExamCandidateFormProps {
  mode: 'create' | 'edit';
  examCandidateId?: number;
  initialValues?: Partial<IExamCandidateCreate | IExamCandidateUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const ExamCandidateForm: React.FC<ExamCandidateFormProps> = ({
  mode,
  examCandidateId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_CANDIDATE, { defaultValue: 'Exam Candidate' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createExamCandidate, editExamCandidate, actionStatus } = useExamCandidates();
  const { exams, loadExams } = useExams();
  const { students, loadStudents } = useStudents();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
    // Load data for dropdowns
    loadExams({ page: 1, limit: 100 });
    loadStudents({ page: 1, limit: 100 });
  }, [mode, form, loadExams, loadStudents]);

  const handleSubmit = async (values: Partial<IExamCandidate>) => {
    try {
      const payload = { ...values };
      if (mode === 'create') {
        await createExamCandidate(payload as IExamCandidateCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/exam-candidates');
        }
      } else if (mode === 'edit' && examCandidateId) {
        await editExamCandidate(examCandidateId, payload as IExamCandidateUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/exam-candidates/${examCandidateId}`);
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
            name="examId"
            label={t(LOCALE_KEYS.EXAM)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.EXAM) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_EXAM)}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={exams.map((exam) => ({
                value: exam.id,
                label: exam.name,
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddRouteButton route="/exams/create" iconOnly buttonType="dashed" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="studentId"
            label={t(LOCALE_KEYS.STUDENT)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.STUDENT) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_STUDENT)}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={students.map((student) => ({
                value: student.id,
                label: `${student.name} (${student.registrationNo})`,
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddRouteButton route="/students" iconOnly buttonType="dashed" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="rollNo"
        label={t(LOCALE_KEYS.ROLL_NO)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ROLL_NO) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.ROLL_NO)} />
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

export default ExamCandidateForm;
