'use client';

import {
  Button,
  Form,
  Input,
  Space,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Row,
  Col,
} from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS, LocaleKey } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';
import { QUESTION_TYPE_OPTIONS } from '@/enums/question-type.enum';
import { SECURITY_TYPE_OPTIONS } from '@/enums/security-type.enum';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useExams } from '@/hooks/useExams';
import { useExamTypes } from '@/hooks/useExamTypes';
import { useLocalization } from '@/hooks/useLocalization';
import { useRooms } from '@/hooks/useRooms';
import { useSemesters } from '@/hooks/useSemesters';
import { useSubjects } from '@/hooks/useSubjects';

import { getErrorMessage } from '@/types/errors';
import { IExam, IExamCreate, IExamUpdate } from '@/types/exam';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';


const { Option } = Select;
const { TextArea } = Input;

interface ExamFormProps {
  mode: 'create' | 'edit';
  examId?: number;
  initialValues?: Partial<IExamCreate | IExamUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const ExamForm: React.FC<ExamFormProps> = ({
  mode,
  examId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });
  const router = useRouter();
  const [form] = Form.useForm();
  const [isApproved, setIsApproved] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { createExam, editExam, actionStatus } = useExams();
  const { courses, loadCourses } = useCourses();
  const { subjects, loadSubjects } = useSubjects();
  const { semesters, loadSemesters } = useSemesters();
  const { batches, loadBatches } = useBatches();
  const { examTypes, loadExamTypes } = useExamTypes();
  const { rooms, loadRooms } = useRooms();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadCourses();
    loadSubjects();
    loadSemesters();
    loadBatches();
    loadExamTypes();
    loadRooms();
  }, [loadCourses, loadSubjects, loadSemesters, loadBatches, loadExamTypes, loadRooms]);

  // Handle course selection and load dependent data
  const handleCourseChange = async (courseId: number) => {
    setSelectedCourseId(courseId);

    // Reset dependent fields
    form.setFieldsValue({
      subjectId: undefined,
      semesterId: undefined,
      batchId: undefined,
    });

    // Load subjects for the selected course
    try {
      await loadSubjects({
        page: 1,
        limit: 100,
        courseId: courseId,
      });
    } catch (error) {
      console.error('Failed to load subjects for course:', error);
    }

    // Load all semesters (will be filtered client-side)
    try {
      await loadSemesters({
        page: 1,
        limit: 1000,
      });
    } catch (error) {
      console.error('Failed to load semesters:', error);
    }

    // Load batches for the selected course
    try {
      await loadBatches({
        page: 1,
        limit: 100,
        courseId: courseId,
      });
    } catch (error) {
      console.error('Failed to load batches for course:', error);
    }
  };

  // Get filtered subjects by course
  const getFilteredSubjects = () => {
    if (!selectedCourseId) {
      return [];
    }
    return subjects.filter((subject) => subject.courseId === selectedCourseId);
  };

  // Get filtered semesters by course (through batch)
  const getFilteredSemesters = () => {
    if (!selectedCourseId) {
      return [];
    }
    return semesters.filter((semester) => semester.batch?.courseId === selectedCourseId);
  };

  // Get filtered batches by course
  const getFilteredBatches = () => {
    if (!selectedCourseId) {
      return [];
    }
    return batches.filter((batch) => batch.courseId === selectedCourseId);
  };

  useEffect(() => {
    if (initialValues?.isApproved !== undefined) {
      setIsApproved(initialValues.isApproved);
    }

    // Set selected course ID for edit mode
    if (initialValues?.courseId) {
      setSelectedCourseId(initialValues.courseId);
    }
  }, [initialValues]);

  const handleSubmit = async (values: Partial<IExam>) => {
    try {
      const payload = { ...values };

      // Convert dayjs object back to ISO string for API
      if (payload.examDatetime && dayjs.isDayjs(payload.examDatetime)) {
        payload.examDatetime = payload.examDatetime.toISOString();
      }

      if (mode === 'create') {
        await createExam(payload as IExamCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/exams');
        }
      } else if (mode === 'edit' && examId) {
        await editExam(examId, payload as IExamUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/exams/${examId}`);
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
      initialValues={
        mode === 'edit'
          ? {
              ...initialValues,
              examDatetime: initialValues?.examDatetime
                ? dayjs(initialValues.examDatetime)
                : undefined,
            }
          : undefined
      }
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
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
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={handleCourseChange}
            >
              {courses.map((course) => (
                <Option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
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
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              disabled={!selectedCourseId}
            >
              {getFilteredSubjects().map((subject) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
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
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              disabled={!selectedCourseId}
            >
              {getFilteredSemesters().map((semester) => (
                <Option key={semester.id} value={semester.id}>
                  {semester.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
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
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              disabled={!selectedCourseId}
            >
              {getFilteredBatches().map((batch) => (
                <Option key={batch.id} value={batch.id}>
                  {batch.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="examTypeId"
            label={t(LOCALE_KEYS.EXAM_TYPE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.EXAM_TYPE) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.EXAM_TYPE) })}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {examTypes.map((examType) => (
                <Option key={examType.id} value={examType.id}>
                  {examType.name} ({examType.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="roomId"
            label={t(LOCALE_KEYS.ROOM)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.ROOM) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ROOM) })}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {rooms.map((room) => (
                <Option key={room.id} value={room.id}>
                  {room.name} (Capacity: {room.examCapacity})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="marks"
            label={t(LOCALE_KEYS.MARKS)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MARKS) }),
              },
            ]}
          >
            <InputNumber
              placeholder={t(LOCALE_KEYS.MARKS)}
              min={1}
              max={1000}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="examDatetime"
            label={t(LOCALE_KEYS.EXAM_DATETIME)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.EXAM_DATETIME) }),
              },
            ]}
          >
            <DatePicker
              placeholder={t(LOCALE_KEYS.EXAM_DATETIME)}
              showTime
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name={['duration', 'hours']}
            label={t(LOCALE_KEYS.HOURS)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.HOURS) }),
              },
            ]}
          >
            <InputNumber
              placeholder={t(LOCALE_KEYS.HOURS)}
              min={0}
              max={24}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name={['duration', 'minutes']}
            label={t(LOCALE_KEYS.MINUTES)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MINUTES) }),
              },
            ]}
          >
            <InputNumber
              placeholder={t(LOCALE_KEYS.MINUTES)}
              min={0}
              max={59}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="questionType"
            label={t(LOCALE_KEYS.QUESTION_TYPE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.QUESTION_TYPE) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.QUESTION_TYPE) })}
            >
              {QUESTION_TYPE_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {t(option.labelKey as LocaleKey)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="questionsCount"
            label={t(LOCALE_KEYS.QUESTIONS_COUNT)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.QUESTIONS_COUNT) }),
              },
            ]}
          >
            <InputNumber
              placeholder={t(LOCALE_KEYS.QUESTIONS_COUNT)}
              min={1}
              max={1000}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="optionsPerQuestion"
            label={t(LOCALE_KEYS.OPTIONS_PER_QUESTION)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.OPTIONS_PER_QUESTION),
                }),
              },
            ]}
          >
            <InputNumber
              placeholder={t(LOCALE_KEYS.OPTIONS_PER_QUESTION)}
              min={2}
              max={10}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="totalStudent" label={t(LOCALE_KEYS.TOTAL_STUDENT)}>
        <InputNumber
          placeholder={t(LOCALE_KEYS.TOTAL_STUDENT)}
          min={0}
          max={10000}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item name="isApproved" label={t(LOCALE_KEYS.IS_APPROVED)} valuePropName="checked">
        <Switch checked={isApproved} onChange={setIsApproved} />
      </Form.Item>

      <Form.Item name="attachmentPath" label={t(LOCALE_KEYS.ATTACHMENT_PATH)}>
        <Input />
      </Form.Item>

      <Form.Item name="examQuestion" label={t(LOCALE_KEYS.EXAM_QUESTION)}>
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item name="securityType" label={t(LOCALE_KEYS.SECURITY_TYPE)}>
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SECURITY_TYPE) })}
          allowClear
        >
          {SECURITY_TYPE_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {t(option.labelKey as LocaleKey)}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="spelling" label={t(LOCALE_KEYS.SPELLING)}>
        <Input />
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

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

export default ExamForm;
