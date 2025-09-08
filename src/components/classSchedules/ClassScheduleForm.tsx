'use client';

import {Button, Checkbox, DatePicker, Form, InputNumber, Select, Space} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ENTITY_STATUS_OPTIONS} from '@/constants/statusOptions';
import {Status} from '@/enums';

import {useBatches} from '@/hooks/useBatches';
import {useClassSchedules} from '@/hooks/useClassSchedules';
import {useLocalization} from '@/hooks/useLocalization';
import {useRooms} from '@/hooks/useRooms';
import {useScheduleTypes} from '@/hooks/useScheduleTypes';
import {useSemesters} from '@/hooks/useSemesters';
import {useTimeSlots} from '@/hooks/useTimeSlots';
import {useWeekDays} from '@/hooks/useWeekDays';

import {IClassSchedule, IClassScheduleCreate, IClassScheduleUpdate} from '@/types/classSchedule';
import {getErrorMessage} from '@/types/errors';
import {IFacultyWithSubjectRole} from '@/types/faculty';

import FormLayout from '../layout/FormLayout';
import {StatusSelectFormItem} from '../ui/StatusSelect';

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
  const {
    semesters,
    semesterWithSubjectsAndFaculty,
    loadSemesters,
    loadSemesterWithSubjectsAndFaculty,
    clearSemesters,
  } = useSemesters();

  const { weekDays, loadWeekDays } = useWeekDays();
  const { rooms, loadRooms } = useRooms();

  const { timeSlots, loadTimeSlots } = useTimeSlots();
  const { scheduleTypes, loadScheduleTypes } = useScheduleTypes();

  const [facultyList, setFacultyList] = useState<IFacultyWithSubjectRole[]>([]);

  const selectedBatchId = Form.useWatch('batchId', form);
  const selectedSemesterId = Form.useWatch('semesterId', form);
  const selectedSubjectId = Form.useWatch('subjectId', form);

  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
    clearSemesters();
    loadWeekDays({ page: 1, limit: 100 });
    loadRooms({ page: 1, limit: 100 });
    loadTimeSlots({ page: 1, limit: 100 });
    loadScheduleTypes({ page: 1, limit: 100 });
  }, [loadBatches, loadWeekDays, loadRooms, loadTimeSlots, loadScheduleTypes]);

  useEffect(() => {
    if (selectedBatchId) {
      loadSemesters({ page: 1, limit: 100, batchId: selectedBatchId });
    }
  }, [batches, selectedBatchId, loadSemesters]);

  useEffect(() => {
    if (selectedSemesterId) {
      loadSemesterWithSubjectsAndFaculty(selectedSemesterId);

      const semester = semesters.find((semester) => semester.id === selectedSemesterId);

      form.setFieldsValue({
        startDate: semester?.startDate ? dayjs(semester.startDate) : undefined,
        endDate: semester?.endDate ? dayjs(semester.endDate) : undefined,
      });
    }
  }, [semesters, selectedSemesterId, loadSemesterWithSubjectsAndFaculty]);

  useEffect(() => {
    if (selectedSubjectId) {
      setFacultyList(
        semesterWithSubjectsAndFaculty?.subjects.find((subject) => subject.id === selectedSubjectId)
          ?.faculties ?? [],
      );
    }
  }, [semesterWithSubjectsAndFaculty, selectedSubjectId, setFacultyList]);

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
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) }),
          },
        ]}
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
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) }),
          },
        ]}
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
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) }),
          },
        ]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) })}>
          {semesterWithSubjectsAndFaculty?.subjects.map((subject) => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.name}
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
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}>
          {facultyList.map((faculty) => (
            <Select.Option key={faculty.id} value={faculty.id}>
              {faculty.fullName} ({faculty.role})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

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
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.ROOM) }),
          },
        ]}
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
        name="timeSlotId"
        label={t(LOCALE_KEYS.TIME_SLOT)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.TIME_SLOT) }),
          },
        ]}
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
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.START_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="endDate"
        label={t(LOCALE_KEYS.END_DATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.END_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="isRecurring" label={t(LOCALE_KEYS.IS_RECURRING)} valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item
        name="scheduleTypeId"
        label={t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, {
              name: t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE),
            }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE) })}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {scheduleTypes.map((scheduleType) => (
            <Select.Option key={scheduleType.id} value={scheduleType.id}>
              {scheduleType.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="maxCapacity"
        label={t(LOCALE_KEYS.MAX_CAPACITY)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MAX_CAPACITY) }),
          },
          { type: 'number', min: 1, message: 'Max capacity must be at least 1' },
        ]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
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

export default ClassScheduleForm;
