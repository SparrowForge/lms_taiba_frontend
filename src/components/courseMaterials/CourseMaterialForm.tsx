'use client';

import {Button, Col, Form, Input, Row, Select, Space, Switch} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ACCESS_LEVEL_TYPE_OPTIONS, EntityType, FileCategory, FileType, MATERIAL_TYPE_OPTIONS, Status,} from '@/enums';

import FileUpload from '@/components/ui/FileUpload';

import {useBatches} from '@/hooks/useBatches';
import {useCourseMaterials} from '@/hooks/useCourseMaterials';
import {useCourses} from '@/hooks/useCourses';
import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

import {ICourseMaterial, ICourseMaterialCreate, ICourseMaterialUpdate,} from '@/types/courseMaterial';
import {getErrorMessage} from '@/types/errors';
import FormLayoutFull from '../layout/FormLayoutFull';
import {StatusSelect} from '../ui/StatusSelect';
import { useAttendances } from '@/hooks/useAttendances';

const { TextArea } = Input;

interface CourseMaterialFormProps {
  mode: 'create' | 'edit';
  courseMaterialId?: number;
  initialValues?: Partial<ICourseMaterialCreate | ICourseMaterialUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const CourseMaterialForm: React.FC<CourseMaterialFormProps> = ({
  mode,
  courseMaterialId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createCourseMaterial, editCourseMaterial, actionStatus } = useCourseMaterials();
  const { courses, loadCourses } = useCourses();
  const { semesters, loadSemesters, clearSemesters } = useSemesters();
  const { batches, loadBatches, clearBatches } = useBatches();
  const { semesterSubjects, loadSemesterSubjects } = useSemesterSubjects();
  const { faculties, loadFaculties } = useFaculties();
  const {attendances, loadAttendances} = useAttendances()

  // State for cascading dropdowns
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(
    initialValues?.courseId,
  );
  const [selectedBatchId, setSelectedBatchId] = useState<number | undefined>(
    initialValues?.batchId,
  );
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>(
    initialValues?.semesterId,
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(initialValues?.subjectId,)


  // Track which fields were pre-filled from URL (should be disabled)
  const [prefilledFields, setPrefilledFields] = useState<{
    courseId?: boolean;
    batchId?: boolean;
    semesterId?: boolean;
    subjectId?: boolean;
    facultyId?: boolean;
    classNo?:boolean
  }>({});

  // Extract subjects from semesterSubjects
  const subjects = useMemo(() => {
    return semesterSubjects.map((ss) => ss.subject);
  }, [semesterSubjects]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  // Load courses and faculties on mount
  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
    loadFaculties({ page: 1, limit: 100 });
  }, [loadCourses, loadFaculties]);

  // Load batches when course is selected
  useEffect(() => {
    if (selectedCourseId) {
      loadBatches({ page: 1, limit: 100, courseId: selectedCourseId });
    } else {
      clearBatches();
    }
  }, [selectedCourseId, loadBatches, clearBatches]);

  // Load semesters when batch is selected
  useEffect(() => {
    if (selectedBatchId) {
      loadSemesters({ page: 1, limit: 100, batchId: selectedBatchId });
    } else {
      clearSemesters();
    }
  }, [selectedBatchId, loadSemesters, clearSemesters]);

  // Load semester subjects when semester is selected
  useEffect(() => {
    if (selectedSemesterId) {
      loadSemesterSubjects({ page: 1, limit: 100, semesterId: selectedSemesterId });
    }
  }, [selectedSemesterId, loadSemesterSubjects]);

    // Load class no when semester is selected
  useEffect(() => {
    if (selectedSemesterId && selectedSubjectId) {
      loadAttendances({ page: 1, limit: 100, semesterId: selectedSemesterId, subjectId:selectedSubjectId });
    }
  }, [selectedSemesterId, loadAttendances, selectedSubjectId]);

  // Handle URL query parameters for pre-filled values
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const courseId = params.get('courseId');
      const batchId = params.get('batchId');
      const semesterId = params.get('semesterId');
      const subjectId = params.get('subjectId');
      const facultyId = params.get('facultyId');

      const prefilled: {
        courseId?: boolean;
        batchId?: boolean;
        semesterId?: boolean;
        subjectId?: boolean;
        facultyId?: boolean;
      } = {};

      if (courseId) {
        const courseIdNum = parseInt(courseId);
        setSelectedCourseId(courseIdNum);
        form.setFieldValue('courseId', courseIdNum);
        prefilled.courseId = true;
      }
      if (batchId) {
        const batchIdNum = parseInt(batchId);
        setSelectedBatchId(batchIdNum);
        form.setFieldValue('batchId', batchIdNum);
        prefilled.batchId = true;
      }
      if (semesterId) {
        const semesterIdNum = parseInt(semesterId);
        setSelectedSemesterId(semesterIdNum);
        form.setFieldValue('semesterId', semesterIdNum);
        prefilled.semesterId = true;
      }
      if (subjectId) {
        form.setFieldValue('subjectId', parseInt(subjectId));
        prefilled.subjectId = true;
      }
      if (facultyId) {
        form.setFieldValue('facultyId', parseInt(facultyId));
        prefilled.facultyId = true;
      }

      setPrefilledFields(prefilled);
    }
  }, [form]);

  const handleSubmit = async (values: Partial<ICourseMaterial>) => {
    try {
      if (mode === 'create') {
        await createCourseMaterial(values as ICourseMaterialCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/course-materials');
        }
      } else if (mode === 'edit' && courseMaterialId) {
        await editCourseMaterial(courseMaterialId, values as ICourseMaterialUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/course-materials/${courseMaterialId}`);
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
      } else {
        // Use the helper function for other error types
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

  const handleCourseChange = (value: number) => {
    setSelectedCourseId(value);
    setSelectedBatchId(undefined);
    setSelectedSemesterId(undefined);
    form.setFieldsValue({
      batchId: undefined,
      semesterId: undefined,
      subjectId: undefined,
    });
  };

  const handleBatchChange = (value: number) => {
    setSelectedBatchId(value);
    setSelectedSemesterId(undefined);
    form.setFieldsValue({
      semesterId: undefined,
      subjectId: undefined,
    });
  };

  const handleSemesterChange = (value: number) => {
    setSelectedSemesterId(value);
    form.setFieldsValue({
      subjectId: undefined,
    });
  };

  const handleSubjectChange = (value: number) => {
    setSelectedSubjectId(value);
    form.setFieldsValue({
      classNo: undefined,
    });
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
      initialValues={mode === 'edit' ? initialValues : undefined}
    >
      <Row gutter={[32, 16]}>
        {/* Left Column - Cascading Dropdowns */}
        <Col xs={24} lg={12}>
          {/* 1. Course Selection */}
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
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
              showSearch
              disabled={prefilledFields.courseId}
              onChange={handleCourseChange}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={courses.map((course) => ({
                value: course.id,
                label: `${course.code} - ${course.name}`,
              }))}
            />
          </Form.Item>

          {/* 2. Batch Selection (enabled after course) */}
          <Form.Item
            name="batchId"
            label={t(LOCALE_KEYS.BATCH)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BATCH) }),
              },
            ]}
          >
            <Select
              placeholder={
                selectedCourseId
                  ? t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })
                  : t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) }) + ' first'
              }
              showSearch
              disabled={!selectedCourseId || prefilledFields.batchId}
              onChange={handleBatchChange}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={batches.map((batch) => ({
                value: batch.id,
                label: `${batch.name}`,
              }))}
            />
          </Form.Item>

          {/* 3. Semester Selection (enabled after batch) */}
          <Form.Item
            name="semesterId"
            label={t(LOCALE_KEYS.SEMESTER)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SEMESTER) }),
              },
            ]}
          >
            <Select
              placeholder={
                selectedBatchId
                  ? t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })
                  : t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) }) + ' first'
              }
              showSearch
              disabled={!selectedBatchId || prefilledFields.semesterId}
              onChange={handleSemesterChange}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={semesters.map((semester) => ({
                value: semester.id,
                label: `${semester.name}`,
              }))}
            />
          </Form.Item>

          
          {/* 4. Subject Selection (enabled after semester) */}
          <Form.Item
            name="subjectId"
            label={t(LOCALE_KEYS.SUBJECT)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SUBJECT) }),
              },
            ]}
          >
            <Select
              placeholder={
                selectedSemesterId
                  ? t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SUBJECT) })
                  : t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) }) + ' first'
              }
              showSearch
              disabled={!selectedSemesterId || prefilledFields.subjectId}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleSubjectChange}
              options={subjects.map((subject) => ({
                value: subject.id,
                label: `${subject.code} - ${subject.name}`,
              }))}
            />
          </Form.Item>

          {/* 3. Class Selection (enabled after batch) */}
          <Form.Item
            name="classNo"
            label={t(LOCALE_KEYS.CLASS_NO)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CLASS_NO) }),
              },
            ]}
          >
            <Select
              placeholder={
                selectedSemesterId
                  ? t(LOCALE_KEYS.CLASS_NO, { name: t(LOCALE_KEYS.CLASS_NO) })
                  : t(LOCALE_KEYS.CLASS_NO, { name: t(LOCALE_KEYS.BATCH) }) + ' first'
              }
              showSearch
              disabled={!selectedSemesterId || prefilledFields.classNo}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={attendances.map((attendance) => ({
                value: attendance.classNo,
                label: `${attendance.classNo}`,
              }))}
            />
          </Form.Item>


          {/* 5. Faculty Selection */}
          <Form.Item
            name="facultyId"
            label={t(LOCALE_KEYS.FACULTY)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FACULTY) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}
              showSearch
              disabled={prefilledFields.facultyId}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={faculties.map((faculty) => ({
                value: faculty.id,
                label: `${faculty.employeeCode} - ${faculty.fullName}`,
              }))}
            />
          </Form.Item>
        </Col>

        {/* Right Column - Material Details */}
        <Col xs={24} lg={12}>
          <Form.Item
            name="title"
            label={t(LOCALE_KEYS.TITLE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TITLE) }),
              },
            ]}
          >
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.TITLE) })} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t(LOCALE_KEYS.DESCRIPTION)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) }),
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) })}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label={t(LOCALE_KEYS.TYPE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TYPE) }),
              },
            ]}
          >
            <StatusSelect options={MATERIAL_TYPE_OPTIONS} />
          </Form.Item>

          <Form.Item name="fileId" label={t(LOCALE_KEYS.FILE)}>
            <FileUpload
              fileType={FileType.DOCUMENT}
              fileCategory={FileCategory.ACADEMIC}
              entityType={EntityType.COURSE_MATERIAL}
              entityId={courseMaterialId}
              accept="file/*"
              maxSize={50}
            />
          </Form.Item>

          <Form.Item
            name="isDownloadable"
            label={t(LOCALE_KEYS.IS_DOWNLOADABLE)}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="accessLevel"
            label={t(LOCALE_KEYS.ACCESS_LEVEL)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ACCESS_LEVEL) }),
              },
            ]}
          >
            <StatusSelect options={ACCESS_LEVEL_TYPE_OPTIONS} />
          </Form.Item>
        </Col>
      </Row>

      {/* Action Buttons */}
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

  if (embedded) {
    return formContent;
  }

  return <FormLayoutFull>{formContent}</FormLayoutFull>;
};

export default CourseMaterialForm;
