'use client';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from 'antd';
import React from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';

import { ACADEMIC_YEAR_OPTIONS } from '@/utils/academicYearOptions';

import { StatusSelectFormItem } from '@/components/ui/StatusSelect';
import QuickAddDrawerButton from '@/components/ui/QuickAddDrawerButton';
import CourseFormDrawer from '@/components/courses/CourseFormDrawer';

import { SESSION_OPTIONS } from './constants';
import type { ISemesterFormData } from './types';

export interface BatchBasicFormFieldsProps {
  form: ReturnType<typeof Form.useForm>[0];
  initialValues?: Record<string, unknown>;
  courses: { id: number; name: string }[];
  selectedCourse: { name: string } | null;
  loading: boolean;
  semesters: ISemesterFormData[];
  showSemesterSection: boolean;
  embedded: boolean;
  entityName: string;
  onCourseChange: (courseId: number) => void;
  onStartDateChange: (date: unknown) => void;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  getSubmitText: () => string;
  loadCourses: () => Promise<unknown>;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
  /** When true, action buttons (Create/Cancel) are not rendered here (e.g. when using a fixed bottom bar). */
  hideActions?: boolean;
}

export default function BatchBasicFormFields({
  form,
  initialValues,
  courses,
  selectedCourse,
  loading,
  semesters,
  showSemesterSection,
  embedded,
  entityName,
  onCourseChange,
  onStartDateChange,
  onSubmit,
  onCancel,
  getSubmitText,
  loadCourses,
  t,
  hideActions = false,
}: BatchBasicFormFieldsProps) {
  return (
    <Form
      form={form as FormInstance<Record<string, unknown>>}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      disabled={loading}
    >
      <Row gutter={8}>
        <Col flex="auto">
          <Form.Item
            name="courseId"
            label={t(LOCALE_KEYS.COURSE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.COURSE) }),
              },
            ]}
          >
            <Select
              showSearch
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              onChange={onCourseChange}
            >
              {courses.map((course) => (
                <Select.Option key={course.id} value={course.id}>
                  {course.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={CourseFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={async (data) => {
                await loadCourses();
                if (data?.id) form.setFieldsValue({ courseId: data.id });
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
          { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }) },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="code"
        label={t(LOCALE_KEYS.CODE)}
        rules={[
          { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CODE) }) },
        ]}
      >
        <Input />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="academicYear"
            label={t(LOCALE_KEYS.ACADEMIC_YEAR)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.ACADEMIC_YEAR),
                }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ACADEMIC_YEAR) })}
              style={{ width: '100%' }}
              options={ACADEMIC_YEAR_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="session"
            label={t(LOCALE_KEYS.SESSION)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SESSION) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SESSION) })}
              style={{ width: '100%' }}
              options={SESSION_OPTIONS}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="duration"
            label={t(LOCALE_KEYS.DURATION_MONTHS)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.DURATION_MONTHS),
                }),
              },
            ]}
            extra={
              !selectedCourse
                ? t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) }) +
                  ' to set duration (from course)'
                : undefined
            }
          >
            <InputNumber
              min={1}
              max={120}
              style={{ width: '100%' }}
              placeholder={selectedCourse ? undefined : t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
              disabled
              readOnly
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="startDate"
            label={t(LOCALE_KEYS.START_DATE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.START_DATE) }),
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              onChange={onStartDateChange}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="endDate"
            label={t(LOCALE_KEYS.END_DATE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.END_DATE) }),
              },
            ]}
            extra="Calculated from start date + course duration"
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="intakeCapacity"
            label={t(LOCALE_KEYS.INTAKE_CAPACITY)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.INTAKE_CAPACITY),
                }),
              },
            ]}
          >
            <InputNumber min={1} max={10000} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />
        </Col>
      </Row>

      <Form.Item
        name="remarks"
        label={t(LOCALE_KEYS.REMARKS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.REMARKS) }),
          },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      {!hideActions && (
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {getSubmitText()}
            </Button>
            <Button onClick={onCancel} disabled={loading}>
              {t(LOCALE_KEYS.CANCEL)}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
}
