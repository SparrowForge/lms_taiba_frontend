'use client'

import { Calendar, } from 'antd'
import dayjs from 'dayjs'

import type { Dayjs } from 'dayjs'

interface MonthEvent {
  id: string
  title: string
  date: string
  type: string
  color: string
}

interface MonthCalendarViewProps {
  currentDate: any
}

export default function MonthCalendarView({
  currentDate,
}: MonthCalendarViewProps) {
  const mockEvents: MonthEvent[] = [
    {
      id: '1',
      title: 'Civil Engineering Batch 2025-A - Midterm E...',
      date: '2026-02-24',
      type: 'Midterm Exam',
      color: '#ff7a45',
    },
    {
      id: '2',
      title: 'Civil Engineering Batch 2025-A - Midterm E...',
      date: '2026-02-25',
      type: 'Midterm Exam',
      color: '#ff7a45',
    },
    {
      id: '3',
      title: 'Civil Engineering Batch 2025-A - Midterm E...',
      date: '2026-02-26',
      type: 'Midterm Exam',
      color: '#ff7a45',
    },
    {
      id: '4',
      title: 'Civil Engineering Batch 2025-A - Midterm E...',
      date: '2026-02-27',
      type: 'Midterm Exam',
      color: '#ff7a45',
    },
    {
      id: '5',
      title: 'Civil Engineering Batch 2025-A - Midterm E...',
      date: '2026-02-28',
      type: 'Midterm Exam',
      color: '#ff7a45',
    },
  ]

  const getDateEvents = (date: Dayjs) => {
    return mockEvents.filter((event) =>
      dayjs(event.date).isSame(date, 'day')
    )
  }

  const dateCellRender = (date: Dayjs) => {
    const events = getDateEvents(date)

    if (events.length === 0) {
      return null
    }

    return (
      <div className="space-y-1">
        {events.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className="text-xs px-1 py-0.5 rounded truncate text-white"
            style={{ backgroundColor: event.color }}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
        {events.length > 2 && (
          <div className="text-xs text-gray-600">
            +{events.length - 2} more
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white">
      <Calendar
        fullscreen={true}
        value={currentDate}
        dateCellRender={dateCellRender}
      />
    </div>
  )
}
