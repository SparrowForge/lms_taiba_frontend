'use client';

import { UserOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons';
import { Card, Row, Col, Statistic, Tag, Descriptions, Badge, Space } from 'antd';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

import { useExamResults } from '../../hooks/useExamResults';

import type React from 'react';






const StudentSemesterGrading = () => {
  const {loadSemesterResults, semesterResults} = useExamResults()
  const {user} = useAuth()
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

useEffect(()=>{
  if(user?.student?.id){
    loadSemesterResults({studentId:user?.student?.id})
  }
},[loadSemesterResults, user?.student?.id])

  return (
    <>
      {
        semesterResults.map(data=>(
          <div key={data?.id}>
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
              value={data?.gpa}
              precision={2}
              valueStyle={{ color: '#1890ff', fontSize: '32px' }}
              prefix={<BookOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Statistic
              title="Percentage"
              value={data?.totalPercentage}
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
                  color: getGradeColor(data?.grade),
                  marginTop: '8px',
                }}
              >
                {data?.grade}
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
                  {data.student.firstName} {data.student.lastName} 
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Registration No">
                {data?.student.registrationNo}
              </Descriptions.Item>
              <Descriptions.Item label="Application No">
                {data?.student.applicationNo}
              </Descriptions.Item>
              <Descriptions.Item label="Card No">
                {data?.student.cardNo}
              </Descriptions.Item>
              <Descriptions.Item label="Admission Date">
                <Space>
                  <CalendarOutlined />
                  {new Date(data?.student.admissionDate).toLocaleDateString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={data?.student.status === 'active' ? 'success' : 'default'}
                  text={data?.student.status}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Academic Information" size="small">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Course">
                {data?.course.name}
              </Descriptions.Item>
              <Descriptions.Item label="Course Code">
                {data?.course.code}
              </Descriptions.Item>
              <Descriptions.Item label="Semester">
                {data?.semester.name}
              </Descriptions.Item>
              <Descriptions.Item label="Semester Term">
                Term {data?.semester.termNo}
              </Descriptions.Item>
              <Descriptions.Item label="Batch">
                {data?.batch.name}
              </Descriptions.Item>
              <Descriptions.Item label="Section">
                {data?.section.name}
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
                <Tag color={getStatusColor(data?.status)}>
                  {data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <span style={{ color: '#8c8c8c', fontSize: '12px' }}>Published Date</span>
              <div style={{ marginTop: '8px', fontSize: '14px' }}>
                {new Date(data?.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <div>
              <span style={{ color: '#8c8c8c', fontSize: '12px' }}>Remarks</span>
              <div style={{ marginTop: '8px', fontSize: '14px' }}>
                {data?.remarks || 'No remarks'}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
        ))
      }
    </>
  );
};

export default StudentSemesterGrading;
