'use client';

import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useExams } from '@/hooks/useExams';
import { useExamSchedules } from '@/hooks/useExamSchedules';
import { useFaculties } from '@/hooks/useFaculties';
import { useLocalization } from '@/hooks/useLocalization';
import { useRooms } from '@/hooks/useRooms';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { useWeekDays } from '@/hooks/useWeekDays';

import { getErrorMessage } from '@/types/errors';
import { IExamSchedule, IExamScheduleCreate, IExamScheduleUpdate } from '@/types/examSchedule';

import FormLayout from '../layout/FormLayout';
import QuickAddDrawerButton from '../ui/QuickAddDrawerButton';
import QuickAddRouteButton from '../ui/QuickAddRouteButton';
import { StatusSelectFormItem } from '../ui/StatusSelect';
import FacultyFormDrawer from '../faculties/FacultyFormDrawer';
import RoomFormDrawer from '../rooms/RoomFormDrawer';
import TimeSlotFormDrawer from '../timeSlots/TimeSlotFormDrawer';

const { Option } = Select;
const { TextArea } = Input;

interface ExamScheduleFormProps {
  mode: 'create' | 'edit';
  examScheduleId?: number;
  initialValues?: Partial<IExamScheduleCreate | IExamScheduleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const ExamScheduleForm: React.FC<ExamScheduleFormProps> = ({
  mode,
  examScheduleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SCHEDULE, { defaultValue: 'Exam Schedule' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createExamSchedule, editExamSchedule, actionStatus } = useExamSchedules();
  const { exams, loadExams } = useExams();
  const { rooms, loadRooms } = useRooms();
  const { faculties, loadFaculties } = useFaculties();
  const { weekDays, loadWeekDays } = useWeekDays();
  const { timeSlots, loadTimeSlots } = useTimeSlots();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadExams();
    loadRooms();
    loadFaculties();
    loadWeekDays();
    loadTimeSlots();
  }, [loadExams, loadRooms, loadFaculties, loadWeekDays, loadTimeSlots]);

  const handleSubmit = async (values: Partial<IExamSchedule>) => {
    try {
      const payload = { ...values };

      if (mode === 'create') {
        await createExamSchedule(payload as IExamScheduleCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/exam-schedules');
        }
      } else if (mode === 'edit' && examScheduleId) {
        await editExamSchedule(examScheduleId, payload as IExamScheduleUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/exam-schedules/${examScheduleId}`);
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
      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="examId"
            label={t(LOCALE_KEYS.EXAM)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.EXAM) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.EXAM) })}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {exams.map((exam) => (
                <Option key={exam.id} value={exam.id}>
                  {exam.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddRouteButton route="/exams/create" iconOnly buttonType="dashed" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col flex="1">
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
              style={{ width: '100%' }}
            >
              {rooms.map((room) => (
                <Option key={room.id} value={room.id}>
                  {room.name} (Capacity: {room.examCapacity})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={RoomFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadRooms();
                if (data?.id) form.setFieldsValue({ roomId: data.id });
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col flex="1">
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
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {faculties.map((faculty) => (
                <Option key={faculty.id} value={faculty.id}>
                  {faculty.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={FacultyFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadFaculties();
                if (data?.id) form.setFieldsValue({ facultyId: data.id });
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="weekDayId"
        label={t(LOCALE_KEYS.WEEK_DAY)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.WEEK_DAY) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.WEEK_DAY) })}
          showSearch
          filterOption={(input, option) =>
            String(option?.children || '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          style={{ width: '100%' }}
        >
          {weekDays.map((weekDay) => (
            <Option key={weekDay.id} value={weekDay.id}>
              {weekDay.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="timeSlotId"
            label={t(LOCALE_KEYS.TIME_SLOT)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.TIME_SLOT) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.TIME_SLOT) })}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {timeSlots.map((timeSlot) => (
                <Option key={timeSlot.id} value={timeSlot.id}>
                  {timeSlot.name} ({timeSlot.startTime} - {timeSlot.endTime})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={TimeSlotFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={(data) => {
                loadTimeSlots();
                if (data?.id) form.setFieldsValue({ timeSlotId: data.id });
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
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

export default ExamScheduleForm;
