'use client';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { SemesterStatus, Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useLocalization } from '@/hooks/useLocalization';

import { IBatchCreate, IBatchUpdate, IBatchWithSemestersCreate } from '@/types/batch';
import { ICourse } from '@/types/course';
import { getErrorMessage } from '@/types/errors';
import { ISemesterCreate } from '@/types/semester';

import { StatusSelectFormItem } from '../ui/StatusSelect';

// Local interface for semester form with duration (not submitted to backend)
interface ISemesterFormData extends ISemesterCreate {
  duration: number;
}

// Local interface for batch form with duration (not submitted to backend)
interface IBatchFormData extends IBatchCreate {
  duration: number;
}

const { Text } = Typography;

interface BatchFormProps {
  mode: 'create' | 'edit';
  batchId?: number;
  initialValues?: Partial<IBatchCreate | IBatchUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const BatchForm: React.FC<BatchFormProps> = ({
  mode,
  batchId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createBatch, createBatchWithSemesters, editBatch, actionStatus } = useBatches();
  const { courses, loadCourses } = useCourses();

  // New state for semester management
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [semesters, setSemesters] = useState<ISemesterFormData[]>([]);
  const [showSemesterSection, setShowSemesterSection] = useState(false);

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
  }, [loadCourses]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
      setSelectedCourse(null);
      setSemesters([]);
      setShowSemesterSection(false);
    }
  }, [mode, form]);

  // Handle course selection and generate semesters
  const handleCourseChange = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      // Only generate semesters in create mode
      if (mode === 'create') {
        generateSemesters(course.durationInSemesters);
        setShowSemesterSection(true);
      }
    } else {
      setSelectedCourse(null);
      setSemesters([]);
      setShowSemesterSection(false);
    }
  };

  // Generate semester list based on course duration
  const generateSemesters = (duration: number) => {
    const newSemesters: ISemesterFormData[] = [];
    const batchStartDate = form.getFieldValue('startDate');

    for (let i = 1; i <= duration; i++) {
      // Default duration for each semester (can be customized by user)
      const defaultSemesterDuration = 3; // 3 months default

      let semesterStartDate = '';
      let semesterEndDate = '';
      let semesterName = '';

      if (batchStartDate) {
        const batchStart = dayjs(batchStartDate);

        // Calculate start date for this semester
        let semesterStart = batchStart;
        if (i > 1) {
          // For subsequent semesters, start from the end of previous semester
          // We'll calculate this based on previous semesters' durations
          for (let j = 1; j < i; j++) {
            const prevSemesterDuration = newSemesters[j - 1]?.duration || defaultSemesterDuration;
            semesterStart = semesterStart.add(prevSemesterDuration, 'month');
          }
        }

        // Calculate end date based on this semester's duration
        const semesterEnd = semesterStart.add(defaultSemesterDuration, 'month');

        semesterStartDate = semesterStart.toISOString();
        semesterEndDate = semesterEnd.toISOString();

        // Generate semester name in format: Label - Term No - Year
        semesterName = generateSemesterNameWithTerm(i, semesterStart);
      } else {
        // Fallback to generic names if dates aren't set yet
        semesterName = `Semester ${i}`;
      }

      newSemesters.push({
        batchId: 0, // Will be set by backend
        name: semesterName,
        termNo: i,
        startDate: semesterStartDate,
        endDate: semesterEndDate,
        duration: defaultSemesterDuration,
        status: SemesterStatus.ACTIVE,
        remarks: '',
        isBreak: false,
      });
    }
    setSemesters(newSemesters);
  };

  // Generate meaningful semester names based on dates
  const generateSemesterName = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    const startMonth = startDate.month(); // 0-11 (Jan=0, Dec=11)
    const startYear = startDate.year();

    // Determine semester type based on start month
    let semesterType = '';

    if (startMonth >= 8 || startMonth <= 1) {
      // Aug(8), Sep(9), Oct(10), Nov(11), Dec(12), Jan(0): Fall/Winter
      semesterType = 'Fall';
    } else if (startMonth >= 2 && startMonth <= 5) {
      // Feb(2), Mar(3), Apr(4), May(5): Spring
      semesterType = 'Spring';
    } else {
      // Jun(6), Jul(7): Summer
      semesterType = 'Summer';
    }

    return `${semesterType} ${startYear}`;
  };

  // Generate semester name in format: Level ${term} ${year}
  const generateSemesterNameWithTerm = (termNo: number, startDate: dayjs.Dayjs) => {
    const startYear = startDate.year();
    return `Level ${termNo} ${startYear}`;
  };

  // Update semester data
  const updateSemester = (index: number, field: keyof ISemesterFormData, value: any) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[index] = { ...updatedSemesters[index], [field]: value };

    // If duration is being updated, recalculate dates for this and subsequent semesters
    if (field === 'duration' && value > 0) {
      recalculateSemesterDates(updatedSemesters, index);
    }

    setSemesters(updatedSemesters);
  };

  // Recalculate semester dates when duration changes
  const recalculateSemesterDates = (semesterList: ISemesterFormData[], changedIndex: number) => {
    const batchStartDate = form.getFieldValue('startDate');
    if (!batchStartDate) return;

    const batchStart = dayjs(batchStartDate);
    let currentDate = batchStart;

    for (let i = 0; i < semesterList.length; i++) {
      const semester = semesterList[i];

      // Update start date
      semester.startDate = currentDate.toISOString();

      // Update end date based on duration
      const endDate = currentDate.add(semester.duration, 'month');
      semester.endDate = endDate.toISOString();

      // Update semester name in format: Label - Term No - Year
      semester.name = generateSemesterNameWithTerm(semester.termNo, currentDate);

      // Move to next semester start date
      currentDate = endDate;
    }
  };

  // Recalculate semester dates when batch dates change
  const handleBatchDateChange = () => {
    // Only recalculate semesters in create mode
    if (mode === 'create' && selectedCourse && semesters.length > 0) {
      recalculateSemesterDates(semesters, 0);
      setSemesters([...semesters]); // Trigger re-render
    }
  };

  // Handle duration change to calculate end date
  const handleDurationChange = (duration: number | null) => {
    if (duration && duration > 0) {
      const startDate = form.getFieldValue('startDate');
      if (startDate) {
        const endDate = dayjs(startDate).add(duration, 'month');
        form.setFieldValue('endDate', endDate);
        // Trigger semester recalculation if needed
        handleBatchDateChange();
      }
    }
  };

  // Handle start date change to recalculate end date if duration is set
  const handleStartDateChange = (date: any) => {
    const duration = form.getFieldValue('duration');
    if (duration && duration > 0) {
      const endDate = dayjs(date).add(duration, 'month');
      form.setFieldValue('endDate', endDate);
    }
    // Trigger semester recalculation if needed
    handleBatchDateChange();
  };

  const handleSubmit = async (values: Partial<IBatchFormData>) => {
    try {
      // Exclude duration field from submission (only used for UI calculations)
      const { duration, ...batchData } = values;
      const payload = {
        ...batchData,
        startDate: values.startDate
          ? dayjs(values.startDate as unknown as string | Date).toISOString()
          : undefined,
        endDate: values.endDate
          ? dayjs(values.endDate as unknown as string | Date).toISOString()
          : undefined,
      };

      if (mode === 'create') {
        // If we have semesters and this is not embedded mode, create batch with semesters
        if (!embedded && semesters.length > 0) {
          // Validate semester data first
          const validSemesters = semesters.filter((semester) => {
            if (!semester.name.trim()) {
              toast.error(`Semester ${semester.termNo}: Name is required`);
              return false;
            }
            if (!semester.duration || semester.duration <= 0) {
              toast.error(`Semester ${semester.termNo}: Duration must be greater than 0`);
              return false;
            }
            if (!semester.startDate || !semester.endDate) {
              toast.error(`Semester ${semester.termNo}: Start and end dates are required`);
              return false;
            }
            if (dayjs(semester.startDate).isAfter(dayjs(semester.endDate))) {
              toast.error(`Semester ${semester.termNo}: Start date cannot be after end date`);
              return false;
            }
            return true;
          });

          if (validSemesters.length !== semesters.length) {
            toast.error('Please fix semester validation errors before submitting');
            return;
          }

          // Prepare semester data (remove batchId and duration as they won't be submitted)
          const semesterData = validSemesters.map((semester) => ({
            name: semester.name,
            termNo: semester.termNo,
            startDate: semester.startDate,
            endDate: semester.endDate,
            status: semester.status,
            remarks: semester.remarks,
            isBreak: semester.isBreak,
          }));

          // Create batch with semesters in single API call
          const batchWithSemestersData: IBatchWithSemestersCreate = {
            batch: payload as IBatchCreate,
            semesters: semesterData,
          };
          await createBatchWithSemesters(batchWithSemestersData);

          toast.success(
            `${entityName} created successfully with ${validSemesters.length} semesters`,
          );
        } else {
          // Create batch only (embedded mode or no semesters)
          await createBatch(payload as IBatchCreate);
          toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        }

        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/batches');
        }
      } else if (mode === 'edit' && batchId) {
        await editBatch(batchId, payload as IBatchUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/batches/${batchId}`);
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

  const batchFormContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={
        mode === 'edit'
          ? {
              ...initialValues,
              startDate: initialValues?.startDate ? dayjs(initialValues.startDate) : undefined,
              endDate: initialValues?.endDate ? dayjs(initialValues.endDate) : undefined,
              duration:
                initialValues?.startDate && initialValues?.endDate
                  ? dayjs(initialValues.endDate).diff(dayjs(initialValues.startDate), 'month')
                  : undefined,
            }
          : undefined
      }
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
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
          onChange={handleCourseChange}
        >
          {courses.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name} ({course.durationInSemesters} semesters)
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
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
            name="academicYear"
            label={t(LOCALE_KEYS.ACADEMIC_YEAR)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ACADEMIC_YEAR) }),
              },
            ]}
          >
            <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
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
            <Input />
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
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DURATION_MONTHS) }),
              },
              { type: 'number', min: 1, message: 'Duration must be at least 1 month' },
              { type: 'number', max: 120, message: 'Duration cannot exceed 120 months (10 years)' },
            ]}
          >
            <InputNumber
              min={1}
              max={120}
              style={{ width: '100%' }}
              placeholder="Enter duration in months"
              onChange={handleDurationChange}
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
              onChange={handleStartDateChange}
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
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              onChange={handleBatchDateChange}
            />
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
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.INTAKE_CAPACITY) }),
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

      {/* Summary section for semester creation */}
      {!embedded && showSemesterSection && semesters.length > 0 && (
        <Form.Item>
          <Card size="small">
            <Text strong>Summary:</Text>
            <br />
            <Text>
              • {entityName}: {form.getFieldValue('name') || 'N/A'}
            </Text>
            <br />
            <Text>• Course: {selectedCourse?.name || 'N/A'}</Text>
            <br />
            <Text>• Duration: {form.getFieldValue('duration') || 'N/A'} months</Text>
            <br />
            <Text>
              • Start Date:{' '}
              {form.getFieldValue('startDate')
                ? dayjs(form.getFieldValue('startDate')).format('YYYY-MM-DD')
                : 'N/A'}
            </Text>
            <br />
            <Text>
              • End Date:{' '}
              {form.getFieldValue('endDate')
                ? dayjs(form.getFieldValue('endDate')).format('YYYY-MM-DD')
                : 'N/A'}
            </Text>
            <br />
            <Text>• Semesters to be created: {semesters.length}</Text>
            <br />
            <Text type="secondary">
              All semesters will be created automatically with the batch.
            </Text>
          </Card>
        </Form.Item>
      )}

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

  const semesterSectionContent = (
    <Card title={`Semesters (${semesters.length})`} style={{ height: 'fit-content' }}>
      {selectedCourse && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Course: {selectedCourse.name}</Text>
          <br />
          <Text type="secondary">Duration: {selectedCourse.durationInSemesters} semesters</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Start and end dates are automatically calculated based on duration. Each semester
            starts where the previous one ends.
          </Text>
        </div>
      )}
      <Divider />
      {semesters.map((semester, index) => (
        <Card
          key={index}
          size="small"
          style={{ marginBottom: 16 }}
          title={`Semester ${semester.termNo}`}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={t(LOCALE_KEYS.NAME)} style={{ marginBottom: 8 }}>
                <Input
                  value={semester.name}
                  onChange={(e) => updateSemester(index, 'name', e.target.value)}
                  placeholder="Semester name"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={t(LOCALE_KEYS.TERM_NO)} style={{ marginBottom: 8 }}>
                <InputNumber
                  value={semester.termNo}
                  onChange={(value) => updateSemester(index, 'termNo', value)}
                  min={1}
                  max={20}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t(LOCALE_KEYS.DURATION_MONTHS)} style={{ marginBottom: 8 }}>
                <InputNumber
                  value={semester.duration}
                  onChange={(value) => updateSemester(index, 'duration', value)}
                  min={1}
                  max={12}
                  style={{ width: '100%' }}
                  placeholder="Months"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={t(LOCALE_KEYS.IS_BREAK)} style={{ marginBottom: 8 }}>
                <Switch
                  value={semester.isBreak}
                  onChange={(value: boolean) => updateSemester(index, 'isBreak', value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t(LOCALE_KEYS.START_DATE)} style={{ marginBottom: 8 }}>
                <DatePicker
                  value={semester.startDate ? dayjs(semester.startDate) : undefined}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t(LOCALE_KEYS.END_DATE)} style={{ marginBottom: 8 }}>
                <DatePicker
                  value={semester.endDate ? dayjs(semester.endDate) : undefined}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t(LOCALE_KEYS.STATUS)} style={{ marginBottom: 8 }}>
                <Select
                  value={semester.status}
                  onChange={(value) => updateSemester(index, 'status', value)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                  <Select.Option value="completed">Completed</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t(LOCALE_KEYS.REMARKS)} style={{ marginBottom: 8 }}>
                <Input
                  value={semester.remarks}
                  onChange={(e) => updateSemester(index, 'remarks', e.target.value)}
                  placeholder="Remarks"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ))}
    </Card>
  );

  // If embedded mode, return simple form
  if (embedded) {
    return batchFormContent;
  }

  // For page mode, return two-column layout
  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Row gutter={24}>
        <Col span={10}>
          <Card
            title={`${mode === 'create' ? 'Create' : 'Edit'} ${entityName}`}
            style={{ height: 'fit-content' }}
          >
            {batchFormContent}
          </Card>
        </Col>
        <Col span={14}>
          {/* Semester section - only shown in create mode */}
          {showSemesterSection && semesterSectionContent}
        </Col>
      </Row>
    </div>
  );
};

export default BatchForm;
