'use client'

import { UserOutlined, FileTextOutlined, BookOutlined, DollarOutlined, BarChartOutlined, CalendarOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import React from "react"


interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export default function ProfileTabs({ activeTab, onTabChange, children }: ProfileTabsProps) {
  const tabs = [
    {
      key: 'personal',
      label: 'Personal',
      icon: <UserOutlined />,
    },
    {
      key: 'guardian',
      label: 'Guardian',
      icon: <TeamOutlined />,
    },
    {
      key: 'previous-data',
      label: 'Previous',
      icon: <FileTextOutlined />,
    },
    {
      key: 'documents',
      label: 'Documents',
      icon: <FileOutlined />,
    },
    {
      key: 'academic',
      label: 'Academic',
      icon: <BookOutlined />,
    },
    {
      key: 'fees',
      label: 'Fees',
      icon: <DollarOutlined />,
    },
    {
      key: 'grades',
      label: 'Grades',
      icon: <BarChartOutlined />,
    },
    {
      key: 'attendance',
      label: 'Attendance',
      icon: <CalendarOutlined />,
    },
    {
      key: 'activity',
      label: 'Activity',
      icon: <UserOutlined />,
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        className="mb-6 profile-tabs-full"
        items={tabs.map(tab => ({
          key: tab.key,
          label: (
            <div className="flex  items-center justify-center gap-1">
              <span className="text-sm">{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </div>
          ),
        }))}
      />

      <style jsx global>{`
        .profile-tabs-full .ant-tabs-nav-list {
          display: flex !important;
          justify-content:  space-between !important;
          width: 100%;
        }

        .profile-tabs-full .ant-tabs-tab {
          flex: 1 1 0%;
          text-align: center;
        }
      `}</style>
    </div>

  )
}
