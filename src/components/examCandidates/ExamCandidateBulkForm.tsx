'use client';

import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { EXAM_CANDIDATE_STATUS_OPTIONS } from '@/constants/statusOptions';


import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useExamCandidates } from '@/hooks/useExamCandidates';
import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { ICreateExamCandidateBulk } from '@/types/examCandidate';

function ExamCandidateBulkForm() {
  const { t } = useLocalization();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [studentStatuses, setStudentStatuses] = useState<Record<number, string>>({});
  const [selectAllStatus, setSelectAllStatus] = useState<string>('allowed');

  const { courses, loadCourses } = useCourses();
  const { batches, loadBatches } = useBatches();
  const { exams, loadExams } = useExams();
  const { students, loadStudents, listStatus } = useStudents();
  const { actionStatus, createExamCandidateBulk } = useExamCandidates();

  useEffect(() => {
    // Load courses on component mount
    loadCourses({ page: 1, limit: 100 });
  }, [loadCourses]);

  useEffect(() => {
    // Load batches when course is selected
    if (selectedCourseId) {
      loadBatches({ page: 1, limit: 100, courseId: selectedCourseId });
      // Reset batch and exam selection when course changes
      setSelectedBatchId(null);
      setSelectedExamId(null);
    }
  }, [selectedCourseId, loadBatches]);

  useEffect(() => {
    // Load exams when course is selected
    if (selectedCourseId) {
      loadExams({ page: 1, limit: 100, courseId: selectedCourseId });
    }
  }, [selectedCourseId, loadExams]);

  useEffect(() => {
    // Load students when batch is selected
    if (selectedBatchId) {
      loadStudents({ page: 1, limit: 100, batchId: selectedBatchId });
    }
  }, [selectedBatchId, loadStudents]);

  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
  };

  const handleBatchChange = (batchId: number) => {
    setSelectedBatchId(batchId);
  };

  const handleExamChange = (examId: number) => {
    setSelectedExamId(examId);
  };

  const handleStatusChange = (studentId: number, status: string) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSelectAllChange = (status: string) => {
    setSelectAllStatus(status);
    // Apply the status to all students
    const newStatuses: Record<number, string> = {};
    students.forEach((student) => {
      newStatuses[student.id] = status;
    });
    setStudentStatuses(newStatuses);
  };

  const handleSubmit = async () => {
    if (!selectedExamId) {
      console.error('Please select an exam first');
      return;
    }

    if (students.length === 0) {
      console.error('No students selected');
      return;
    }

    try {
      const candidates = students.map((student) => ({
        studentId: student.id,
        rollNo: student.registrationNo,
        status: (studentStatuses[student.id] || 'allowed') as any,
      }));

      const submitData: ICreateExamCandidateBulk = {
        examId: selectedExamId,
        candidates: candidates,
      };

      console.log('Submit Data:', JSON.stringify(submitData, null, 2));

      // Call the hook method instead of service directly
      await createExamCandidateBulk(submitData);

      // Reset form after successful submission
      setStudentStatuses({});
      setSelectAllStatus('allowed');
    } catch (error) {
      console.error('Error creating exam candidates:', error);
    }
  };

  return (
    <div>
      <Card style={{ margin: '8px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t(LOCALE_KEYS.COURSE)}
            </label>
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_COURSE)}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={courses.map((course) => ({
                value: course.id,
                label: course.name,
              }))}
              value={selectedCourseId}
              onChange={handleCourseChange}
              style={{ width: '100%' }}
            />
          </Col>

          <Col xs={24} sm={8}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t(LOCALE_KEYS.BATCH)}
            </label>
            <Select
              placeholder={
                selectedCourseId
                  ? t(LOCALE_KEYS.SELECT_BATCH)
                  : t(LOCALE_KEYS.PLEASE_SELECT_COURSE_FIRST)
              }
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={batches.map((batch) => ({
                value: batch.id,
                label: batch.name,
              }))}
              value={selectedBatchId}
              onChange={handleBatchChange}
              disabled={!selectedCourseId}
              style={{ width: '100%' }}
            />
          </Col>

          <Col xs={24} sm={8}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t(LOCALE_KEYS.EXAM)}
            </label>
            <Select
              placeholder={
                selectedCourseId
                  ? t(LOCALE_KEYS.SELECT_EXAM)
                  : t(LOCALE_KEYS.PLEASE_SELECT_COURSE_FIRST)
              }
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={exams.map((exam) => ({
                value: exam.id,
                label: exam.name,
              }))}
              value={selectedExamId}
              onChange={handleExamChange}
              disabled={!selectedCourseId}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ margin: '8px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            {selectedBatchId
              ? `${t(LOCALE_KEYS.STUDENTS)} (${students.length})`
              : t(LOCALE_KEYS.PLEASE_SELECT_BATCH_FIRST)}
          </Typography.Title>

          {selectedBatchId && selectedExamId && students.length > 0 && (
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={actionStatus.status === 'loading'}
            >
              {t(LOCALE_KEYS.SUBMIT)}
            </Button>
          )}
        </div>

        {selectedBatchId && students.length > 0 && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
            }}
          >
            <Typography.Text strong style={{ marginRight: '12px' }}>
              {t(LOCALE_KEYS.SELECT_ALL)}:
            </Typography.Text>
            <Radio.Group
              value={selectAllStatus}
              onChange={(e) => handleSelectAllChange(e.target.value)}
              size="small"
            >
              {EXAM_CANDIDATE_STATUS_OPTIONS.map((option) => (
                <Radio.Button key={option.value} value={option.value} style={{ fontSize: '14px' }}>
                  {t(option.labelKey as any)}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        )}

        {selectedBatchId ? (
          <Spin spinning={listStatus.status === 'loading'}>
            {students.length > 0 ? (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Row gutter={[8, 8]}>
                  {students.map((student) => (
                    <Col key={student.id} xs={24}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          border: '1px solid #f0f0f0',
                          borderRadius: '6px',
                          backgroundColor: '#fafafa',
                          minHeight: '60px',
                        }}
                      >
                        {/* Left: Student Info */}
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                            {student.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Typography.Text strong style={{ fontSize: '13px', display: 'block' }}>
                              {student.name}
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: '11px' }}>
                              {student.registrationNo} • {student.applicationNo}
                            </Typography.Text>
                          </div>
                        </div>

                        {/* Right: Radio Buttons */}
                        <div style={{ marginLeft: '8px' }}>
                          <Radio.Group
                            value={studentStatuses[student.id] || 'allowed'}
                            onChange={(e) => handleStatusChange(student.id, e.target.value)}
                            size="small"
                          >
                            <Space wrap size={[2, 2]}>
                              {EXAM_CANDIDATE_STATUS_OPTIONS.map((option) => (
                                <Radio.Button
                                  key={option.value}
                                  value={option.value}
                                  style={{ fontSize: '14px' }}
                                >
                                  {t(option.labelKey as any)}
                                </Radio.Button>
                              ))}
                            </Space>
                          </Radio.Group>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <Empty
                description={t(LOCALE_KEYS.NO_STUDENTS_FOUND)}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Spin>
        ) : (
          <Empty
            description={t(LOCALE_KEYS.PLEASE_SELECT_BATCH_FIRST)}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}

export default ExamCandidateBulkForm;
