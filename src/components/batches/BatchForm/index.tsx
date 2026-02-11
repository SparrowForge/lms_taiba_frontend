'use client';

import { Button, Card, Col, Form, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useBatchFormSections } from '@/hooks/useBatchFormSections';
import { useBatchFormSemesters } from '@/hooks/useBatchFormSemesters';
import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useLocalization } from '@/hooks/useLocalization';

import { IBatchCreate, IBatchWithSemestersCreate } from '@/types/batch';
import { getErrorMessage } from '@/types/errors';

import BatchBasicFormFields from './BatchBasicFormFields';
import BatchSectionsCard from './BatchSectionsCard';
import BatchSemestersCard from './BatchSemestersCard';
import type { ISemesterFormData } from './types';

const { Text } = Typography;

export interface IBatchFormData extends IBatchCreate {
  duration?: number;
}

export interface BatchFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

export default function BatchForm({
  onSuccess,
  onCancel,
  embedded = false,
}: BatchFormProps) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createBatch, createBatchWithSemesters, actionStatus } = useBatches();
  const { courses, loadCourses } = useCourses();

  const semesterState = useBatchFormSemesters(form, { courses });
  const {
    selectedCourse,
    semesters,
    showSemesterSection,
    getCourseDurationMonths,
    handleCourseChange,
    updateSemester,
    handleStartDateChange,
    resetSemesters,
  } = semesterState;

  const { sections, addSection, removeSection, updateSection, resetSections } =
    useBatchFormSections();

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
  }, [loadCourses]);

  useEffect(() => {
    form.resetFields();
    resetSemesters();
    resetSections();
  }, [form, resetSemesters, resetSections]);

  const handleSubmit = async (values: Partial<IBatchFormData>) => {
    try {
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

      if (!embedded && semesters.length > 0) {
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

          const semesterData = validSemesters.map((semester: ISemesterFormData) => ({
            name: semester.name,
            termNo: semester.termNo,
            startDate: semester.startDate,
            endDate: semester.endDate,
            status: semester.status,
            remarks: semester.remarks,
            isBreak: semester.isBreak,
            creditHours: semester.creditHours,
          }));

          const validSections = sections.filter(
            (s) => (s.name ?? '').trim() && (s.code ?? '').trim(),
          );
          const sectionData = validSections.map((s) => ({
            name: s.name.trim(),
            code: s.code.trim(),
            status: s.status,
            remarks: s.remarks ?? '',
          }));

          const batchWithSemestersData: IBatchWithSemestersCreate = {
            batch: payload as IBatchCreate,
            semesters: semesterData,
            sections: sectionData,
          };
          await createBatchWithSemesters(batchWithSemestersData);

          const sectionMsg =
            sectionData.length > 0 ? ` and ${sectionData.length} section(s)` : '';
          toast.success(
            `${entityName} created successfully with ${validSemesters.length} semesters${sectionMsg}`,
          );
      } else {
        await createBatch(payload as IBatchCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
      }

      if (onSuccess) onSuccess();
      else router.push('/batches');
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to create ${entityName.toLowerCase()}`,
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

  const getSubmitText = () => t(LOCALE_KEYS.CREATE_NAME, { name: entityName });

  const loading = actionStatus.status === Status.LOADING;

  const batchFormContent = (
    <BatchBasicFormFields
      form={form}
      initialValues={undefined}
      courses={courses.map((c) => ({ id: c.id, name: c.name }))}
      selectedCourse={selectedCourse ? { name: selectedCourse.name } : null}
      loading={loading}
      semesters={semesters}
      showSemesterSection={showSemesterSection}
      embedded={embedded}
      entityName={entityName}
      onCourseChange={handleCourseChange}
      onStartDateChange={handleStartDateChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      getSubmitText={getSubmitText}
      loadCourses={() => loadCourses({ page: 1, limit: 100 })}
      t={t}
      hideActions={!embedded}
    />
  );

  if (embedded) return batchFormContent;

  const watched = Form.useWatch(['name', 'duration', 'startDate', 'endDate'], form) as
    | { name?: string; duration?: number; startDate?: unknown; endDate?: unknown }
    | undefined;
  const batchName = watched?.name ?? form.getFieldValue('name') ?? '';
  const duration = watched?.duration ?? form.getFieldValue('duration');
  const startDate = watched?.startDate ?? form.getFieldValue('startDate');
  const endDate = watched?.endDate ?? form.getFieldValue('endDate');

  const showSummary = showSemesterSection && semesters.length > 0;

  return (
    <div
      className="batch-form-single-column"
      style={{
        width: '100%',
        maxWidth: '100%',
        height: 'calc(100vh - 128px)',
        overflowY: 'auto',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      <Card
        size="small"
        style={{
          marginBottom: 24,
          position: 'sticky',
          top: 8,
          zIndex: 10,
        }}
        styles={{ body: { paddingBlock: 12, paddingInline: 16 } }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {showSummary ? (
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <Text strong>Summary: </Text>
              <Text>
                {entityName}: {batchName || 'N/A'}
              </Text>
              <Text> • Course: {selectedCourse?.name ?? 'N/A'}</Text>
              <Text> • Duration: {duration != null ? duration : 'N/A'} months</Text>
              <Text>
                {' '}
                • Start: {startDate ? dayjs(startDate as string).format('YYYY-MM-DD') : 'N/A'}
              </Text>
              <Text>
                {' '}
                • End: {endDate ? dayjs(endDate as string).format('YYYY-MM-DD') : 'N/A'}
              </Text>
              <Text> • Semesters: {semesters.length}</Text>
              <Text> • Sections: {sections.length}</Text>
              {sections.length > 0 && (
                <Text type="secondary">
                  {' '}
                  ({sections.filter((s) => (s.name ?? '').trim() && (s.code ?? '').trim()).length}{' '}
                  with name & code)
                </Text>
              )}
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                All semesters will be created with the batch. Sections with name and code will be
                included.
              </Text>
            </div>
          ) : (
            <div />
          )}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Button onClick={handleCancel} disabled={loading}>
              {t(LOCALE_KEYS.CANCEL)}
            </Button>
            <Button type="primary" loading={loading} onClick={() => form.submit()}>
              {getSubmitText()}
            </Button>
          </div>
        </div>
      </Card>
      <Row gutter={[24, 24]} justify="start">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
            style={{ width: '100%' }}
          >
            {batchFormContent}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <BatchSectionsCard
            sections={sections}
            onAddSection={addSection}
            onRemoveSection={removeSection}
            onUpdateSection={updateSection}
            t={t}
          />
        </Col>
        {showSemesterSection && (
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <BatchSemestersCard
              semesters={semesters}
              selectedCourse={selectedCourse}
              getCourseDurationMonths={getCourseDurationMonths}
              onUpdateSemester={updateSemester}
              t={t}
            />
          </Col>
        )}
      </Row>
    </div>
  );
}
