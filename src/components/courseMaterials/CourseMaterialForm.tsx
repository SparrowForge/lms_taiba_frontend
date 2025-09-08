'use client';

import {Button, Form, Input, Select, Space, Switch} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ACCESS_LEVEL_TYPE_OPTIONS, EntityType, FileCategory, FileType, MATERIAL_TYPE_OPTIONS, Status,} from '@/enums';

import FileUpload from '@/components/ui/FileUpload';

import {useBatches} from '@/hooks/useBatches';
import {useCourseMaterials} from '@/hooks/useCourseMaterials';
import {useCourses} from '@/hooks/useCourses';
import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';
import {useSubjects} from '@/hooks/useSubjects';

import {ICourseMaterial, ICourseMaterialCreate, ICourseMaterialUpdate,} from '@/types/courseMaterial';
import {getErrorMessage} from '@/types/errors';

import FormLayout from '../layout/FormLayout';
import {StatusSelect} from '../ui/StatusSelect';

const { TextArea } = Input;

interface CourseMaterialFormProps {
  mode: 'create' | 'edit';
  courseMaterialId?: number;
  initialValues?: Partial<ICourseMaterialCreate | ICourseMaterialUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const CourseMaterialForm: React.FC<CourseMaterialFormProps> = ({
  mode,
  courseMaterialId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createCourseMaterial, editCourseMaterial, actionStatus } = useCourseMaterials();
  const { courses, loadCourses } = useCourses();
  const { subjects, loadSubjects } = useSubjects();
  const { semesters, loadSemesters } = useSemesters();
  const { batches, loadBatches } = useBatches();
  const { faculties, loadFaculties } = useFaculties();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
    loadSubjects({ page: 1, limit: 100 });
    loadSemesters({ page: 1, limit: 100 });
    loadBatches({ page: 1, limit: 100 });
    loadFaculties({ page: 1, limit: 100 });
  }, [loadCourses, loadSubjects, loadSemesters, loadBatches, loadFaculties]);

  const handleSubmit = async (values: Partial<ICourseMaterial>) => {
    try {
      if (mode === 'create') {
        await createCourseMaterial(values as ICourseMaterialCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/course-materials');
        }
      } else if (mode === 'edit' && courseMaterialId) {
        await editCourseMaterial(courseMaterialId, values as ICourseMaterialUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/course-materials/${courseMaterialId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        // Use the helper function for other error types
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
      <Form.Item
        name="courseId"
        label={t(LOCALE_KEYS.COURSE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.COURSE) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={courses.map((course) => ({
            value: course.id,
            label: `${course.code} - ${course.name}`,
          }))}
        />
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
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={subjects.map((subject) => ({
            value: subject.id,
            label: `${subject.code} - ${subject.name}`,
          }))}
        />
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
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={semesters.map((semester) => ({
            value: semester.id,
            label: `${semester.name}`,
          }))}
        />
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
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={batches.map((batch) => ({
            value: batch.id,
            label: `${batch.name}`,
          }))}
        />
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
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={faculties.map((faculty) => ({
            value: faculty.id,
            label: `${faculty.employeeCode} - ${faculty.fullName}`,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="title"
        label={t(LOCALE_KEYS.TITLE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TITLE) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.TITLE) })} />
      </Form.Item>

      <Form.Item
        name="description"
        label={t(LOCALE_KEYS.DESCRIPTION)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) }),
          },
        ]}
      >
        <TextArea
          rows={4}
          placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) })}
        />
      </Form.Item>

      <Form.Item
        name="type"
        label={t(LOCALE_KEYS.TYPE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TYPE) }),
          },
        ]}
      >
        <StatusSelect options={MATERIAL_TYPE_OPTIONS} />
      </Form.Item>

      <Form.Item name="fileId" label={t(LOCALE_KEYS.FILE)}>
        <FileUpload
          fileType={FileType.DOCUMENT}
          fileCategory={FileCategory.ACADEMIC}
          entityType={EntityType.COURSE_MATERIAL}
          entityId={courseMaterialId}
          accept="file/*"
          maxSize={50}
        />
      </Form.Item>

      <Form.Item
        name="isDownloadable"
        label={t(LOCALE_KEYS.IS_DOWNLOADABLE)}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="accessLevel"
        label={t(LOCALE_KEYS.ACCESS_LEVEL)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ACCESS_LEVEL) }),
          },
        ]}
      >
        <StatusSelect options={ACCESS_LEVEL_TYPE_OPTIONS} />
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

  if (embedded) {
    return formContent;
  }

  return <FormLayout>{formContent}</FormLayout>;
};

export default CourseMaterialForm;
