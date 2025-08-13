'use client';

import {Button, DatePicker, Form, Input, Select} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {useBatches} from '@/hooks/useBatches';
import {useBranches} from '@/hooks/useBranches';
import {useCourses} from '@/hooks/useCourses';
import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IStudent, IStudentCreate, IStudentUpdate} from '@/types/student';

import FormLayout from '../layout/FormLayout';


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
  const t = useTranslations();
  const entityName = t('student');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createStudent, editStudent, actionStatus } = useStudents();
  const { batches, loadBatches } = useBatches();
  const { branches, loadBranches } = useBranches();
  const { courses, loadCourses } = useCourses();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
    loadBranches({ page: 1, limit: 100 });
    loadCourses({ page: 1, limit: 100 });
  }, [loadBatches, loadBranches, loadCourses]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        admission_date: values.admission_date ? values.admission_date.format('YYYY-MM-DD') : undefined,
      };

      if (mode === 'create') {
        await createStudent(formData as IStudentCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/students');
        }
      } else if (mode === 'edit' && studentId) {
        await editStudent(studentId, formData as IStudentUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/students/${studentId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
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
      ? t('create_name', { name: entityName })
      : t('update_name', { name: entityName });

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={mode === 'edit' ? {
        ...initialValues,
        admissionDate: initialValues?.admissionDate ? dayjs(initialValues.admissionDate) : undefined,
      } : undefined}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="applicationNo"
        label={t('application_no', { defaultValue: 'Application No' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label={t('name', { defaultValue: 'Name' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="cardNo"
        label={t('card_no', { defaultValue: 'Card No' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="registrationNo"
        label={t('registration_no', { defaultValue: 'Registration No' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="admissionDate"
        label={t('admission_date', { defaultValue: 'Admission Date' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="courseId"
        label={t('course', { defaultValue: 'Course' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Select
          placeholder={t('select_course', { defaultValue: 'Select Course' })}
          options={courses.map((course) => ({
            label: course.name,
            value: course.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="batchId"
        label={t('batch', { defaultValue: 'Batch' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Select
          placeholder={t('select_batch', { defaultValue: 'Select Batch' })}
          options={batches.map((batch) => ({
            label: batch.name,
            value: batch.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="branchId"
        label={t('branch', { defaultValue: 'Branch' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Select
          placeholder={t('select_branch', { defaultValue: 'Select Branch' })}
          options={branches.map((branch) => ({
            label: branch.name,
            value: branch.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="referenceNo"
        label={t('reference_no', { defaultValue: 'Reference No' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="admissionSource"
        label={t('admission_source', { defaultValue: 'Admission Source' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="status"
        label={t('status', { defaultValue: 'Status' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Select
          placeholder={t('select_status', { defaultValue: 'Select Status' })}
          options={[
            { label: t('active', { defaultValue: 'Active' }), value: 'active' },
            { label: t('inactive', { defaultValue: 'Inactive' }), value: 'inactive' },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-end space-x-2">
          <Button onClick={handleCancel}>
            {t('cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={actionStatus.status === Status.LOADING}
          >
            {getSubmitText()}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default StudentForm;
