'use client';

import { Card } from 'antd'
import React from 'react'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
}

const StudentAcademicStatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <Card className="stat-card" bordered={false}>
    <div className="flex items-start justify-between flex-wrap gap-2">
      <div className="flex-1">
        <div className="text-gray-600 text-sm mb-2">{title}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="text-2xl text-orange-500 ml-4">{icon}</div>
    </div>

    <style jsx>{`
      :global(.stat-card) {
        border: 1px solid #f0f0f0 !important;
        border-radius: 8px !important;
        background: white !important;
      }

      :global(.stat-card:hover) {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
          0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02) !important;
      }
    `}</style>
  </Card>
)

export default StudentAcademicStatCard
