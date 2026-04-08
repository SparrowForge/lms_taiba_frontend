'use client';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Card, Progress, Space } from 'antd'
import React from 'react'

interface DegreeProgressProps {
  completed: number
  total: number
  percentage: number
  inProgress: number
  upcoming: number
}

const StudentAcademicDegreeProgress: React.FC<DegreeProgressProps> = ({
  completed,
  total,
  percentage,
  inProgress,
  upcoming,
}) => {
  const completedCount = completed - inProgress

  return (
    <Card className="degree-progress-card" bordered={false}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Degree Completion Progress</h2>
        <p className="text-gray-600 text-sm mt-2">
          {completed} of {total} credit hours completed
        </p>
      </div>

      <Progress
        percent={percentage}
        strokeColor="#FF7A45"
        trailColor="#D9D9D9"
        style={{ marginBottom: '16px' }}
      />

      <div className="flex items-center gap-6 flex-wrap">
        <Space>
          <CheckCircleOutlined style={{ color: '#52C41A' }} />
          <span className="text-sm text-gray-700">{completedCount} Completed</span>
        </Space>
        <Space>
          <ClockCircleOutlined style={{ color: '#1890FF' }} />
          <span className="text-sm text-gray-700">{inProgress} In Progress</span>
        </Space>
        <Space>
          <ExclamationCircleOutlined style={{ color: '#FAAD14' }} />
          <span className="text-sm text-gray-700">{upcoming} Upcoming</span>
        </Space>
      </div>

      <style jsx>{`
        :global(.degree-progress-card) {
          border: 1px solid #f0f0f0 !important;
          border-radius: 8px !important;
          background: white !important;
        }
      `}</style>
    </Card>
  )
}

export default StudentAcademicDegreeProgress
