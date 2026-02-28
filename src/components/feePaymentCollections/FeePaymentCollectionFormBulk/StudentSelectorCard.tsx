'use client';

import { Button, Card, Col, Row, Select, Typography } from 'antd';
import React from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import { Status } from '@/enums';

import type { IStudentWithFeeInfo } from '@/types/student';
import type { ICourse } from '@/types/course';
import type { IBatch } from '@/types/batch';
import type { IStudent } from '@/types/student';

export interface StudentSelectorCardProps {
  noStudentInParam: boolean;
  studentId: string | null;
  studentWithFeeInfo: IStudentWithFeeInfo | null;
  courses: ICourse[];
  batches: IBatch[];
  students: IStudent[];
  selectedCourseId: number | null;
  setSelectedCourseId: (v: number | null) => void;
  selectedBatchId: number | null;
  setSelectedBatchId: (v: number | null) => void;
  selectedStudentId: number | null;
  setSelectedStudentId: (v: number | null) => void;
  onApplyStudent: () => void;
  studentsLoading: boolean;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

export default function StudentSelectorCard({
  noStudentInParam,
  studentId,
  studentWithFeeInfo,
  courses,
  batches,
  students,
  selectedCourseId,
  setSelectedCourseId,
  selectedBatchId,
  setSelectedBatchId,
  selectedStudentId,
  setSelectedStudentId,
  onApplyStudent,
  studentsLoading,
  t,
}: StudentSelectorCardProps) {
  return (
    <Card
      title={t(LOCALE_KEYS.STUDENT_INFORMATION, { defaultValue: 'Student Information' })}
      style={{ marginBottom: 24 }}
    >
      {noStudentInParam ? (
        <>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
            {studentId
              ? t(LOCALE_KEYS.NOT_FOUND_NAME, { name: t(LOCALE_KEYS.STUDENT) }) +
                ' Select course and batch to choose a student.'
              : 'Select course and batch, then choose a student for fee payment.'}
          </Typography.Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                {t(LOCALE_KEYS.COURSE)} <span style={{ color: 'red' }}>*</span>
              </Typography.Text>
              <Select
                placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
                style={{ width: '100%', marginTop: 8 }}
                allowClear
                value={selectedCourseId ?? undefined}
                onChange={(v) => setSelectedCourseId(v ?? null)}
                showSearch
                optionFilterProp="label"
                options={courses.map((c) => ({ value: c.id, label: c.name }))}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                {t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' })} <span style={{ color: 'red' }}>*</span>
              </Typography.Text>
              <Select
                placeholder={t(LOCALE_KEYS.SELECT_NAME, {
                  name: t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' }),
                })}
                style={{ width: '100%', marginTop: 8 }}
                allowClear
                value={selectedBatchId ?? undefined}
                onChange={(v) => setSelectedBatchId(v ?? null)}
                showSearch
                optionFilterProp="label"
                options={batches.map((b) => ({ value: b.id, label: b.name }))}
                disabled={!selectedCourseId}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                {t(LOCALE_KEYS.STUDENT)} <span style={{ color: 'red' }}>*</span>
              </Typography.Text>
              <Select
                placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.STUDENT) })}
                style={{ width: '100%', marginTop: 8 }}
                allowClear
                value={selectedStudentId ?? undefined}
                onChange={(v) => setSelectedStudentId(v ?? null)}
                showSearch
                optionFilterProp="label"
                options={students.map((s) => ({
                  value: s.id,
                  label: `${s.firstName} ${s.lastName}${s.registrationNo ? ` (${s.registrationNo})` : ''}`,
                }))}
                disabled={!selectedBatchId}
                loading={studentsLoading}
              />
            </Col>
            <Col span={24}>
              <Button type="primary" onClick={onApplyStudent} disabled={!selectedStudentId}>
                Continue
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        studentWithFeeInfo?.student && (
          <Row gutter={16}>
            <Col span={8}>
              <Typography.Text strong>
                {t(LOCALE_KEYS.NAME, { defaultValue: 'Name' })}:
              </Typography.Text>
              <br />
              <Typography.Text>
                {studentWithFeeInfo.student.firstName} {studentWithFeeInfo.student.lastName}
              </Typography.Text>
            </Col>
            <Col span={8}>
              <Typography.Text strong>
                {t(LOCALE_KEYS.APPLICATION_NO, { defaultValue: 'Application No' })}:
              </Typography.Text>
              <br />
              <Typography.Text>{studentWithFeeInfo.student.applicationNo}</Typography.Text>
            </Col>
            <Col span={8}>
              <Typography.Text strong>
                {t(LOCALE_KEYS.REGISTRATION_NO, { defaultValue: 'Registration No' })}:
              </Typography.Text>
              <br />
              <Typography.Text>{studentWithFeeInfo.student.registrationNo}</Typography.Text>
            </Col>
          </Row>
        )
      )}
    </Card>
  );
}
