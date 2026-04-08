'use client'

import { CalendarOutlined } from '@ant-design/icons'
import { Card, List, Tag, Badge, Space } from 'antd'
import dayjs from 'dayjs'

interface UpcomingEvent {
  id: string
  title: string
  type: string
  date: string
  batch?: string
  typeColor: string
  icon?: string
}

export default function UpcomingEventsSection() {
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Midterm Examinations Start',
      type: 'Midterm Exam',
      date: '2026-02-24',
      batch: 'Civil Engineering 2025-A',
      typeColor: '#ff7a45',
    },
    {
      id: '2',
      title: 'Grade Deadline - First Midterm',
      type: 'Grade Deadline',
      date: '2026-03-05',
      typeColor: '#13c2c2',
    },
    {
      id: '3',
      title: 'Add/Drop Deadline',
      type: 'Classes Start',
      date: '2026-03-10',
      typeColor: '#faad14',
    },
    {
      id: '4',
      title: 'Final Exam Period Begins',
      type: 'Final Exam',
      date: '2026-04-15',
      batch: 'All Batches',
      typeColor: '#ff4d4f',
    },
    {
      id: '5',
      title: 'Spring Holidays',
      type: 'Holiday',
      date: '2026-04-25',
      typeColor: '#52c41a',
    },
    {
      id: '6',
      title: 'Grade Submission Deadline',
      type: 'Grade Deadline',
      date: '2026-05-10',
      typeColor: '#13c2c2',
    },
    {
      id: '7',
      title: 'Semester End',
      type: 'Classes Start',
      date: '2026-05-20',
      typeColor: '#722ed1',
    },
  ]

  const getDaysUntil = (date: string) => {
    const target = dayjs(date)
    const today = dayjs()
    const diff = target.diff(today, 'day')
    return diff
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-lg" />
          <span>Upcoming Events</span>
        </div>
      }
      className="shadow-sm"
    >
      <List
        dataSource={upcomingEvents}
        renderItem={(event) => {
          const daysUntil = getDaysUntil(event.date)
          const isUrgent = daysUntil <= 7 && daysUntil >= 0

          return (
            <List.Item
              key={event.id}
              className={`border-b pb-3 mb-3 ${
                isUrgent ? 'bg-orange-50 px-3 py-2 rounded' : ''
              }`}
            >
              <List.Item.Meta
                avatar={
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: event.typeColor }}
                  />
                }
                title={
                  <Space size="small" wrap>
                    <span className="font-semibold text-gray-900">
                      {event.title}
                    </span>
                    <Tag
                      color={event.typeColor}
                      style={{ color: event.typeColor }}
                    >
                      {event.type}
                    </Tag>
                    {isUrgent && daysUntil <= 3 && (
                      <Badge count="Urgent" style={{ backgroundColor: '#ff7a45' }} />
                    )}
                  </Space>
                }
                description={
                  <div className="text-xs text-gray-600 mt-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CalendarOutlined className="text-xs" />
                        {dayjs(event.date).format('MMM DD, YYYY')}
                      </span>
                      {daysUntil >= 0 && (
                        <span className="text-xs font-medium text-orange-600">
                          {daysUntil === 0
                            ? 'Today'
                            : daysUntil === 1
                              ? 'Tomorrow'
                              : `In ${daysUntil} days`}
                        </span>
                      )}
                    </div>
                    {event.batch && (
                      <div className="mt-1 text-gray-500">{event.batch}</div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )
        }}
      />
    </Card>
  )
}
