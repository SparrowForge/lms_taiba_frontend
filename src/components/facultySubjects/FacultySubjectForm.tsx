'use client';

import {Button, Form, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {SUBJECT_ROLE_OPTIONS} from '@/constants/subjectRoleOptions';
import {Status} from '@/enums';

import {useBatches} from '@/hooks/useBatches';
import {useFaculties} from '@/hooks/useFaculties';
import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

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
  const { semesterSubjects, loadSemesterSubjects } = useSemesterSubjects();
  const { semesters, loadSemesters } = useSemesters();
  const { batches, loadBatches } = useBatches();
  const [selectedBatchId, setSelectedBatchId] = React.useState<number | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<number | null>(null);

  // Extract subjects from semesterSubjects
  const subjects = React.useMemo(() => {
    return semesterSubjects.map((ss) => ss.subject);
  }, [semesterSubjects]);

  useEffect(() => {
    loadFaculties({ page: 1, limit: 100 });
    loadBatches({ page: 1, limit: 100 });
  }, [loadFaculties, loadBatches]);

  // Load semesters when batch is selected
  useEffect(() => {
    if (selectedBatchId) {
      loadSemesters({ page: 1, limit: 100, batchId: selectedBatchId });
    }
  }, [selectedBatchId, loadSemesters]);

  // Load semester subjects when semester is selected
  useEffect(() => {
    if (selectedSemesterId) {
      loadSemesterSubjects({ page: 1, limit: 100, semesterId: selectedSemesterId });
    }
  }, [selectedSemesterId, loadSemesterSubjects]);

  // Set initial batch and semester if editing
  useEffect(() => {
    if (mode === 'edit' && initialValues?.batchId) {
      setSelectedBatchId(initialValues.batchId);
    }
    if (mode === 'edit' && initialValues?.semesterId) {
      setSelectedSemesterId(initialValues.semesterId);
    }
  }, [mode, initialValues?.batchId, initialValues?.semesterId]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleBatchChange = (batchId: number) => {
    setSelectedBatchId(batchId);
    setSelectedSemesterId(null);
    // Clear semester and subject selection when batch changes
    form.setFieldValue('semesterId', undefined);
    form.setFieldValue('subjectId', undefined);
  };

  const handleSemesterChange = (semesterId: number) => {
    setSelectedSemesterId(semesterId);
    // Clear subject selection when semester changes
    form.setFieldValue('subjectId', undefined);
  };

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
          onChange={handleBatchChange}
        >
          {batches.map((batch) => (
            <Select.Option key={batch.id} value={batch.id}>
              {batch.name}
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
          placeholder={
            selectedBatchId
              ? t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })
              : 'Please select a batch first'
          }
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
          disabled={!selectedBatchId}
          onChange={handleSemesterChange}
        >
          {semesters.map((semester) => (
            <Select.Option key={semester.id} value={semester.id}>
              {semester.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
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
              {faculty.fullName} 
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
          placeholder={
            selectedSemesterId
              ? t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) })
              : 'Please select a semester first'
          }
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
          disabled={!selectedSemesterId}
        >
          {subjects.map((subject) => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.name} 
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
          {SUBJECT_ROLE_OPTIONS.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {t(option.labelKey)}
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
  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default FacultySubjectForm;
