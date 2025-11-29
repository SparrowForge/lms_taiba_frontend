'use client';

import { Button, DatePicker, Form, Input, InputNumber, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { EntityType, FileCategory, FileType, Status } from '@/enums';

import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useCourseAssignmentSubmissions } from '@/hooks/useCourseAssignmentSubmissions';
import { useFaculties } from '@/hooks/useFaculties';
import { useFiles } from '@/hooks/useFiles';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import {
  ICourseAssignmentSubmission,
  ICourseAssignmentSubmissionCreate,
  ICourseAssignmentSubmissionUpdate,
} from '@/types/courseAssignmentSubmission';

import FormLayout from '../layout/FormLayout';
import FileUpload from '../ui/FileUpload';
import { StatusSelectFormItem } from '../ui/StatusSelect';

const { TextArea } = Input;

interface CourseAssignmentSubmissionFormProps {
  mode: 'create' | 'edit';
  courseAssignmentSubmissionId?: number;
  initialValues?: Partial<
    | ICourseAssignmentSubmissionCreate
    | ICourseAssignmentSubmissionUpdate
    | ICourseAssignmentSubmission
  >;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const CourseAssignmentSubmissionFormFaculty: React.FC<CourseAssignmentSubmissionFormProps> = ({
  mode,
  courseAssignmentSubmissionId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT_SUBMISSION, {
    defaultValue: 'Course Assignment Submission',
  });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createCourseAssignmentSubmission, editCourseAssignmentSubmission, actionStatus } =
    useCourseAssignmentSubmissions();
  const { courseAssignments, loadCourseAssignments } = useCourseAssignments();
  const { students, loadStudents } = useStudents();
  const { faculties, loadFaculties } = useFaculties();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadCourseAssignments({ page: 1, limit: 100 });
    loadStudents({ page: 1, limit: 100 });
    loadFaculties({ page: 1, limit: 100 });
  }, [loadCourseAssignments, loadStudents, loadFaculties]);

  const handleSubmit = async (values: Partial<ICourseAssignmentSubmission>) => {
    try {
      if (mode === 'create') {
        await createCourseAssignmentSubmission(values as ICourseAssignmentSubmissionCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/course-assignment-submissions');
        }
      } else if (mode === 'edit' && courseAssignmentSubmissionId) {
        await editCourseAssignmentSubmission(
          courseAssignmentSubmissionId,
          values as ICourseAssignmentSubmissionUpdate,
        );
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/course-assignment-submissions/${courseAssignmentSubmissionId}`);
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
      initialValues={
        mode === 'edit' && initialValues
          ? {
              ...initialValues,
              submittedAt: initialValues.submittedAt ? dayjs(initialValues.submittedAt) : undefined,
              gradedAt: initialValues.gradedAt ? dayjs(initialValues.gradedAt) : undefined,
            }
          : undefined
      }
    >
      <Form.Item
        name="assignmentId"
        label={t(LOCALE_KEYS.COURSE_ASSIGNMENT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_ASSIGNMENT)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {courseAssignments.map((assignment) => (
            <Select.Option key={assignment.id} value={assignment.id}>
              {assignment.title} ({assignment.type})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="studentId"
        label={t(LOCALE_KEYS.STUDENT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_STUDENT)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {students.map((student) => (
            <Select.Option key={student.id} value={student.id}>
              {student.firstName} {student.lastName} ({student.applicationNo})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="submittedAt"
        label={t(LOCALE_KEYS.SUBMITTED_AT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.SELECT_SUBMITTED_DATE)}
        />
      </Form.Item>

      <Form.Item name="remark" label={t(LOCALE_KEYS.REMARK)}>
        <TextArea rows={3} placeholder={t(LOCALE_KEYS.ENTER_REMARK)} />
      </Form.Item>

      <Form.Item name="fileId" label={t(LOCALE_KEYS.FILE)}>
        <FileUpload
          fileType={FileType.DOCUMENT}
          fileCategory={FileCategory.ACADEMIC}
          entityType={EntityType.COURSE_ASSIGNMENT_SUBMISSION}
          entityId={courseAssignmentSubmissionId}
          accept="file/*"
          maxSize={50}
        />
      </Form.Item>

      <Form.Item
        name="marksObtained"
        label={t(LOCALE_KEYS.MARKS_OBTAINED)}
        rules={[
          { required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) },
          { type: 'number', min: 0, message: t(LOCALE_KEYS.MARKS_MUST_BE_POSITIVE) },
        ]}
      >
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.ENTER_MARKS_OBTAINED)}
        />
      </Form.Item>

      <Form.Item name="feedback" label={t(LOCALE_KEYS.FEEDBACK)}>
        <TextArea rows={4} placeholder={t(LOCALE_KEYS.ENTER_FEEDBACK)} />
      </Form.Item>

      <Form.Item
        name="gradedBy"
        label={t(LOCALE_KEYS.GRADER)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_GRADER)}
          showSearch
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
        name="gradedAt"
        label={t(LOCALE_KEYS.GRADED_AT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.SELECT_GRADED_DATE)}
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

export default CourseAssignmentSubmissionFormFaculty;
