'use client';

import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import FormLayout from '@/components/layout/FormLayout';
import QuickAddRouteButton from '@/components/ui/QuickAddRouteButton';
import { StatusSelect } from '@/components/ui/StatusSelect';

import { useExamResults } from '@/hooks/useExamResults';
import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';
import { useGradeRules } from '@/hooks/useGradeRules';

import { getErrorMessage } from '@/types/errors';
import { IExamResult, IExamResultCreate, IExamResultUpdate } from '@/types/examResult';
import { EXAM_RESULT_STATUS_OPTIONS } from '@/enums/exam-candidate.enum';

interface ExamResultFormProps {
  mode: 'create' | 'edit';
  examResultId?: number;
  initialValues?: Partial<IExamResultCreate | IExamResultUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const ExamResultForm: React.FC<ExamResultFormProps> = ({
  mode,
  examResultId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_RESULT, { defaultValue: 'Exam Result' });
  const router = useRouter();
  const [form] = Form.useForm();

  const { createExamResult, editExamResult, actionStatus } = useExamResults();
  const { exams, loadExams } = useExams();
  const { students, loadStudents } = useStudents();
  const { gradeRules, loadGradeRules } = useGradeRules();

  useEffect(() => {
    loadGradeRules({ page: 1, limit: 99 });
  }, [loadGradeRules]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
    loadExams({ page: 1, limit: 100 });
    loadStudents({ page: 1, limit: 100 });
  }, [mode, form, loadExams, loadStudents]);

  /** ✅ AUTO GRADE RESOLVER */
  const resolveGradeFromMarks = (marks?: number) => {
    if (marks === undefined || marks === null) return;

    const rule = gradeRules?.find(
      (r) =>
        r.status === 'active' &&
        marks >= r.minMarks &&
        marks <= r.maxMarks
    );

    if (rule) {
      form.setFieldsValue({
        grade: rule.grade,
        remarks: rule.remarks,
      });
    } else {
      form.setFieldsValue({
        grade: undefined,
        remarks: undefined,
      });
    }
  };

  const handleSubmit = async (values: Partial<IExamResult>) => {
    try {
      const payload = { ...values };

      if (mode === 'create') {
        await createExamResult(payload as IExamResultCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        onSuccess ? onSuccess() : router.push('/exam-results');
      } else if (mode === 'edit' && examResultId) {
        await editExamResult(examResultId, payload as IExamResultUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        onSuccess ? onSuccess() : router.push(`/exam-results/${examResultId}`);
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
    onCancel ? onCancel() : router.back();
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
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.EXAM) })}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
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
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.STUDENT) })}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={students.map((student) => ({
                value: student.id,
                label: `${student.firstName} ${student.lastName} (${student.registrationNo})`,
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
        name="marksObtained"
        label={t(LOCALE_KEYS.MARKS_OBTAINED)}
        rules={[{ required: true, type: 'number', min: 0 }]}
      >
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          onChange={(value) => resolveGradeFromMarks(value ?? undefined)}
        />
      </Form.Item>

      <Form.Item
        name="grade"
        label={t(LOCALE_KEYS.GRADE)}
        rules={[{ required: true }]}
      >
        <Input readOnly />
      </Form.Item>

      <Form.Item
        name="remarks"
        label={t(LOCALE_KEYS.REMARKS)}
        rules={[{ required: true }]}
      >
        <Input readOnly />
      </Form.Item>

      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[{ required: true }]}
      >
        <StatusSelect options={EXAM_RESULT_STATUS_OPTIONS} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={actionStatus.status === Status.LOADING}
          >
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default ExamResultForm;
