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
import { EntityStatus, SemesterStatus, Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useLocalization } from '@/hooks/useLocalization';

import { IBatchCreate, IBatchUpdate, IBatchWithSemestersCreate } from '@/types/batch';
import { ICourse } from '@/types/course';
import { getErrorMessage } from '@/types/errors';
import { ISectionCreate } from '@/types/section';
import { ISemesterCreate } from '@/types/semester';

import { StatusSelectFormItem } from '../ui/StatusSelect';
import QuickAddDrawerButton from '../ui/QuickAddDrawerButton';
import CourseFormDrawer from '../courses/CourseFormDrawer';

// Local interface for semester form with duration (not submitted to backend)
interface ISemesterFormData extends ISemesterCreate {
  duration: number;
}

// Local interface for batch form with duration (not submitted to backend)
interface IBatchFormData extends IBatchCreate {
  duration: number;
}

// Section form data for batch create (no batchId until batch is created)
type ISectionFormData = Omit<ISectionCreate, 'batchId'>;

const { Text } = Typography;

import { ACADEMIC_YEAR_OPTIONS, getHijriYear, toArabicNumeral } from '@/utils/academicYearOptions';

// Session two-year format; label: Gregorian (EN) | Hijri (AR)
const SESSION_OPTIONS = (() => {
  const startYear = new Date().getFullYear() - 1;
  return Array.from({ length: 5 }, (_, i) => {
    const y = startYear + i;
    const en = `${y} - ${y + 1}`;
    const hijri = `${getHijriYear(y)} - ${getHijriYear(y + 1)}`;
    return {
      value: en,
      label: `${en}  |  ${toArabicNumeral(hijri)}`,
    };
  });
})();

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
  // Sections to create with batch (create mode only)
  const [sections, setSections] = useState<ISectionFormData[]>([]);

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
  }, [loadCourses]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
      setSelectedCourse(null);
      setSemesters([]);
      setSections([]);
      setShowSemesterSection(false);
    }
  }, [mode, form]);

  // Duration in months from selected course (read-only); fallback if durationInMonths not set
  const getCourseDurationMonths = (course: ICourse) =>
    course.durationInMonths ?? (course.durationInSemesters ?? 1) * 6;

  // Handle course selection and generate semesters
  const handleCourseChange = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      const durationMonths = getCourseDurationMonths(course);
      form.setFieldsValue({ duration: durationMonths });
      // Recalculate end date if start date is set
      const startDate = form.getFieldValue('startDate');
      if (startDate && durationMonths > 0) {
        form.setFieldsValue({ endDate: dayjs(startDate).add(durationMonths, 'month') });
        handleBatchDateChange();
      }
      // Only generate semesters in create mode; distribute course totalCreditHours if set
      if (mode === 'create') {
        generateSemesters(
          course.durationInSemesters,
          course.totalCreditHours ?? undefined,
        );
        setShowSemesterSection(true);
      }
    } else {
      setSelectedCourse(null);
      setSemesters([]);
      setShowSemesterSection(false);
      form.setFieldsValue({ duration: undefined });
    }
  };

  // In edit mode, set selectedCourse and duration from initial course when courses are loaded
  useEffect(() => {
    if (mode === 'edit' && initialValues?.courseId && courses.length > 0) {
      const course = courses.find((c) => c.id === initialValues.courseId);
      if (course) {
        setSelectedCourse(course);
        const durationMonths =
          course.durationInMonths ?? (course.durationInSemesters ?? 1) * 6;
        form.setFieldsValue({ duration: durationMonths });
      }
    }
  }, [mode, initialValues?.courseId, courses, form]);

  // Distribute total credit hours across count semesters (even split, remainder on first items)
  const distributeCreditHours = (total: number, count: number): number[] => {
    if (count <= 0 || total < 0) return [];
    const base = Math.floor(total / count);
    const remainder = total % count;
    return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
  };

  // Generate semester list based on course duration; distribute course totalCreditHours if set
  const generateSemesters = (duration: number, totalCreditHours?: number) => {
    const newSemesters: ISemesterFormData[] = [];
    const batchStartDate = form.getFieldValue('startDate');
    const creditPerSemester =
      totalCreditHours != null && totalCreditHours > 0 && duration > 0
        ? distributeCreditHours(totalCreditHours, duration)
        : [];

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
        creditHours: creditPerSemester[i - 1],
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

  // Redistribute credit hours when one semester changes: keep course total, spread rest
  const redistributeCreditHours = (
    list: ISemesterFormData[],
    changedIndex: number,
    newValue: number,
  ) => {
    const total = selectedCourse?.totalCreditHours;
    if (total == null || total <= 0 || list.length <= 1) return;
    const remaining = Math.max(0, total - newValue);
    const otherIndices = list
      .map((_, i) => i)
      .filter((i) => i !== changedIndex);
    const distributed = distributeCreditHours(remaining, otherIndices.length);
    otherIndices.forEach((i, j) => {
      list[i].creditHours = distributed[j];
    });
  };

  // Update semester data
  const updateSemester = (index: number, field: keyof ISemesterFormData, value: any) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[index] = { ...updatedSemesters[index], [field]: value };

    // If duration is being updated, recalculate dates for this and subsequent semesters
    if (field === 'duration' && value > 0) {
      recalculateSemesterDates(updatedSemesters, index);
    }

    // If creditHours changed, redistribute remaining total across other semesters
    if (field === 'creditHours' && typeof value === 'number') {
      redistributeCreditHours(updatedSemesters, index, value);
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

  // Section helpers (create mode only)
  const defaultSectionRow = (): ISectionFormData => ({
    name: '',
    code: '',
    status: EntityStatus.ACTIVE,
    remarks: '',
  });

  const addSection = () => {
    setSections((prev) => [...prev, defaultSectionRow()]);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof ISectionFormData, value: string) => {
    setSections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Recalculate semester dates when batch dates change
  const handleBatchDateChange = () => {
    // Only recalculate semesters in create mode
    if (mode === 'create' && selectedCourse && semesters.length > 0) {
      recalculateSemesterDates(semesters, 0);
      setSemesters([...semesters]); // Trigger re-render
    }
  };

  // Handle start date change to recalculate end date if duration is set (from course)
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
            creditHours: semester.creditHours,
          }));

          // Prepare section data (only include sections with name and code)
          const validSections = sections.filter((s) => (s.name ?? '').trim() && (s.code ?? '').trim());
          const sectionData = validSections.map((s) => ({
            name: s.name.trim(),
            code: s.code.trim(),
            status: s.status,
            remarks: s.remarks ?? '',
          }));

          // Create batch with semesters (and optional sections) in single API call
          const batchWithSemestersData: IBatchWithSemestersCreate = {
            batch: payload as IBatchCreate,
            semesters: semesterData,
            sections: sectionData,
          };
          await createBatchWithSemesters(batchWithSemestersData);

          const sectionMsg =
            sectionData.length > 0
              ? ` and ${sectionData.length} section(s)`
              : '';
          toast.success(
            `${entityName} created successfully with ${validSemesters.length} semesters${sectionMsg}`,
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

      <Row gutter={8}>
        <Col flex="auto">
          <Form.Item name="courseId"
            label={t(LOCALE_KEYS.COURSE)} rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.COURSE) }),
              },
            ]}>
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
                if (data?.id) {
                  form.setFieldsValue({ courseId: data.id });
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
        name="code"
        label={t(LOCALE_KEYS.CODE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CODE) }),
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
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DURATION_MONTHS) }),
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
              placeholder={
                selectedCourse
                  ? undefined
                  : t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })
              }
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
            extra="Calculated from start date + course duration"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabled
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
          <Text type="secondary">
            Duration: {getCourseDurationMonths(selectedCourse)} months
            {selectedCourse.durationInSemesters != null && (
              <> ({selectedCourse.durationInSemesters} semesters)</>
            )}
          </Text>
          {selectedCourse.totalCreditHours != null && selectedCourse.totalCreditHours > 0 && (
            <>
              <br />
              <Text type="secondary">
                {t(LOCALE_KEYS.CREDIT_HOURS)} (total): {selectedCourse.totalCreditHours} —{' '}
                distributed across semesters; change one to recalculate others.
              </Text>
            </>
          )}
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Start and end dates are automatically calculated based on course duration. Each
            semester starts where the previous one ends.
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
          {/* Line 1: Name, Term No, Duration (Months) */}
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={10}>
              <Form.Item label={t(LOCALE_KEYS.NAME)} style={{ marginBottom: 8 }}>
                <Input
                  value={semester.name}
                  onChange={(e) => updateSemester(index, 'name', e.target.value)}
                  placeholder="Semester name"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={6} md={4}>
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
            <Col xs={12} sm={6} md={10}>
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
          </Row>
          {/* Line 2: Credit Hours, Is Break */}
          <Row gutter={[16, 8]}>
            <Col xs={12} sm={8} md={6}>
              <Form.Item label={t(LOCALE_KEYS.CREDIT_HOURS)} style={{ marginBottom: 8 }}>
                <InputNumber
                  value={semester.creditHours}
                  onChange={(value) => updateSemester(index, 'creditHours', value)}
                  min={0}
                  max={500}
                  style={{ width: '100%', minWidth: 50 }}
                  placeholder="—"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={4}>
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

  const sectionSectionContent = (
    <Card
      title={`${t(LOCALE_KEYS.SECTIONS)} (${sections.length})`}
      style={{ height: 'fit-content', marginTop: 24 }}
      extra={
        <Button type="dashed" size="small" onClick={addSection}>
          + {t(LOCALE_KEYS.ADD_NAME, { name: t(LOCALE_KEYS.SECTION) })}
        </Button>
      }
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Add sections to create with this batch. Sections with name and code will be included.
      </Text>
      {sections.map((section, index) => (
        <Card
          key={index}
          size="small"
          style={{ marginBottom: 16 }}
          title={`${t(LOCALE_KEYS.SECTION)} ${index + 1}`}
          extra={
            <Button
              type="link"
              danger
              size="small"
              onClick={() => removeSection(index)}
            >
              Remove
            </Button>
          }
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12}>
              <Form.Item label={t(LOCALE_KEYS.NAME)} style={{ marginBottom: 8 }}>
                <Input
                  value={section.name}
                  onChange={(e) => updateSection(index, 'name', e.target.value)}
                  placeholder={t(LOCALE_KEYS.NAME)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t(LOCALE_KEYS.CODE)} style={{ marginBottom: 8 }}>
                <Input
                  value={section.code}
                  onChange={(e) => updateSection(index, 'code', e.target.value)}
                  placeholder={t(LOCALE_KEYS.CODE)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t(LOCALE_KEYS.STATUS)} style={{ marginBottom: 8 }}>
                <Select
                  value={section.status}
                  onChange={(value) => updateSection(index, 'status', value)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t(LOCALE_KEYS.REMARKS)} style={{ marginBottom: 8 }}>
                <Input
                  value={section.remarks}
                  onChange={(e) => updateSection(index, 'remarks', e.target.value)}
                  placeholder={t(LOCALE_KEYS.REMARKS)}
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
          {/* Sections card - only in create mode */}
          {mode === 'create' && sectionSectionContent}
        </Col>
      </Row>
    </div>
  );
};

export default BatchForm;
