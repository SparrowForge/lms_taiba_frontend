'use client';

import { UserOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons';
import { Card, Row, Col, Statistic, Tag, Descriptions, Badge, Space } from 'antd';

import type React from 'react';

interface StudentGradeData {
  id: number;
  studentId: number;
  semesterId: number;
  courseId: number;
  batchId: number;
  sectionId: number;
  gpa: number;
  totalPercentage: number;
  grade: string;
  status: string;
  remarks: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  student: {
    id: number;
    userId: number;
    applicationNo: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    cardNo: string;
    registrationNo: string;
    admissionDate: string;
    courseId: number;
    batchId: number;
    sectionId: number;
    branchId: number;
    feeStructureId: number;
    referenceNo: string;
    fileIds: any[];
    admissionSource: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  semester: {
    id: number;
    batchId: number;
    name: string;
    code: string | null;
    termNo: number;
    startDate: string;
    endDate: string;
    status: string;
    isBreak: boolean;
    remarks: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  course: {
    id: number;
    departmentId: number;
    name: string;
    code: string;
    courseTypeId: number;
    scheduleTypeId: number;
    durationInSemesters: number;
    description: string;
    status: string;
    remarks: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  batch: {
    id: number;
    courseId: number;
    name: string;
    code: string;
    academicYear: number;
    session: string;
    intakeCapacity: number;
    startDate: string;
    endDate: string;
    status: string;
    remarks: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  section: {
    id: number;
    batchId: number;
    name: string;
    code: string;
    status: string;
    remarks: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

interface StudentGradeCardProps {
  data: StudentGradeData;
}

const data = {
  id: 1,
  studentId: 19,
  semesterId: 19,
  courseId: 11,
  batchId: 10,
  sectionId: 4,
  gpa: 3.7,
  totalPercentage: 88,
  grade: "A",
  status: "published",
  remarks: null,
  publishedAt: "2026-01-26T12:52:52.857Z",
  createdAt: "2026-01-26T12:52:52.857Z",
  updatedAt: "2026-01-26T12:52:52.857Z",
  deletedAt: null,
  student: {
    id: 19,
    userId: 18,
    applicationNo: "APP-AI-AN-001",
    firstName: "Ahnaf",
    middleName: null,
    lastName: "Nabil",
    cardNo: "CARD-AI-AN-001",
    registrationNo: "REG-AI-AN-001",
    admissionDate: "2026-01-19",
    courseId: 11,
    batchId: 10,
    sectionId: 4,
    branchId: 6,
    feeStructureId: 12,
    referenceNo: "N/A",
    fileIds: [],
    admissionSource: "online_registration",
    status: "active",
    createdAt: "2026-01-20T15:37:23.093Z",
    updatedAt: "2026-01-20T15:46:37.172Z",
    deletedAt: null,
  },
  semester: {
    id: 19,
    batchId: 10,
    name: "Level 1 2026",
    code: null,
    termNo: 1,
    startDate: "2025-12-31",
    endDate: "2026-03-31",
    status: "active",
    isBreak: false,
    remarks: "",
    createdAt: "2026-01-20T15:22:04.128Z",
    updatedAt: "2026-01-20T15:22:04.128Z",
    deletedAt: null,
  },
  course: {
    id: 11,
    departmentId: 9,
    name: "Artificial Intelligence",
    code: "AI-001",
    courseTypeId: 6,
    scheduleTypeId: 3,
    durationInSemesters: 4,
    description: "Description",
    status: "active",
    remarks: null,
    createdAt: "2026-01-20T15:18:31.933Z",
    updatedAt: "2026-01-20T15:18:31.933Z",
    deletedAt: null,
  },
  batch: {
    id: 10,
    courseId: 11,
    name: "Spring-2026-AI",
    code: "SP-26-AI",
    academicYear: 2025,
    session: "2025-2026",
    intakeCapacity: 50,
    startDate: "2025-12-31",
    endDate: "2026-12-31",
    status: "active",
    remarks: "Remraks",
    createdAt: "2026-01-20T15:22:04.128Z",
    updatedAt: "2026-01-20T15:22:04.128Z",
    deletedAt: null,
  },
  section: {
    id: 4,
    batchId: 10,
    name: "Neptune",
    code: "NEP-001",
    status: "active",
    remarks: "remarks",
    createdAt: "2026-01-20T15:23:05.886Z",
    updatedAt: "2026-01-20T15:23:05.886Z",
    deletedAt: null,
  },
}

const StudentSemesterGrading = () => {
  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: '#52c41a',
      B: '#1890ff',
      C: '#faad14',
      D: '#ff7a45',
      F: '#f5222d',
    };
    return colors[grade] || '#8c8c8c';
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'success' : 'processing';
  };

  const fullName = `${data.student.firstName}${data.student.middleName ? ` ${data.student.middleName}` : ''} ${data.student.lastName}`;

  return (
    <div >
      <Card
        style={{
          marginBottom: '24px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Statistic
              title="GPA"
              value={data.gpa}
              precision={2}
              valueStyle={{ color: '#1890ff', fontSize: '32px' }}
              prefix={<BookOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Statistic
              title="Percentage"
              value={data.totalPercentage}
              suffix="%"
              valueStyle={{ color: '#52c41a', fontSize: '32px' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div>
              <span style={{ color: '#8c8c8c', fontSize: '14px' }}>Grade</span>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: getGradeColor(data.grade),
                  marginTop: '8px',
                }}
              >
                {data.grade}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Student Information" size="small">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Name">
                <Space>
                  <UserOutlined />
                  {fullName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Registration No">
                {data.student.registrationNo}
              </Descriptions.Item>
              <Descriptions.Item label="Application No">
                {data.student.applicationNo}
              </Descriptions.Item>
              <Descriptions.Item label="Card No">
                {data.student.cardNo}
              </Descriptions.Item>
              <Descriptions.Item label="Admission Date">
                <Space>
                  <CalendarOutlined />
                  {new Date(data.student.admissionDate).toLocaleDateString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={data.student.status === 'active' ? 'success' : 'default'}
                  text={data.student.status}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Academic Information" size="small">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Course">
                {data.course.name}
              </Descriptions.Item>
              <Descriptions.Item label="Course Code">
                {data.course.code}
              </Descriptions.Item>
              <Descriptions.Item label="Semester">
                {data.semester.name}
              </Descriptions.Item>
              <Descriptions.Item label="Semester Term">
                Term {data.semester.termNo}
              </Descriptions.Item>
              <Descriptions.Item label="Batch">
                {data.batch.name}
              </Descriptions.Item>
              <Descriptions.Item label="Section">
                {data.section.name}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }} title="Grade Status" size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div>
              <span style={{ color: '#8c8c8c', fontSize: '12px' }}>Status</span>
              <div style={{ marginTop: '8px' }}>
                <Tag color={getStatusColor(data.status)}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <span style={{ color: '#8c8c8c', fontSize: '12px' }}>Published Date</span>
              <div style={{ marginTop: '8px', fontSize: '14px' }}>
                {new Date(data.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <div>
              <span style={{ color: '#8c8c8c', fontSize: '12px' }}>Remarks</span>
              <div style={{ marginTop: '8px', fontSize: '14px' }}>
                {data.remarks || 'No remarks'}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StudentSemesterGrading;
