'use client';

import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS, LocaleKey } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { EntityType, FileCategory, FileType, Status } from '@/enums';
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
import ExamFacultyDetails from './ExamFacultyDetails';
import { useAuth } from '@/hooks/useAuth';
import FileUpload from '../ui/FileUpload';
import { current } from '@reduxjs/toolkit';
import QuickAddDrawerButton from '../ui/QuickAddDrawerButton';
import ExamTypeFormDrawer from '../examTypes/ExamTypeFormDrawer';

const { Option } = Select;
const { TextArea } = Input;

interface ExamFormProps {
  mode: 'create' | 'edit';
  examId?: number;
  initialValues?: Partial<IExamCreate | IExamUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
  setResponse: React.Dispatch<React.SetStateAction<IExam>>
  setCurrent: React.Dispatch<React.SetStateAction<number>>
  current: number
}

const ExamFormFaculty: React.FC<ExamFormProps> = ({
  mode,
  examId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
  setResponse,
  setCurrent,
  current
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });
  const router = useRouter();
  const [form] = Form.useForm();
  const [isApproved, setIsApproved] = useState(false);
  const { createExam, editExam, actionStatus } = useExams();
  const { selectedCourse, loadCourse } = useCourses();
  const { selectedSubject, loadSubject } = useSubjects();
  const { selectedSemester, loadSemester } = useSemesters();
  const { selectedBatch, loadBatch } = useBatches();
  const { examTypes, loadExamTypes } = useExamTypes();
  const { rooms, loadRooms } = useRooms();
  const { user } = useAuth()
  const searchParams = useSearchParams();
  const semesterId = searchParams.get("semesterId");
  const batchId = searchParams.get("batchId");
  const subjectId = searchParams.get("subjectId");

  useEffect(() => {
    loadSubject(Number(subjectId))
  }, [loadSubject, subjectId])

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadExamTypes();
    loadRooms();
  }, [loadExamTypes, loadRooms]);

  useEffect(() => {
    loadCourse(selectedSubject?.courseId ?? 0)
    loadBatch(Number(batchId))
    loadSemester(Number(semesterId))
  }, [batchId, loadBatch, loadCourse, loadSemester, selectedSubject?.courseId, semesterId])



  useEffect(() => {
    if (initialValues?.isApproved !== undefined) {
      setIsApproved(initialValues.isApproved);
    }

  }, [initialValues]);

  const handleSubmit = async (values: Partial<IExamCreate | IExamUpdate>) => {
    try {
      const payload: any = {
        ...values,
        courseId: selectedSubject?.courseId ?? 0,
        subjectId: Number(subjectId),
        semesterId: Number(semesterId),
        batchId: Number(batchId)
      };


      if (payload.examDatetime && dayjs.isDayjs(payload.examDatetime)) {
        payload.examDatetime = payload.examDatetime.toISOString();
      }


      if (payload.duration && dayjs.isDayjs(payload.duration)) {
        payload.duration = payload.duration.format('HH:mm:ss');
      }

      if (mode === 'create') {
        const res = await createExam(payload as IExamCreate);
        console.log("createExam", res)
        setResponse(res)
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          setCurrent(current + 1)
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
            duration:
              initialValues?.duration && typeof initialValues.duration === 'string'
                ? dayjs(initialValues.duration, 'HH:mm:ss')
                : undefined,
          }
          : undefined
      }
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >


      <ExamFacultyDetails
        semester={selectedSemester}
        batch={selectedBatch}
        course={selectedCourse}
        faculty={user?.faculty ?? null}
        subject={selectedSubject}
      />

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
            name="examTypeId"
            label={t(LOCALE_KEYS.EXAM_TYPE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.EXAM_TYPE) }),
              },
            ]}
          >
            <Row gutter={8} align="middle">
              <Col flex="1">
                <Form.Item name="examTypeId" noStyle>
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

              <Col>
                <QuickAddDrawerButton
                  drawerComponent={ExamTypeFormDrawer}
                  drawerProps={{ mode: 'create' }}
                  onComplete={async (data) => {
                    await loadExamTypes();
                    if (data?.id) {
                      form.setFieldsValue({ examTypeId: data.id });
                    }
                  }}
                  iconOnly
                  buttonType="dashed"
                />
              </Col>
            </Row>
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
        <Col span={12}>
          <Form.Item
            name="duration"
            label={t(LOCALE_KEYS.DURATION)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DURATION) }),
              },
            ]}
            getValueFromEvent={(time) => {
              if (time && dayjs.isDayjs(time)) {
                return time.format('HH:mm:ss');
              }
              return time;
            }}
            getValueProps={(value) => {
              if (typeof value === 'string' && value.match(/^\d{2}:\d{2}:\d{2}$/)) {
                return { value: dayjs(value, 'HH:mm:ss') };
              }
              return { value: undefined };
            }}
          >
            <TimePicker
              placeholder="Select duration"
              format="HH:mm:ss"
              showNow={false}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
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

      <Form.Item name="fileId" label={t(LOCALE_KEYS.FILE)}>
        <FileUpload
          fileType={FileType.DOCUMENT}
          fileCategory={FileCategory.ACADEMIC}
          entityType={EntityType.COURSE_ASSIGNMENT_SUBMISSION}
          entityId={examId}
          accept="*/*"
          maxSize={50}
          allowAllFiles={true}
        />
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

export default ExamFormFaculty;
