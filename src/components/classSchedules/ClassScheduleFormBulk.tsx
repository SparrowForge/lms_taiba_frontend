'use client';

import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Card, Checkbox, DatePicker, Divider, Form, InputNumber, Select, Space, Typography,} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useBatches} from '@/hooks/useBatches';
import {useClassSchedules} from '@/hooks/useClassSchedules';
import {useLocalization} from '@/hooks/useLocalization';
import {useRooms} from '@/hooks/useRooms';
import {useScheduleTypes} from '@/hooks/useScheduleTypes';
import {useSemesters} from '@/hooks/useSemesters';
import {useTimeSlots} from '@/hooks/useTimeSlots';
import {useWeekDays} from '@/hooks/useWeekDays';

import {IFacultyWithSubjectRole} from '@/types/faculty';

const { Title } = Typography;

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const ClassScheduleFormBulk: React.FC<Props> = ({ onSuccess, onCancel, embedded = false }) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createBulkClassSchedule, actionStatus } = useClassSchedules();

  // Hooks for data loading
  const { batches, loadBatches } = useBatches();
  const {
    semesters,
    loadSemesters,
    clearSemesters,
    semesterWithSubjectsAndFaculty,
    loadSemesterWithSubjectsAndFaculty,
  } = useSemesters();
  const { weekDays, loadWeekDays } = useWeekDays();
  const { rooms, loadRooms } = useRooms();
  const { timeSlots, loadTimeSlots } = useTimeSlots();
  const { scheduleTypes, loadScheduleTypes } = useScheduleTypes();

  // Watch form fields for cascading dropdowns
  const selectedBatchId = Form.useWatch('batchId', form);
  const selectedSemesterId = Form.useWatch('semesterId', form);
  const selectedSubjectId = Form.useWatch('subjectId', form);
  const schedules = Form.useWatch('schedules', form) || [];

  // State for faculty list
  const [facultyList, setFacultyList] = useState<IFacultyWithSubjectRole[]>([]);

  // Extract subjects from semesterWithSubjectsAndFaculty
  const subjects = useMemo(() => {
    return semesterWithSubjectsAndFaculty?.subjects ?? [];
  }, [semesterWithSubjectsAndFaculty]);

  // Generate all class instances from schedules
  const generateClassInstances = useMemo(() => {
    if (!schedules || schedules.length === 0) return [];

    const instances: any[] = [];

    schedules.forEach((schedule: any, index: number) => {
      if (!schedule.weekDayId || !schedule.startDate || !schedule.endDate) return;

      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);

      // Find the week day info
      const weekDay = weekDays.find((wd) => wd.id === schedule.weekDayId);
      if (!weekDay) return;

      if (schedule.isRecurring) {
        // Generate all occurrences for the week day between start and end dates
        let currentDate = startDate.clone();

        // Find the first occurrence of the target week day
        // dayNumber: 0 = Sunday, 1 = Monday, etc.
        const targetDayOfWeek = weekDay.dayNumber;
        while (currentDate.day() !== targetDayOfWeek && currentDate.isBefore(endDate)) {
          currentDate = currentDate.add(1, 'day');
        }

        // Generate all weekly occurrences
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
          instances.push({
            scheduleIndex: index,
            date: currentDate.clone(),
            weekDay: weekDay,
            facultyId: schedule.facultyId,
            roomId: schedule.roomId,
            timeSlotId: schedule.timeSlotId,
            scheduleTypeId: schedule.scheduleTypeId,
            isRecurring: true,
          });
          currentDate = currentDate.add(7, 'days');
        }
      } else {
        // Non-recurring: just one instance
        instances.push({
          scheduleIndex: index,
          date: startDate.clone(),
          weekDay: weekDay,
          facultyId: schedule.facultyId,
          roomId: schedule.roomId,
          timeSlotId: schedule.timeSlotId,
          scheduleTypeId: schedule.scheduleTypeId,
          isRecurring: false,
        });
      }
    });

    // Sort by date
    return instances.sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }, [schedules, weekDays]);

  // Load initial data
  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
    clearSemesters();
    loadWeekDays({ page: 1, limit: 100 });
    loadRooms({ page: 1, limit: 100 });
    loadTimeSlots({ page: 1, limit: 100 });
    loadScheduleTypes({ page: 1, limit: 100 });
  }, [loadBatches, clearSemesters, loadWeekDays, loadRooms, loadTimeSlots, loadScheduleTypes]);

  // Load semesters when batch is selected
  useEffect(() => {
    if (selectedBatchId) {
      loadSemesters({ page: 1, limit: 100, batchId: selectedBatchId });
    }
  }, [selectedBatchId, loadSemesters]);

  // Load semester with subjects/faculty when semester is selected
  useEffect(() => {
    if (selectedSemesterId) {
      loadSemesterWithSubjectsAndFaculty(selectedSemesterId);
    }
  }, [selectedSemesterId, loadSemesterWithSubjectsAndFaculty]);

  // Load faculty list when subject is selected
  useEffect(() => {
    if (selectedSubjectId && semesterWithSubjectsAndFaculty) {
      const subjectFaculties =
        semesterWithSubjectsAndFaculty.subjects.find((subject) => subject.id === selectedSubjectId)
          ?.faculties ?? [];
      setFacultyList(subjectFaculties);
    }
  }, [selectedSubjectId, semesterWithSubjectsAndFaculty]);

  // Auto-set start and end dates from semester when semester is selected
  useEffect(() => {
    if (selectedSemesterId) {
      const selectedSemester = semesters.find((s) => s.id === selectedSemesterId);
      if (selectedSemester) {
        const schedules = form.getFieldValue('schedules') || [];
        const updatedSchedules = schedules.map((schedule: any) => ({
          ...schedule,
          startDate: selectedSemester.startDate ? dayjs(selectedSemester.startDate) : undefined,
          endDate: selectedSemester.endDate ? dayjs(selectedSemester.endDate) : undefined,
          isRecurring: schedule.isRecurring !== undefined ? schedule.isRecurring : true,
        }));
        form.setFieldsValue({ schedules: updatedSchedules });
      }
    }
  }, [selectedSemesterId, semesters, form]);

  // Handle batch change
  const handleBatchChange = (value: number) => {
    form.setFieldsValue({
      batchId: value,
      semesterId: undefined,
      subjectId: undefined,
    });
  };

  // Handle semester change
  const handleSemesterChange = (value: number) => {
    form.setFieldsValue({
      semesterId: value,
      subjectId: undefined,
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      // Validate that we have at least one schedule
      if (!values.schedules || values.schedules.length === 0) {
        toast.error('Please add at least one schedule');
        return;
      }

      // Format the data for bulk creation
      const bulkData = {
        batchId: values.batchId,
        semesterId: values.semesterId,
        subjectId: values.subjectId,
        schedules: values.schedules.map((schedule: any) => ({
          weekDayId: schedule.weekDayId,
          roomId: schedule.roomId,
          facultyId: schedule.facultyId,
          timeSlotId: schedule.timeSlotId,
          startDate: dayjs(schedule.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(schedule.endDate).format('YYYY-MM-DD'),
          isRecurring: schedule.isRecurring || false,
          scheduleTypeId: schedule.scheduleTypeId,
          maxCapacity: schedule.maxCapacity,
        })),
      };

      // Call the bulk create API
      const createdSchedules = await createBulkClassSchedule(bulkData);

      toast.success(
        t(LOCALE_KEYS.CREATED_NAME, {
          name: `${createdSchedules.length} ${entityName}${createdSchedules.length > 1 ? 's' : ''}`,
          defaultValue: `${createdSchedules.length} ${entityName}${createdSchedules.length > 1 ? 's' : ''} created successfully`,
        }),
      );

      if (onSuccess) {
        onSuccess();
      } else if (!embedded) {
        router.push('/class-schedules');
      }
    } catch (error) {
      console.error('Bulk create error:', error);
      // Error message is already handled by the hook
      // toast.error(`Failed to create ${entityName}s in bulk`);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (!embedded) {
      router.push('/class-schedules');
    }
  };

  const formContent = (
    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
      {/* Batch, Semester, Subject - Responsive Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Batch Selection */}
        <Form.Item
          label={t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' })}
          name="batchId"
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.REQUIRED_FIELD, { defaultValue: 'This field is required' }),
            },
          ]}
        >
          <Select
            placeholder={t(LOCALE_KEYS.SELECT_BATCH, { defaultValue: 'Select Batch' })}
            onChange={handleBatchChange}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={batches.map((batch) => ({
              value: batch.id,
              label: batch.name,
            }))}
          />
        </Form.Item>

        {/* Semester Selection */}
        <Form.Item
          label={t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' })}
          name="semesterId"
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.REQUIRED_NAME, { name: t(LOCALE_KEYS.SEMESTER) }),
            },
          ]}
        >
          <Select
            placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })}
            onChange={handleSemesterChange}
            disabled={!selectedBatchId}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={semesters.map((semester) => ({
              value: semester.id,
              label: semester.name,
            }))}
          />
        </Form.Item>

        {/* Subject Selection */}
        <Form.Item
          label={t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' })}
          name="subjectId"
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.REQUIRED_NAME, { name: t(LOCALE_KEYS.SUBJECT) }),
            },
          ]}
        >
          <Select
            placeholder={t(LOCALE_KEYS.SELECT_SUBJECT, { defaultValue: 'Select Subject' })}
            disabled={!selectedSemesterId}
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
      </div>

      {selectedSubjectId && (
        <>
          {/* Class Instances Preview */}
          {generateClassInstances.length > 0 && (
            <>
              <Divider>
                <Typography.Text strong>
                  Class Instances Preview ({generateClassInstances.length}{' '}
                  {generateClassInstances.length === 1 ? 'class' : 'classes'})
                </Typography.Text>
              </Divider>

              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  marginBottom: '24px',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  {generateClassInstances.map((instance, idx) => {
                    const faculty = facultyList.find((f) => f.id === instance.facultyId);
                    const room = rooms.find((r) => r.id === instance.roomId);
                    const timeSlot = timeSlots.find((ts) => ts.id === instance.timeSlotId);
                    const scheduleType = scheduleTypes.find(
                      (st) => st.id === instance.scheduleTypeId,
                    );

                    return (
                      <Card
                        key={idx}
                        size="small"
                        style={{
                          minWidth: '280px',
                          maxWidth: '320px',
                          flex: '1 1 auto',
                          backgroundColor: 'white',
                        }}
                      >
                        <div style={{ fontSize: '12px' }}>
                          <Typography.Text
                            strong
                            style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}
                          >
                            {instance.date.format('MMM DD, YYYY (dddd)')}
                          </Typography.Text>

                          {faculty && (
                            <div style={{ marginBottom: '4px' }}>
                              <Typography.Text type="secondary">Faculty: </Typography.Text>
                              <Typography.Text>{faculty.fullName}</Typography.Text>
                            </div>
                          )}

                          {timeSlot && (
                            <div style={{ marginBottom: '4px' }}>
                              <Typography.Text type="secondary">Time: </Typography.Text>
                              <Typography.Text>{timeSlot.name}</Typography.Text>
                            </div>
                          )}

                          {room && (
                            <div style={{ marginBottom: '4px' }}>
                              <Typography.Text type="secondary">Room: </Typography.Text>
                              <Typography.Text>{room.name}</Typography.Text>
                            </div>
                          )}

                          {scheduleType && (
                            <div style={{ marginBottom: '4px' }}>
                              <Typography.Text type="secondary">Type: </Typography.Text>
                              <Typography.Text>{scheduleType.name}</Typography.Text>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <Divider>{t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedules' })}</Divider>

          <Form.List
            name="schedules"
            initialValue={[
              {
                startDate: semesters.find((s) => s.id === selectedSemesterId)?.startDate
                  ? dayjs(semesters.find((s) => s.id === selectedSemesterId)?.startDate)
                  : undefined,
                endDate: semesters.find((s) => s.id === selectedSemesterId)?.endDate
                  ? dayjs(semesters.find((s) => s.id === selectedSemesterId)?.endDate)
                  : undefined,
                isRecurring: true,
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    title={`Schedule ${index + 1}`}
                    extra={
                      fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          {t(LOCALE_KEYS.REMOVE, { defaultValue: 'Remove' })}
                        </Button>
                      )
                    }
                    style={{ marginBottom: 12 }}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {/* Faculty */}
                      <Form.Item
                        {...field}
                        label={t(LOCALE_KEYS.FACULTY, { defaultValue: 'Faculty' })}
                        name={[field.name, 'facultyId']}
                        style={{ marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: t(LOCALE_KEYS.REQUIRED_NAME, { name: t(LOCALE_KEYS.FACULTY) }),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={facultyList.map((faculty) => ({
                            value: faculty.id,
                            label: `${faculty.fullName} (${faculty.role})`,
                          }))}
                        />
                      </Form.Item>

                      {/* Week Day */}
                      <Form.Item
                        {...field}
                        label={t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' })}
                        name={[field.name, 'weekDayId']}
                        style={{ marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: t(LOCALE_KEYS.REQUIRED_NAME, {
                              name: t(LOCALE_KEYS.WEEK_DAY),
                            }),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t(LOCALE_KEYS.SELECT_NAME, {
                            name: t(LOCALE_KEYS.WEEK_DAY),
                          })}
                          disabled={schedules[field.name]?.isRecurring === false}
                          options={weekDays.map((weekDay) => ({
                            value: weekDay.id,
                            label: weekDay.name,
                          }))}
                        />
                      </Form.Item>

                      {/* Time Slot */}
                      <Form.Item
                        {...field}
                        label={t(LOCALE_KEYS.TIME_SLOT, { defaultValue: 'Time Slot' })}
                        name={[field.name, 'timeSlotId']}
                        style={{ marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: t(LOCALE_KEYS.REQUIRED_NAME, {
                              name: t(LOCALE_KEYS.TIME_SLOT),
                            }),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t(LOCALE_KEYS.SELECT_NAME, {
                            name: t(LOCALE_KEYS.TIME_SLOT),
                          })}
                          options={timeSlots.map((timeSlot) => ({
                            value: timeSlot.id,
                            label: timeSlot.name,
                          }))}
                        />
                      </Form.Item>

                      {/* Room */}
                      <Form.Item
                        {...field}
                        label={t(LOCALE_KEYS.ROOM, { defaultValue: 'Room' })}
                        name={[field.name, 'roomId']}
                        style={{ marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: t(LOCALE_KEYS.REQUIRED_NAME, { name: t(LOCALE_KEYS.ROOM) }),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ROOM) })}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={(roomId) => {
                            // Find the selected room and set its sitting capacity as max capacity
                            const selectedRoom = rooms.find((r) => r.id === roomId);
                            if (selectedRoom) {
                              const schedules = form.getFieldValue('schedules') || [];
                              schedules[field.name] = {
                                ...schedules[field.name],
                                maxCapacity: selectedRoom.sittingCapacity,
                              };
                              form.setFieldsValue({ schedules });
                            }
                          }}
                          options={rooms.map((room) => ({
                            value: room.id,
                            label: `${room.name} (Capacity: ${room.sittingCapacity})`,
                          }))}
                        />
                      </Form.Item>

                      {/* Start Date - Editable with semester date range restrictions */}
                      <Form.Item
                        {...field}
                        label={t(LOCALE_KEYS.START_DATE, { defaultValue: 'Start Date' })}
                        name={[field.name, 'startDate']}
                        style={{ marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: t(LOCALE_KEYS.REQUIRED_NAME, {
                              name: t(LOCALE_KEYS.START_DATE),
                            }),
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          minDate={
                            semesters.find((s) => s.id === selectedSemesterId)?.startDate
                              ? dayjs(semesters.find((s) => s.id === selectedSemesterId)?.startDate)
                              : undefined
                          }
                          maxDate={
                            semesters.find((s) => s.id === selectedSemesterId)?.endDate
                              ? dayjs(semesters.find((s) => s.id === selectedSemesterId)?.endDate)
                              : undefined
                          }
                          onChange={(date) => {
                            const currentSchedules = form.getFieldValue('schedules') || [];
                            const isRecurring = currentSchedules[field.name]?.isRecurring;

                            if (isRecurring === false && date) {
                              // Auto-set end date to same as start date
                              currentSchedules[field.name] = {
                                ...currentSchedules[field.name],
                                endDate: date,
                              };

                              // Auto-select week day based on start date's day of week
                              const dayOfWeek = date.day(); // 0 = Sunday, 1 = Monday, etc.
                              const matchingWeekDay = weekDays.find(
                                (wd) => wd.dayNumber === dayOfWeek,
                              );
                              if (matchingWeekDay) {
                                currentSchedules[field.name].weekDayId = matchingWeekDay.id;
                              }

                              form.setFieldsValue({ schedules: currentSchedules });
                            }
                          }}
                        />
                      </Form.Item>

                      {/* End Date - Editable with semester date range restrictions */}
                      <Form.Item
                        {...field}
                        label={t(LOCALE_KEYS.END_DATE, { defaultValue: 'End Date' })}
                        name={[field.name, 'endDate']}
                        style={{ marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: t(LOCALE_KEYS.REQUIRED_NAME, {
                              name: t(LOCALE_KEYS.END_DATE),
                            }),
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          disabled={schedules[field.name]?.isRecurring === false}
                          minDate={
                            semesters.find((s) => s.id === selectedSemesterId)?.startDate
                              ? dayjs(semesters.find((s) => s.id === selectedSemesterId)?.startDate)
                              : undefined
                          }
                          maxDate={
                            semesters.find((s) => s.id === selectedSemesterId)?.endDate
                              ? dayjs(semesters.find((s) => s.id === selectedSemesterId)?.endDate)
                              : undefined
                          }
                        />
                      </Form.Item>

                      {/* Schedule Type */}
                      <Form.Item
                        {...field}
                        label={t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE, {
                          defaultValue: 'Schedule Type',
                        })}
                        name={[field.name, 'scheduleTypeId']}
                        style={{ marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: t(LOCALE_KEYS.REQUIRED_NAME, {
                              name: t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE),
                            }),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t(LOCALE_KEYS.SELECT_NAME, {
                            name: t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE),
                          })}
                          options={scheduleTypes.map((scheduleType) => ({
                            value: scheduleType.id,
                            label: scheduleType.name,
                          }))}
                        />
                      </Form.Item>

                      {/* Max Capacity - Hidden field, value set from room capacity */}
                      <Form.Item {...field} name={[field.name, 'maxCapacity']} hidden>
                        <InputNumber />
                      </Form.Item>

                      {/* Is Recurring */}
                      <Form.Item
                        {...field}
                        label={t(LOCALE_KEYS.IS_RECURRING, { defaultValue: 'Is Recurring' })}
                        name={[field.name, 'isRecurring']}
                        style={{ marginBottom: 0 }}
                        valuePropName="checked"
                        initialValue={true}
                      >
                        <Checkbox
                          onChange={(e) => {
                            const isRecurring = e.target.checked;
                            const currentSchedules = form.getFieldValue('schedules') || [];
                            const startDate = currentSchedules[field.name]?.startDate;

                            if (!isRecurring && startDate) {
                              // When unchecking (non-recurring), auto-set end date and week day
                              currentSchedules[field.name] = {
                                ...currentSchedules[field.name],
                                endDate: startDate,
                              };

                              // Auto-select week day based on start date
                              const dayOfWeek = dayjs(startDate).day();
                              const matchingWeekDay = weekDays.find(
                                (wd) => wd.dayNumber === dayOfWeek,
                              );
                              if (matchingWeekDay) {
                                currentSchedules[field.name].weekDayId = matchingWeekDay.id;
                              }

                              form.setFieldsValue({ schedules: currentSchedules });
                            }
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      // Get semester dates when adding new schedule row
                      const selectedSemester = semesters.find((s) => s.id === selectedSemesterId);
                      add({
                        startDate: selectedSemester?.startDate
                          ? dayjs(selectedSemester.startDate)
                          : undefined,
                        endDate: selectedSemester?.endDate
                          ? dayjs(selectedSemester.endDate)
                          : undefined,
                        isRecurring: true,
                      });
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t(LOCALE_KEYS.ADD_NAME, {
                      name: t(LOCALE_KEYS.CLASS_SCHEDULE),
                      defaultValue: 'Add Schedule',
                    })}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </>
      )}

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === 'loading'}>
            {t(LOCALE_KEYS.SUBMIT, { defaultValue: 'Submit' })}
          </Button>
          <Button onClick={handleCancel}>
            {t(LOCALE_KEYS.CANCEL, { defaultValue: 'Cancel' })}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div style={{ padding: '12px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Card title={t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedules' })}>
        {formContent}
      </Card>
    </div>
  );
};

export default ClassScheduleFormBulk;
