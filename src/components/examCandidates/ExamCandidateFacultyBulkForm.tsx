'use client';

import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Radio,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { EXAM_CANDIDATE_STATUS_OPTIONS } from '@/constants/statusOptions';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useExamCandidates } from '@/hooks/useExamCandidates';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { getErrorMessage } from '@/types/errors';
import { IExam } from '@/types/exam';
import { ICreateExamCandidateBulk } from '@/types/examCandidate';

interface ExamCandidateFormProps {
  response: IExam
}

function ExamCandidateFacultyBulkForm({ response }: ExamCandidateFormProps) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });
  const [studentStatuses, setStudentStatuses] = useState<Record<number, string>>({});
  const [selectAllStatus, setSelectAllStatus] = useState<string>('allowed');
  const router = useRouter()
  const { selectedCourse, loadCourse } = useCourses();
  const { selectedBatch, loadBatch } = useBatches();
  const { students, loadStudents, listStatus } = useStudents();
  const { actionStatus, createExamCandidateBulk } = useExamCandidates();

  const searchParams = useSearchParams()
  const batchId = searchParams.get("batchId")



  useEffect(() => {
    if (batchId) {
      loadBatch(Number(batchId))
    };
  }, [loadBatch, batchId]);

  useEffect(() => {
    if (selectedBatch) {
      loadCourse(Number(selectedBatch?.course.id));
    }

  }, [loadCourse, selectedBatch]);


  useEffect(() => {
    if (selectedBatch?.id) {
      loadStudents({ page: 1, limit: 100, batchId: selectedBatch?.id });
    }
  }, [selectedBatch?.id, loadStudents]);



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
    if (!response.id) {
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
        status: (studentStatuses[student.id] || 'allowed') as any,
      }));

      const submitData: ICreateExamCandidateBulk = {
        examId: response.id,
        candidates
      };
      await createExamCandidateBulk(submitData);
      toast.success('Successfully created exam candidates.');
      router.push('/dashboard/course')

      setStudentStatuses({});
      setSelectAllStatus('allowed');

    } catch (error: unknown) {
      console.log("error", error)
    }
  };




  return (
    <div>
      <Card style={{ margin: '8px' }}>
        <Row gutter={[16, 16]}>

          <Col xs={24} sm={8}>
            <p className="font-semibold text-lg">Course: {selectedCourse?.name}</p>
          </Col>


          <Col xs={24} sm={8}>
            <p className="font-semibold text-lg">Batch: {selectedBatch?.name}</p>
          </Col>

          <Col xs={24} sm={8}>
            <p className="font-semibold text-lg">Exam: {response?.name}</p>
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
            {selectedBatch?.id
              ? `${t(LOCALE_KEYS.STUDENTS)} (${students.length})`
              : t(LOCALE_KEYS.PLEASE_SELECT_BATCH_FIRST)}
          </Typography.Title>

          {selectedBatch?.id && response.id && students.length > 0 && (
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={actionStatus.status === 'loading'}
            >
              {t(LOCALE_KEYS.SUBMIT)}
            </Button>
          )}
        </div>

        {selectedBatch?.id && students.length > 0 && (
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

        {selectedBatch?.id ? (
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
                            {student.firstName.charAt(0).toUpperCase()}
                          </Avatar>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Typography.Text strong style={{ fontSize: '13px', display: 'block' }}>
                              {student.firstName} {student.lastName}
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

export default ExamCandidateFacultyBulkForm;
