'use client';

import { Button, DatePicker, Form, Input, InputNumber, Row, Col, Space, Switch, Select } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import FormLayout from '@/components/layout/FormLayout';
import QuickAddDrawerButton from '@/components/ui/QuickAddDrawerButton';
import { StatusSelectFormItem } from '@/components/ui/StatusSelect';

import EventTypeFormDrawer from '@/components/eventTypes/EventTypeFormDrawer';

import { useEventTypes } from '@/hooks/useEventTypes';
import { useEvents } from '@/hooks/useEvents';
import { useLocalization } from '@/hooks/useLocalization';
import { useCourses } from '@/hooks/useCourses';
import { useBatches } from '@/hooks/useBatches';
import { useSemesters } from '@/hooks/useSemesters';
import { useSections } from '@/hooks/useSections';
import { ACADEMIC_YEAR_OPTIONS } from '@/utils/academicYearOptions';

import { getErrorMessage } from '@/types/errors';
import { IEvent, IEventCreate, IEventUpdate } from '@/types/event';

interface EventFormProps {
  mode: 'create' | 'edit';
  eventId?: number;
  initialValues?: Partial<IEventCreate | IEventUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  mode,
  eventId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EVENT, { defaultValue: 'Event' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createEvent, editEvent, actionStatus } = useEvents();
  const { eventTypes, loadEventTypes } = useEventTypes();
  const { courses, loadCourses } = useCourses();
  const { batches, loadBatches } = useBatches();
  const { semesters, loadSemesters } = useSemesters();
  const { sections, loadSections } = useSections();

  const selectedCourseId = Form.useWatch('courseId', form);
  const selectedBatchId = Form.useWatch('batchId', form);

  useEffect(() => {
    loadEventTypes({ page: 1, limit: 100 });
  }, [loadEventTypes]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
  }, [loadCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      loadBatches({ page: 1, limit: 100, courseId: selectedCourseId });
    }
  }, [selectedCourseId, loadBatches]);

  useEffect(() => {
    if (selectedBatchId) {
      loadSemesters({ page: 1, limit: 100, batchId: selectedBatchId });
      loadSections({ page: 1, limit: 100, batchId: selectedBatchId });
    }
  }, [selectedBatchId, loadSemesters, loadSections]);

  const handleCourseChange = (courseId: number) => {
    form.setFieldsValue({
      courseId,
      batchId: undefined,
      semesterId: undefined,
      sectionId: undefined,
    });
  };

  const handleBatchChange = (batchId: number) => {
    form.setFieldsValue({
      batchId,
      semesterId: undefined,
      sectionId: undefined,
    });
  };

  const handleSubmit = async (values: Partial<IEvent>) => {
    try {
      const payload: Partial<IEventCreate | IEventUpdate> = {
        ...values,
        startAt: values.startAt ? dayjs(values.startAt as any).toISOString() : undefined,
        endAt: values.endAt ? dayjs(values.endAt as any).toISOString() : undefined,
      };

      if (mode === 'create') {
        await createEvent(payload as IEventCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/events');
      } else if (mode === 'edit' && eventId) {
        await editEvent(eventId, payload as IEventUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/events/${eventId}`);
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
      initialValues={
        mode === 'edit'
          ? {
              ...initialValues,
              startAt: initialValues?.startAt ? dayjs(initialValues.startAt) : undefined,
              endAt: initialValues?.endAt ? dayjs(initialValues.endAt) : undefined,
            }
          : { isAllDay: true, isHoliday: false, isAffectsAttendance: true }
      }
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="eventTypeId"
            label={t(LOCALE_KEYS.EVENT_TYPE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EVENT_TYPE) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_EVENT_TYPE)}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
            >
              {eventTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={EventTypeFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={async (data) => {
                await loadEventTypes({ page: 1, limit: 100 });
                if (data?.id) {
                  form.setFieldsValue({ eventTypeId: data.id });
                }
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>

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

      <Form.Item
        name="academicYear"
        label={t(LOCALE_KEYS.ACADEMIC_YEAR)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ACADEMIC_YEAR) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ACADEMIC_YEAR) })}
          style={{ width: '100%' }}
          options={ACADEMIC_YEAR_OPTIONS}
        />
      </Form.Item>

      <Form.Item
        name="courseId"
        label={t(LOCALE_KEYS.COURSE)}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
          onChange={handleCourseChange}
        >
          {courses.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name} {course.code ? `(${course.code})` : ''}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="batchId"
        label={t(LOCALE_KEYS.BATCH)}
      >
        <Select
          placeholder={
            selectedCourseId
              ? t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })
              : 'Please select a course first'
          }
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
          disabled={!selectedCourseId}
          onChange={handleBatchChange}
        >
          {batches.map((batch) => (
            <Select.Option key={batch.id} value={batch.id}>
              {batch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="semesterId"
            label={t(LOCALE_KEYS.SEMESTER)}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!selectedBatchId}
            >
              {semesters.map((semester) => (
                <Select.Option key={semester.id} value={semester.id}>
                  {semester.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="sectionId"
            label={t(LOCALE_KEYS.SECTION)}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SECTION) })}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              disabled={!selectedBatchId}
            >
              {sections.map((section) => (
                <Select.Option key={section.id} value={section.id}>
                  {section.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="startAt"
            label="Start At"
            rules={[{ required: true, message: 'Please pick start date/time' }]}
          >
            <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="endAt"
            label="End At"
            rules={[{ required: true, message: 'Please pick end date/time' }]}
          >
            <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="isAllDay" label="All Day" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="isHoliday" label="Holiday" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="isAffectsAttendance"
            label="Affects Attendance"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <Input.TextArea rows={3} />
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

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default EventForm;

