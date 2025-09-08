'use client';

import { Button, DatePicker, Form, Input, InputNumber, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useAttendances } from '@/hooks/useAttendances';
import { useBatches } from '@/hooks/useBatches';
import { useClassSchedules } from '@/hooks/useClassSchedules';
import { useCourses } from '@/hooks/useCourses';
import { useFaculties } from '@/hooks/useFaculties';
import { useLocalization } from '@/hooks/useLocalization';
import { useSemesters } from '@/hooks/useSemesters';
import { useSubjects } from '@/hooks/useSubjects';

import { IAttendance, IAttendanceCreate, IAttendanceUpdate } from '@/types/attendance';
import { IFacultyWithSubjectRole } from '@/types/faculty';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';

const { TextArea } = Input;

interface AttendanceFormProps {
  mode: 'create' | 'edit';
  attendanceId?: number;
  initialValues?: Partial<IAttendanceCreate | IAttendanceUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  mode,
  attendanceId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createAttendance, editAttendance, actionStatus } = useAttendances();
  const { courses, loadCourses } = useCourses();

  const {
    semesters,
    semesterWithSubjectsAndFaculty,
    loadSemesters,
    loadSemesterWithSubjectsAndFaculty,
    clearSemesters,
  } = useSemesters();
  const { batches, loadBatches } = useBatches();
  const { classSchedules, loadClassSchedules } = useClassSchedules();

  const selectedCourseId = Form.useWatch('courseId', form);
  const selectedBatchId = Form.useWatch('batchId', form);
  const selectedSemesterId = Form.useWatch('semesterId', form);
  const selectedSubjectId = Form.useWatch('subjectId', form);
  const selectedFacultyId = Form.useWatch('facultyId', form);

  const [facultyList, setFacultyList] = useState<IFacultyWithSubjectRole[]>([]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
    clearSemesters();
  }, [loadCourses, clearSemesters]);

  useEffect(() => {
    if (selectedCourseId) {
      loadBatches({ page: 1, limit: 100, courseId: selectedCourseId });
    }
  }, [courses, selectedCourseId, loadBatches]);

  useEffect(() => {
    if (selectedBatchId) {
      loadSemesters({ page: 1, limit: 100, batchId: selectedBatchId });
    }
  }, [batches, selectedBatchId, loadSemesters]);

  useEffect(() => {
    if (selectedSemesterId) {
      loadSemesterWithSubjectsAndFaculty(selectedSemesterId);
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

  useEffect(() => {
    if (selectedFacultyId && selectedSubjectId) {
      loadClassSchedules({
        page: 1,
        limit: 100,
        facultyId: selectedFacultyId,
        subjectId: selectedSubjectId,
      });
    }
  }, [selectedFacultyId, selectedSubjectId, loadClassSchedules]);

  const handleSubmit = async (values: Partial<IAttendance>) => {
    try {
      // Convert dayjs objects to date strings
      const formData = {
        ...values,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : undefined,
      };

      if (mode === 'create') {
        await createAttendance(formData as IAttendanceCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/attendances');
        }
      } else if (mode === 'edit' && attendanceId) {
        await editAttendance(attendanceId, formData as IAttendanceUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/attendances/${attendanceId}`);
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
              date: initialValues.date ? dayjs(initialValues.date) : undefined,
            }
          : undefined
      }
    >
      <Form.Item
        name="courseId"
        label={t(LOCALE_KEYS.COURSE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_COURSE)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {courses.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="batchId"
        label={t(LOCALE_KEYS.BATCH)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_BATCH)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
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
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_SEMESTER)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
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
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {semesterWithSubjectsAndFaculty?.subjects.map((subject) => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.name} ({subject.code})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="facultyId"
        label={t(LOCALE_KEYS.FACULTY)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {facultyList.map((faculty) => (
            <Select.Option key={faculty.id} value={faculty.id}>
              {faculty.fullName} ({faculty.role})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="scheduleId"
        label={t(LOCALE_KEYS.SCHEDULE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_SCHEDULE)}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {classSchedules.map((schedule) => (
            <Select.Option key={schedule.id} value={schedule.id}>
              {schedule.weekDay?.name} - {schedule.timeSlot?.name} - {schedule.scheduleType?.name} -{' '}
              {schedule.room?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="classNo"
        label={t(LOCALE_KEYS.CLASS_NO)}
        rules={[
          { required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) },
          { type: 'number', min: 1, message: t(LOCALE_KEYS.CLASS_NO_MUST_BE_POSITIVE) },
        ]}
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.ENTER_CLASS_NO)}
        />
      </Form.Item>

      <Form.Item
        name="date"
        label={t(LOCALE_KEYS.DATE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.REQUIRED_FIELD) }]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.SELECT_NAME)}
        />
      </Form.Item>

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <TextArea rows={3} placeholder={t(LOCALE_KEYS.ENTER_REMARK)} />
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

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

export default AttendanceForm;
