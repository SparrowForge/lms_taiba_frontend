'use client';

import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { COURSE_ASSIGNMENT_SUBMISSION_STATUS_OPTIONS, ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
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
import { useAuth } from '@/hooks/useAuth';

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

const CourseAssignmentSubmissionFormByStudent: React.FC<CourseAssignmentSubmissionFormProps> = ({
  mode,
  courseAssignmentSubmissionId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
const {user} = useAuth()
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT_SUBMISSION, {
    defaultValue: 'Course Assignment Submission',
  });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createCourseAssignmentSubmission, editCourseAssignmentSubmission, actionStatus } =
    useCourseAssignmentSubmissions();
  const {loadCourseAssignment, selectedCourseAssignment} = useCourseAssignments()

  const { faculties, loadFaculties } = useFaculties();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadFaculties({ page: 1, limit: 100 });
    if(courseAssignmentSubmissionId){
        loadCourseAssignment(courseAssignmentSubmissionId)
    }
  }, [ loadFaculties, loadCourseAssignment,courseAssignmentSubmissionId]);

  const handleSubmit = async (values: Partial<ICourseAssignmentSubmission>) => {
    const mValues ={
        ...values,
        // submittedAt:dayjs().format("YYYY-MM-DD HH:mm:ss"),
        assignmentId:courseAssignmentSubmissionId,
        studentId: user?.student.id
    }
    try {
      if (mode === 'create') {
        await createCourseAssignmentSubmission(mValues as ICourseAssignmentSubmissionCreate);
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
      
      <Card title="Assignment Details">
        <Row gutter={[16, 16]}>
            <Col span={12}>
              <strong>Assignment:</strong>
              <div>{selectedCourseAssignment?.title || "—"}</div>
            </Col>

            <Col span={12}>
              <strong>Course:</strong>
              <div>{selectedCourseAssignment?.course.name || "—"}</div>
            </Col>

            <Col span={12}>
              <strong>Course:</strong>
              <div>{selectedCourseAssignment?.subject.name || "—"}</div>
            </Col>

            <Col span={12}>
              <strong>Course:</strong>
              <div>{selectedCourseAssignment?.batch.name || "—"}</div>
            </Col>

            <Col span={12}>
              <strong>Course:</strong>
              <div>{selectedCourseAssignment?.semester.name || "—"}</div>
            </Col>

             <Col span={12}>
              <strong>Course:</strong>
              <div>{selectedCourseAssignment?.faculty.fullName || "—"}</div>
            </Col>
        </Row>
      </Card>


      

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


      <StatusSelectFormItem options={COURSE_ASSIGNMENT_SUBMISSION_STATUS_OPTIONS} />

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

export default CourseAssignmentSubmissionFormByStudent;
