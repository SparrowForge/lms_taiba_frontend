'use client';

import {Button, Form, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {useBatches} from '@/hooks/useBatches';
import {useFaculties} from '@/hooks/useFaculties';
import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {useSemesters} from '@/hooks/useSemesters';
import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IFacultySubject, IFacultySubjectCreate, IFacultySubjectUpdate,} from '@/types/facultySubject';
import FormLayout from '../layout/FormLayout';


interface FacultySubjectFormProps {
  mode: 'create' | 'edit';
  facultySubjectId?: number;
  initialValues?: Partial<IFacultySubjectCreate | IFacultySubjectUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const FacultySubjectForm: React.FC<FacultySubjectFormProps> = ({
  mode,
  facultySubjectId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('facultySubject');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createFacultySubject, editFacultySubject, actionStatus } = useFacultySubjects();
  const { faculties, loadFaculties } = useFaculties();
  const { subjects, loadSubjects } = useSubjects();
  const { semesters, loadSemesters } = useSemesters();
  const { batches, loadBatches } = useBatches();

  useEffect(() => {
    loadFaculties({ page: 1, limit: 100 });
    loadSubjects({ page: 1, limit: 100 });
    loadSemesters({ page: 1, limit: 100 });
    loadBatches({ page: 1, limit: 100 });
  }, [loadFaculties, loadSubjects, loadSemesters, loadBatches]);

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

  const handleSubmit = async (values: Partial<IFacultySubject>) => {
    try {
      if (mode === 'create') {
        await createFacultySubject(values as IFacultySubjectCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/faculty-subjects');
        }
      } else if (mode === 'edit' && facultySubjectId) {
        await editFacultySubject(facultySubjectId, values as IFacultySubjectUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/faculty-subjects/${facultySubjectId}`);
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
        name="facultyId"
        label={t('faculty')}
        rules={[{ required: true, message: t('required_name', { name: t('faculty') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('faculty') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {faculties.map((faculty) => (
            <Select.Option key={faculty.id} value={faculty.id}>
              {faculty.fullName} ({faculty.employeeCode})
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
        name="batchId"
        label={t('batch')}
        rules={[{ required: true, message: t('required_name', { name: t('batch') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('batch') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {batches.map((batch) => (
            <Select.Option key={batch.id} value={batch.id}>
              {batch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="hoursPerWeek"
        label={t('hoursPerWeek')}
        rules={[{ required: true, message: t('required_name', { name: t('hoursPerWeek') }) }]}
      >
        <InputNumber min={1} max={40} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="role"
        label={t('role')}
        rules={[{ required: true, message: t('required_name', { name: t('role') }) }]}
      >
        <Select placeholder={t('select_name', { name: t('role') })}>
          <Select.Option value="instructor">{t('instructor')}</Select.Option>
          <Select.Option value="assistant">{t('assistant')}</Select.Option>
          <Select.Option value="coordinator">{t('coordinator')}</Select.Option>
          <Select.Option value="lecturer">{t('lecturer')}</Select.Option>
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
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default FacultySubjectForm;
