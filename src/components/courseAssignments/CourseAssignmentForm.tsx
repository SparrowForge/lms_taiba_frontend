'use client';

import { Button, DatePicker, Form, Input, InputNumber, Select, Space, Switch } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { ASSIGNMENT_TYPE_OPTIONS } from '@/enums/courseAssignment';
import { EntityType, FileCategory, FileType, Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useCourses } from '@/hooks/useCourses';
import { useFaculties } from '@/hooks/useFaculties';
import { useLocalization } from '@/hooks/useLocalization';
import { useSemesters } from '@/hooks/useSemesters';
import { useSubjects } from '@/hooks/useSubjects';

import {
  ICourseAssignment,
  ICourseAssignmentCreate,
  ICourseAssignmentUpdate,
} from '@/types/courseAssignment';
import { getErrorMessage } from '@/types/errors';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';
import FileUpload from '../ui/FileUpload';

const { TextArea } = Input;

interface CourseAssignmentFormProps {
  mode: 'create' | 'edit';
  courseAssignmentId?: number;
  initialValues?: Partial<ICourseAssignmentCreate | ICourseAssignmentUpdate | ICourseAssignment>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const CourseAssignmentForm: React.FC<CourseAssignmentFormProps> = ({
  mode,
  courseAssignmentId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT, { defaultValue: 'Course Assignment' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createCourseAssignment, editCourseAssignment, actionStatus } = useCourseAssignments();
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

  const handleSubmit = async (values: Partial<ICourseAssignment>) => {
    try {
      if (mode === 'create') {
        await createCourseAssignment(values as ICourseAssignmentCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/course-assignments');
        }
      } else if (mode === 'edit' && courseAssignmentId) {
        await editCourseAssignment(courseAssignmentId, values as ICourseAssignmentUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/course-assignments/${courseAssignmentId}`);
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

  // Submit button text helper
  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  // Form initial values only for edit mode
  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={
        mode === 'edit'
          ? {
              ...initialValues,
              publishDate: initialValues?.publishDate
                ? dayjs(initialValues.publishDate)
                : undefined,
              dueDate: initialValues?.dueDate ? dayjs(initialValues.dueDate) : undefined,
            }
          : undefined
      }
    >
      <Form.Item
        name="courseId"
        label={t(LOCALE_KEYS.COURSE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
          loading={courses.length === 0}
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {courses.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name} ({course.code})
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
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) })}
          loading={subjects.length === 0}
          showSearch
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
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })}
          loading={semesters.length === 0}
          showSearch
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
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })}
          loading={batches.length === 0}
          showSearch
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
        name="facultyId"
        label={t(LOCALE_KEYS.FACULTY)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}
          loading={faculties.length === 0}
          showSearch
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
        <TextArea rows={4} placeholder={t(LOCALE_KEYS.ENTER_DESCRIPTION)} />
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
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.TYPE) })}>
          {ASSIGNMENT_TYPE_OPTIONS.map((option) => (
            <Select.Option key={option.key} value={option.value}>
              {translate(option.labelKey, { defaultValue: option.value })}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="totalMarks"
        label={t(LOCALE_KEYS.TOTAL_MARKS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TOTAL_MARKS) }),
          },
          {
            type: 'number',
            min: 1,
            message: t(LOCALE_KEYS.TOTAL_MARKS) + ' must be at least 1',
          },
        ]}
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.TOTAL_MARKS) })}
        />
      </Form.Item>

      <Form.Item
        name="passMarks"
        label={t(LOCALE_KEYS.PASS_MARKS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PASS_MARKS) }),
          },
          {
            type: 'number',
            min: 0,
            message: t(LOCALE_KEYS.PASS_MARKS) + ' must be at least 0',
          },
        ]}
      >
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.PASS_MARKS) })}
        />
      </Form.Item>

      <Form.Item
        name="maxAttempts"
        label={t(LOCALE_KEYS.MAX_ATTEMPTS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MAX_ATTEMPTS) }),
          },
          {
            type: 'number',
            min: 1,
            message: t(LOCALE_KEYS.MAX_ATTEMPTS) + ' must be at least 1',
          },
        ]}
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.MAX_ATTEMPTS) })}
        />
      </Form.Item>

      <Form.Item
        name="publishDate"
        label={t(LOCALE_KEYS.PUBLISH_DATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PUBLISH_DATE) }),
          },
        ]}
      >
        <DatePicker
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.PUBLISH_DATE) })}
        />
      </Form.Item>

      <Form.Item
        name="dueDate"
        label={t(LOCALE_KEYS.DUE_DATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DUE_DATE) }),
          },
        ]}
      >
        <DatePicker
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.DUE_DATE) })}
        />
      </Form.Item>

      <Form.Item
        name="allowLateSubmit"
        label={t(LOCALE_KEYS.ALLOW_LATE_SUBMIT)}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="latePenalty"
        label={t(LOCALE_KEYS.LATE_PENALTY)}
        dependencies={['allowLateSubmit']}
        rules={[
          {
            validator: (_, value) => {
              const allowLateSubmit = form.getFieldValue('allowLateSubmit');
              if (allowLateSubmit && !value) {
                return Promise.reject(
                  new Error(
                    t(LOCALE_KEYS.LATE_PENALTY) + ' is required when late submission is allowed',
                  ),
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.LATE_PENALTY) })}
          addonAfter="%"
        />
      </Form.Item>

     <Form.Item name="fileId" label={t(LOCALE_KEYS.FILE)}>
        <FileUpload
                fileType={FileType.DOCUMENT}
                fileCategory={FileCategory.ACADEMIC}
                entityType={EntityType.COURSE_MATERIAL}
                entityId={courseAssignmentId}
                accept="*/*"
                maxSize={50}
                allowAllFiles={true}
                />
            </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

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

export default CourseAssignmentForm;
