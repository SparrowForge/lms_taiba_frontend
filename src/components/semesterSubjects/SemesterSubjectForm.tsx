'use client';

import {Button, Form, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {useSemesters} from '@/hooks/useSemesters';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';
import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {ISemesterSubject, ISemesterSubjectCreate, ISemesterSubjectUpdate,} from '@/types/semesterSubject';


interface SemesterSubjectFormProps {
  mode: 'create' | 'edit';
  semesterSubjectId?: number;
  initialValues?: Partial<ISemesterSubjectCreate | ISemesterSubjectUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const SemesterSubjectForm: React.FC<SemesterSubjectFormProps> = ({
  mode,
  semesterSubjectId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('semesterSubject');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createSemesterSubject, editSemesterSubject, actionStatus } = useSemesterSubjects();
  const { semesters, loadSemesters } = useSemesters();
  const { subjects, loadSubjects } = useSubjects();

  useEffect(() => {
    loadSemesters({ page: 1, limit: 100 });
    loadSubjects({ page: 1, limit: 100 });
  }, [loadSemesters, loadSubjects]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<ISemesterSubject>) => {
    try {
      if (mode === 'create') {
        await createSemesterSubject(values as ISemesterSubjectCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/semester-subjects');
        }
      } else if (mode === 'edit' && semesterSubjectId) {
        await editSemesterSubject(semesterSubjectId, values as ISemesterSubjectUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/semester-subjects/${semesterSubjectId}`);
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
      initialValues={initialValues}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="semesterId"
        label={t('semester')}
        rules={[{ required: true, message: t('required_name', { name: t('semester') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('semester') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {semesters.map((semester) => (
            <Select.Option key={semester.id} value={semester.id}>
              {semester.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="subjectId"
        label={t('subject')}
        rules={[{ required: true, message: t('required_name', { name: t('subject') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('subject') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {subjects.map((subject) => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.name} ({subject.code})
            </Select.Option>
          ))}
        </Select>
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
  return embedded ? (
    formContent
  ) : (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {formContent}
      </div>
    </div>
  );
};

export default SemesterSubjectForm;
