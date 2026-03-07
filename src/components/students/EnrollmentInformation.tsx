'use client'

import { EditOutlined, BookOutlined } from '@ant-design/icons'
import { Card, Row, Col, Divider, Button, Tag } from 'antd'
import React from "react"

import { IStudent } from "@/types/student"

interface EnrollmentInformationProps {
  student: IStudent | null
}

export default function EnrollmentInformation({ student }: EnrollmentInformationProps) {
  const InfoItem = ({ label, value, icon }: { label: string; value: string | React.ReactNode; icon?: React.ReactNode }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-medium text-sm">{value}</div>
    </div>
  )

  const enrollmentDate = student?.admissionDate
    ? new Date(student.admissionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A'

  return (
    <Card
      title="Enrollment Information"
      extra={<Button type="text" size="small" icon={<EditOutlined />} />}
      className="shadow-sm"
      style={{marginBottom:"80px"}}
    >
      <div className="text-xs text-gray-500 mb-6">Academic enrollment details</div>

      <Row gutter={[24, 24]}>
        <Col span={24} sm={12} md={6}>
          <InfoItem
            label="Enrollment Date"
            value={enrollmentDate}
            icon={<BookOutlined className="text-blue-500" />}
          />
        </Col>

        <Col span={24} sm={12} md={6}>
          <InfoItem
            label="Enrollment Type"
            value={
              <Tag color="blue">New</Tag>
            }
          />
        </Col>

        <Col span={24} sm={12} md={6}>
          <InfoItem
            label="Branch"
            value={student?.branch?.name}
          />
        </Col>

        <Col span={24} sm={12} md={6}>
          <InfoItem
            label="Summer Acceleration"
            value={
              <Tag color="default">Not Eligible</Tag>
            }
          />
        </Col>
      </Row>

      <Divider className="my-6" />

      <Row gutter={[24, 24]}>
        <Col span={24} sm={12}>
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h4 className="font-semibold text-sm mb-3 text-blue-900">Program Details</h4>
            <InfoItem
              label="Program"
              value={student?.course?.name}
            />
            <InfoItem
              label="Duration"
              value={`${student?.course?.durationInSemesters} Semesters`}
            />
            <InfoItem
              label="Course Code"
              value={student?.course?.code}
            />
          </div>
        </Col>

        <Col span={24} sm={12}>
          <div className="bg-purple-50 border border-purple-200 rounded p-4">
            <h4 className="font-semibold text-sm mb-3 text-purple-900">Batch Details</h4>
            <InfoItem
              label="Batch Name"
              value={student?.batch?.name}
            />
            <InfoItem
              label="Batch Code"
              value={student?.batch?.code}
            />
            <InfoItem
              label="Academic Year"
              value={student?.batch?.session}
            />
          </div>
        </Col>
      </Row>
    </Card>
  )
}
