'use client';

import { Button, Card, Col, Form, Input, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useAuth } from '@/hooks/useAuth';
import { useExams } from '@/hooks/useExams';
import { useExamSchedules } from '@/hooks/useExamSchedules';
import { useLocalization } from '@/hooks/useLocalization';
import { useRooms } from '@/hooks/useRooms';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { useWeekDays } from '@/hooks/useWeekDays';

import { getErrorMessage } from '@/types/errors';
import { IExamSchedule, IExamScheduleCreate, IExamScheduleUpdate } from '@/types/examSchedule';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';
import { IExam } from '@/types/exam';


const { Option } = Select;


interface ExamScheduleFormProps {
  mode: 'create' | 'edit';
  examScheduleId?: number;
  initialValues?: Partial<IExamScheduleCreate | IExamScheduleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
  response:IExam;
  setResponse:React.Dispatch<React.SetStateAction<IExamSchedule>>
  setCurrent:React.Dispatch<React.SetStateAction<number>>
    current:number
}

const ExamScheduleFacultyForm: React.FC<ExamScheduleFormProps> = ({
  mode,
  examScheduleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
  response,
  setCurrent,
  current
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SCHEDULE, { defaultValue: 'Exam Schedule' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createExamSchedule, editExamSchedule, actionStatus } = useExamSchedules();
  const { selectedExam, loadExam } = useExams();
  const { selectedRoom, loadRoom } = useRooms();

  const { weekDays, loadWeekDays } = useWeekDays();
  const { timeSlots, loadTimeSlots } = useTimeSlots();
  const {user} = useAuth()

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    if(response){
      loadExam(response.examTypeId);
      loadRoom(response.roomId);
    }
   
    loadWeekDays();
    loadTimeSlots();
  }, [loadExam, loadRoom, loadWeekDays, loadTimeSlots, response]);

  const handleSubmit = async (values: Partial<IExamSchedule>) => {
    try {
      const payload = { 
        ...values, 
        examId:selectedExam?.id,
        roomId:selectedRoom?.id
       };

      if (mode === 'create') {
        await createExamSchedule(payload as IExamScheduleCreate);

        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          setCurrent(current + 1);
        }
      } else if (mode === 'edit' && examScheduleId) {
        await editExamSchedule(examScheduleId, payload as IExamScheduleUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          // router.push(`/exam-schedules/${examScheduleId}`);
          setCurrent(current + 1)
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
     <Card title="Faculty Details" bordered className="shadow-sm" style={{marginBottom:"10px"}}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <strong>Exam:</strong>
          <div>{selectedExam?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Room:</strong>
          <div>{selectedRoom?.name || "—"}</div>
        </Col>


        <Col span={12}>
          <strong>Faculty:</strong>
          <div>{user?.faculty?.fullName || "—"}</div>
        </Col>
       
      </Row>
    </Card>

      <Row gutter={16}>
        
        <Col span={12}>
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
            >
              {weekDays.map((weekDay) => (
                <Option key={weekDay.id} value={weekDay.id}>
                  {weekDay.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
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
            >
              {timeSlots.map((timeSlot) => (
                <Option key={timeSlot.id} value={timeSlot.id}>
                  {timeSlot.name} ({timeSlot.startTime} - {timeSlot.endTime})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

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

export default ExamScheduleFacultyForm;
