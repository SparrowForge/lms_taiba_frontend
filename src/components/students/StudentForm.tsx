'use client';

import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { STUDENT_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useBranches } from '@/hooks/useBranches';
import { useCourses } from '@/hooks/useCourses';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { getErrorMessage } from '@/types/errors';
import { IStudent, IStudentCreate, IStudentUpdate } from '@/types/student';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';

interface StudentFormProps {
  mode: 'create' | 'edit';
  studentId?: number;
  initialValues?: Partial<IStudent>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({
  mode,
  studentId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createStudent, editStudent, actionStatus } = useStudents();
  const { batches, loadBatches, clearBatches } = useBatches();
  const { branches, loadBranches } = useBranches();
  const { courses, loadCourses } = useCourses();

  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadBranches({ page: 1, limit: 100 });
    loadCourses({ page: 1, limit: 100 });
    clearBatches();
  }, [loadBatches, loadBranches, loadCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      loadBatches({ page: 1, limit: 100, courseId: selectedCourseId });
      form.setFieldsValue({
        batchId: undefined,
      });
    }
  }, [courses, selectedCourseId, loadBatches]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        admission_date: values.admission_date
          ? values.admission_date.format('YYYY-MM-DD')
          : undefined,
      };

      if (mode === 'create') {
        await createStudent(formData as IStudentCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/students');
        }
      } else if (mode === 'edit' && studentId) {
        await editStudent(studentId, formData as IStudentUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/students/${studentId}`);
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
      initialValues={
        mode === 'edit'
          ? {
              ...initialValues,
              admissionDate: initialValues?.admissionDate
                ? dayjs(initialValues.admissionDate)
                : undefined,
            }
          : undefined
      }
      onFinish={handleSubmit}
    >
      <Form.Item
        name="applicationNo"
        label={t(LOCALE_KEYS.APPLICATION_NO, { defaultValue: 'Application No' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.APPLICATION_NO) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="firstName"
            label={t(LOCALE_KEYS.FIRST_NAME, { defaultValue: 'First Name' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FIRST_NAME) }),
              },
            ]}
          >
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.FIRST_NAME) })} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="middleName"
            label={t(LOCALE_KEYS.MIDDLE_NAME, { defaultValue: 'Middle Name' })}
          >
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.MIDDLE_NAME) })} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="lastName"
            label={t(LOCALE_KEYS.LAST_NAME, { defaultValue: 'Last Name' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.LAST_NAME) }),
              },
            ]}
          >
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.LAST_NAME) })} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="cardNo"
        label={t(LOCALE_KEYS.CARD_NO, { defaultValue: 'Card No' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CARD_NO) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="registrationNo"
        label={t(LOCALE_KEYS.REGISTRATION_NO, { defaultValue: 'Registration No' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.REGISTRATION_NO) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="admissionDate"
        label={t(LOCALE_KEYS.ADMISSION_DATE, { defaultValue: 'Admission Date' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADMISSION_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="courseId"
        label={t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.COURSE) }),
          },
        ]}
      >
        <Select
          onChange={(value) => {
            setSelectedCourseId(value);
            form.setFieldsValue({ batchId: undefined });
          }}
          placeholder={t('select_course', { defaultValue: 'Select Course' })}
          options={courses.map((course) => ({
            label: course.name,
            value: course.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="batchId"
        label={t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BATCH) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_BATCH, { defaultValue: 'Select Batch' })}
          options={batches.map((batch) => ({
            label: batch.name,
            value: batch.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="branchId"
        label={t(LOCALE_KEYS.BRANCH, { defaultValue: 'Branch' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BRANCH) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_BRANCH, { defaultValue: 'Select Branch' })}
          options={branches.map((branch) => ({
            label: branch.name,
            value: branch.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="referenceNo"
        label={t(LOCALE_KEYS.REFERENCE_NO, { defaultValue: 'Reference No' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.REFERENCE_NO) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="admissionSource"
        label={t(LOCALE_KEYS.ADMISSION_SOURCE, { defaultValue: 'Admission Source' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADMISSION_SOURCE) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <StatusSelectFormItem options={STUDENT_STATUS_OPTIONS} />
      <Form.Item>
        <div className="flex justify-end space-x-2 gap-2">
          <Button onClick={handleCancel}>
            {t(LOCALE_KEYS.CANCEL, { defaultValue: 'Cancel' })}
          </Button>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );

  if (embedded) {
    return formContent;
  }

  return <FormLayout>{formContent}</FormLayout>;
};

export default StudentForm;
