'use client';

import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import FormLayout from '@/components/layout/FormLayout';
import { StatusSelect } from '@/components/ui/StatusSelect';

import { useExamMCQQuestions } from '@/hooks/useExamMCQQuestions';
import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';

import { getErrorMessage } from '@/types/errors';
import {
  IExamMCQQuestion,
  IExamMCQQuestionCreate,
  IExamMCQQuestionUpdate,
} from '@/types/examMCQQuestion';

interface ExamMCQQuestionFormProps {
  mode: 'create' | 'edit';
  examMCQQuestionId?: number;
  initialValues?: Partial<IExamMCQQuestionCreate | IExamMCQQuestionUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const ExamMCQQuestionForm: React.FC<ExamMCQQuestionFormProps> = ({
  mode,
  examMCQQuestionId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createExamMCQQuestion, editExamMCQQuestion, actionStatus } = useExamMCQQuestions();
  const { exams, loadExams } = useExams();
  const [options, setOptions] = useState<string[]>(['', '', '', '']); // Default 4 options

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
      setOptions(['', '', '', '']);
    } else if (mode === 'edit' && initialValues?.options) {
      setOptions(initialValues.options);
    }
    // Load data for dropdowns
    loadExams({ page: 1, limit: 100 });
  }, [mode, form, loadExams, initialValues]);

  const handleSubmit = async (values: Partial<IExamMCQQuestion>) => {
    try {
      const payload = {
        ...values,
        options: options.filter((option) => option.trim() !== ''), // Remove empty options
      };
      if (mode === 'create') {
        await createExamMCQQuestion(payload as IExamMCQQuestionCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/exam-mcq-questions');
        }
      } else if (mode === 'edit' && examMCQQuestionId) {
        await editExamMCQQuestion(examMCQQuestionId, payload as IExamMCQQuestionUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/exam-mcq-questions/${examMCQQuestionId}`);
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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      // Keep at least 2 options
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
    >
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
        />
      </Form.Item>

      <Form.Item
        name="questionOrder"
        label={t(LOCALE_KEYS.QUESTION_ORDER)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.QUESTION_ORDER) }),
          },
          {
            type: 'number',
            min: 1,
            message: 'Question order must be at least 1',
          },
        ]}
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.QUESTION_ORDER)}
        />
      </Form.Item>

      <Form.Item
        name="questionText"
        label={t(LOCALE_KEYS.QUESTION_TEXT)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.QUESTION_TEXT) }),
          },
        ]}
      >
        <Input.TextArea rows={4} placeholder={t(LOCALE_KEYS.QUESTION_TEXT)} />
      </Form.Item>

      <Form.Item
        name="correctOptionNumber"
        label={t(LOCALE_KEYS.CORRECT_OPTION_NUMBER)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
              name: t(LOCALE_KEYS.CORRECT_OPTION_NUMBER),
            }),
          },
          {
            type: 'number',
            min: 1,
            max: options.length,
            message: `Correct option number must be between 1 and ${options.length}`,
          },
        ]}
      >
        <InputNumber
          min={1}
          max={options.length}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.CORRECT_OPTION_NUMBER)}
        />
      </Form.Item>

      <Form.Item label={t(LOCALE_KEYS.OPTIONS)} required>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button type="text" danger onClick={() => removeOption(index)}>
                  {t(LOCALE_KEYS.REMOVE)}
                </Button>
              )}
            </div>
          ))}
          <Button type="dashed" onClick={addOption} className="w-full">
            {t(LOCALE_KEYS.ADD_OPTION)}
          </Button>
        </div>
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

export default ExamMCQQuestionForm;
