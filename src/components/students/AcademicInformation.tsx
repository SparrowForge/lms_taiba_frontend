'use client'

import { Card, Table, Statistic, Row, Col } from 'antd'
import { BookOutlined } from '@ant-design/icons'

interface AcademicInformationProps {
  student?: any
}

export default function AcademicInformation({ student }: AcademicInformationProps) {
  const columns = [
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center' as const,
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      align: 'center' as const,
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      key: 'gpa',
      align: 'center' as const,
    },
  ]

  const data = [
    {
      key: '1',
      semester: 'Semester 1',
      courseCode: 'DS-101',
      courseName: 'Introduction to Data Science',
      credits: 3,
      grade: 'A',
      gpa: 4.0,
    },
    {
      key: '2',
      semester: 'Semester 1',
      courseCode: 'DS-102',
      courseName: 'Programming Fundamentals',
      credits: 4,
      grade: 'A-',
      gpa: 3.7,
    },
    {
      key: '3',
      semester: 'Semester 1',
      courseCode: 'DS-103',
      courseName: 'Mathematics for Data Science',
      credits: 3,
      grade: 'B+',
      gpa: 3.3,
    },
  ]

  return (
    <div className="space-y-6 mb-6">
      <Row gutter={[16, 16]}>
        <Col span={24} sm={12} md={6}>
          <Statistic
            title="Current Semester"
            value={1}
            prefix={<BookOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={24} sm={12} md={6}>
          <Statistic
            title="Cumulative GPA"
            value={3.42}
            precision={2}
            valueStyle={{ color: '#ff7a45' }}
          />
        </Col>
        <Col span={24} sm={12} md={6}>
          <Statistic
            title="Total Credits"
            value={10}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={24} sm={12} md={6}>
          <Statistic
            title="Credits Completed"
            value={10}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
      </Row>

      <Card title="Course History" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}
