'use client'

import { ClockCircleOutlined } from '@ant-design/icons'
import { Card, Table, Tag, Empty } from 'antd'

interface ClassSchedule {
  id: string
  batch: string
  day: string
  startTime: string
  endTime: string
  instructor: string
  room: string
  subject: string
}

export default function ClassSchedulesSection() {
  const schedules: ClassSchedule[] = [
    {
      id: '1',
      batch: 'Civil Engineering 2025-A',
      day: 'Monday',
      startTime: '09:00 AM',
      endTime: '10:30 AM',
      instructor: 'Dr. Ahmed Hassan',
      room: 'Room 101',
      subject: 'Structural Analysis',
    },
    {
      id: '2',
      batch: 'Civil Engineering 2025-A',
      day: 'Wednesday',
      startTime: '02:00 PM',
      endTime: '03:30 PM',
      instructor: 'Dr. Fatima Khan',
      room: 'Lab 205',
      subject: 'Materials Testing',
    },
    {
      id: '3',
      batch: 'Electrical Engineering 2025-B',
      day: 'Tuesday',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      instructor: 'Eng. Muhammad Ali',
      room: 'Room 202',
      subject: 'Circuit Design',
    },
    {
      id: '4',
      batch: 'Electrical Engineering 2025-B',
      day: 'Friday',
      startTime: '01:00 PM',
      endTime: '02:30 PM',
      instructor: 'Dr. Zainab Ahmed',
      room: 'Lab 301',
      subject: 'Digital Electronics',
    },
  ]

  const columns = [
    {
      title: 'Batch',
      dataIndex: 'batch',
      key: 'batch',
      render: (text: string) => <span className="font-medium">{text}</span>,
      width: 180,
    },
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      width: 100,
    },
    {
      title: 'Time',
      key: 'time',
      width: 120,
      render: (_: any, record: ClassSchedule) => (
        <span className="text-sm">
          {record.startTime} - {record.endTime}
        </span>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: 150,
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
      width: 150,
    },
    {
      title: 'Location',
      dataIndex: 'room',
      key: 'room',
      width: 100,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
  ]

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-lg" />
          <span>Class Schedules</span>
        </div>
      }
    //   subtitle="Weekly class timetables for active batches"
      className="shadow-sm"
    >
      <Table
        columns={columns}
        dataSource={schedules}
        pagination={false}
        size="small"
        scroll={{ x: 'max-content' }}
        rowClassName="hover:bg-blue-50"
      />
    </Card>
  )
}
