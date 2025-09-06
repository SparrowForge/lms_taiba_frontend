'use client';

import {Button, Form, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useBatches} from '@/hooks/useBatches';
import {useFaculties} from '@/hooks/useFaculties';
import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';
import {useSubjects} from '@/hooks/useSubjects';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY_SUBJECT, { defaultValue: 'Faculty Subject' });
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
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IFacultySubject>) => {
    try {
      if (mode === 'create') {
        await createFacultySubject(values as IFacultySubjectCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/faculty-subjects');
        }
      } else if (mode === 'edit' && facultySubjectId) {
        await editFacultySubject(facultySubjectId, values as IFacultySubjectUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/faculty-subjects/${facultySubjectId}`);
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
        name="facultyId"
        label={t(LOCALE_KEYS.FACULTY)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FACULTY) }),
          },
        ]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}
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
        label={t(LOCALE_KEYS.SUBJECT)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SUBJECT) }),
          },
        ]}
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
      <Form.Item
        name="semesterId"
        label={t(LOCALE_KEYS.SEMESTER)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SEMESTER) }),
          },
        ]}
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
        name="batchId"
        label={t(LOCALE_KEYS.BATCH)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BATCH) }),
          },
        ]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })}
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
        label={t(LOCALE_KEYS.HOURS_PER_WEEK)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.HOURS_PER_WEEK) }),
          },
        ]}
      >
        <InputNumber min={1} max={40} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="role"
        label={t(LOCALE_KEYS.ROLE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ROLE) }),
          },
        ]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ROLE) })}>
          <Select.Option value="instructor">{t(LOCALE_KEYS.INSTRUCTOR)}</Select.Option>
          <Select.Option value="assistant">{t(LOCALE_KEYS.ASSISTANT)}</Select.Option>
          <Select.Option value="coordinator">{t(LOCALE_KEYS.COORDINATOR)}</Select.Option>
          <Select.Option value="lecturer">{t(LOCALE_KEYS.LECTURER)}</Select.Option>
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
  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default FacultySubjectForm;
