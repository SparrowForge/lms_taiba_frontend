'use client';

import {Button, Checkbox, DatePicker, Form, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';


import {LOCALE_KEYS} from '@/constants/localizationKeys';

import StatusSelect from '@/components/ui/StatusSelect';

import { useBatches } from '@/hooks/useBatches';
import {useClassSchedules} from '@/hooks/useClassSchedules';
import { useFaculties } from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';
import { useRooms } from '@/hooks/useRooms';
import { useSemesters } from '@/hooks/useSemesters';
import { useSubjects } from '@/hooks/useSubjects';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { useWeekDays } from '@/hooks/useWeekDays';

import {IClassSchedule, IClassScheduleCreate, IClassScheduleUpdate} from '@/types/classSchedule';
import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';

import FormLayout from '../layout/FormLayout';

interface Props {
  mode: 'create' | 'edit';
  classScheduleId?: number;
  initialValues?: Partial<IClassScheduleCreate | IClassScheduleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const ClassScheduleForm: React.FC<Props> = ({
  mode,
  classScheduleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createClassSchedule, editClassSchedule, actionStatus } = useClassSchedules();
  const { batches, loadBatches } = useBatches();
  const { semesters, loadSemesters } = useSemesters();
  const { subjects, loadSubjects } = useSubjects();
  const { weekDays, loadWeekDays } = useWeekDays();
  const { rooms, loadRooms } = useRooms();
  const { faculties, loadFaculties } = useFaculties();
  const { timeSlots, loadTimeSlots } = useTimeSlots();
  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
    loadSemesters({ page: 1, limit: 100 });
    loadSubjects({ page: 1, limit: 100 });
    loadWeekDays({ page: 1, limit: 100 });
    loadRooms({ page: 1, limit: 100 });
    loadFaculties({ page: 1, limit: 100 });
    loadTimeSlots({ page: 1, limit: 100 });
   
  }, [loadBatches, loadSemesters, loadSubjects, loadWeekDays, loadRooms, loadFaculties, loadTimeSlots]);

  const handleSubmit = async (values: Partial<IClassSchedule>) => {
    try {
      if (mode === 'create') {
        await createClassSchedule(values as IClassScheduleCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/class-schedules');
      } else if (mode === 'edit' && classScheduleId) {
        await editClassSchedule(classScheduleId, values as IClassScheduleUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/class-schedules/${classScheduleId}`);
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) errorMessage = apiError.response.data.message;
      } else {
        errorMessage = getErrorMessage(error);
      }
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
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
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })}>
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
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })}>
          {semesters.map((semester) => (
            <Select.Option key={semester.id} value={semester.id}>
              {semester.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="subjectId"
        label={t(LOCALE_KEYS.SUBJECT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) })}>
          {subjects.map((subject) => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="weekDayId"
        label={t(LOCALE_KEYS.WEEK_DAY)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.WEEK_DAY) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.WEEK_DAY) })}>
          {weekDays.map((weekDay) => (
            <Select.Option key={weekDay.id} value={weekDay.id}>
              {weekDay.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="roomId"
        label={t(LOCALE_KEYS.ROOM)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.ROOM) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ROOM) })}>
          {rooms.map((room) => (
            <Select.Option key={room.id} value={room.id}>
              {room.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="facultyId"
        label={t(LOCALE_KEYS.FACULTY)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}>
          {faculties.map((faculty) => (
            <Select.Option key={faculty.id} value={faculty.id}>
              {faculty.fullName} ({faculty.department?.name})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="timeSlotId"
        label={t(LOCALE_KEYS.TIME_SLOT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.TIME_SLOT) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.TIME_SLOT) })}>
          {timeSlots.map((timeSlot) => (
            <Select.Option key={timeSlot.id} value={timeSlot.id}>
              {timeSlot.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="startDate"
        label={t(LOCALE_KEYS.START_DATE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.START_DATE) }) }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="endDate"
        label={t(LOCALE_KEYS.END_DATE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.END_DATE) }) }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="isRecurring"
        label={t(LOCALE_KEYS.IS_RECURRING)}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        name="classScheduleType"
        label={t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE) }) }]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE) })}>
          <Select.Option value="REGULAR">Regular</Select.Option>
          <Select.Option value="MAKEUP">Makeup</Select.Option>
          <Select.Option value="EXTRA">Extra</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="maxCapacity"
        label={t(LOCALE_KEYS.MAX_CAPACITY)}
        rules={[
          { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.MAX_CAPACITY) }) },
          { type: 'number', min: 1, message: 'Max capacity must be at least 1' }
        ]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.STATUS) }) }]}
      >
        <StatusSelect preset="binary" />
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

  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default ClassScheduleForm;
