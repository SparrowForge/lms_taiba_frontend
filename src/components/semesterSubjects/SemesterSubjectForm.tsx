'use client';

import {Button, Form, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';
import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {ISemesterSubject, ISemesterSubjectCreate, ISemesterSubjectUpdate,} from '@/types/semesterSubject';

import FormLayout from '../layout/FormLayout';


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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' });
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
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<ISemesterSubject>) => {
    try {
      if (mode === 'create') {
        await createSemesterSubject(values as ISemesterSubjectCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/semester-subjects');
        }
      } else if (mode === 'edit' && semesterSubjectId) {
        await editSemesterSubject(semesterSubjectId, values as ISemesterSubjectUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/semester-subjects/${semesterSubjectId}`);
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
        name="semesterId"
        label={t(LOCALE_KEYS.SEMESTER)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.SEMESTER) }) }]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })}
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
        label={t(LOCALE_KEYS.SUBJECT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.SUBJECT) }) }]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) })}
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

export default SemesterSubjectForm;
