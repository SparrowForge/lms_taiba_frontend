'use client'

import { Calendar } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { useEffect } from 'react'

import { useEventTypes } from '@/hooks/useEventTypes'

import { IClassSchedule } from '@/types/classSchedule'
import { IEvent } from '@/types/event'
import { IExam } from '@/types/exam'

dayjs.extend(isBetween)
dayjs.extend(utc)

interface MonthCalendarViewProps {
  currentDate: Dayjs
  events: IEvent[]
  exams: IExam[]
  classSchedules: IClassSchedule[]
}

export default function MonthCalendarView({
  currentDate,
  events,
  exams,
  classSchedules
}: MonthCalendarViewProps) {
  const { eventTypes, loadEventTypes } = useEventTypes()

  useEffect(() => {
    loadEventTypes({ page: 1, limit: 99 })
  }, [loadEventTypes])

  // ✅ Safe + timezone correct
  const getDateEvents = (date: Dayjs) => {
    if (!date) return []

    return events.filter((event) => {
      const start = dayjs.utc(event.startAt).local().startOf('day')
      const end = dayjs.utc(event.endAt).local().endOf('day')

      return date.isBetween(start, end, 'day', '[]')
    })
  }

  // ✅ Filter class schedules for a specific date
  const getDateSchedules = (date: Dayjs) => {
    return classSchedules.filter((schedule) => {
      const scheduleDayNumber = schedule.weekDay?.dayNumber
      const dayNumber = date.day() === 0 ? 7 : date.day() // Sunday=0 -> adjust to 7

      if (scheduleDayNumber !== dayNumber) return false

      const startDate = dayjs(schedule.startDate)
      const endDate = dayjs(schedule.endDate)

      return date.isBetween(startDate, endDate, 'day', '[]')
    })
  }

  const renderCell = (date: Dayjs) => {
    const dateEvents = getDateEvents(date)
    const dateSchedules = getDateSchedules(date)

    return (
      <div className="space-y-1 min-h-[60px]">
        {/* Render class schedules first */}
        {dateSchedules.slice(0, 2).map((schedule) => (
          <div
            key={`schedule-${schedule.id}-${date.format('YYYY-MM-DD')}`}
            className="text-xs px-1 py-0.5 rounded truncate text-white bg-blue-500"
            title={`${schedule.subject?.name} - ${schedule.faculty?.fullName} (${schedule.timeSlot?.name})`}
          >
            {schedule.subject?.name} ({schedule.timeSlot?.name})
          </div>
        ))}

        {/* If more than 2 schedules, show '+N more' */}
        {dateSchedules.length > 2 && (
          <div className="text-xs text-gray-600 font-medium">
            +{dateSchedules.length - 2} more
          </div>
        )}

        {/* Render events */}
        {dateEvents.slice(0, 2).map((event) => {
          const typeInfo = eventTypes?.[event.eventTypeId] || {
            label: 'Other',
            color: '#808080',
          }

          return (
            <div
              key={`event-${event.id}-${date.format('YYYY-MM-DD')}`}
              className="text-xs px-1 py-0.5 rounded truncate text-white"
              style={{ backgroundColor: typeInfo.color }}
              title={event.name}
            >
              {event.name}
            </div>
          )
        })}

        {/* If more than 2 events, show '+N more' */}
        {dateEvents.length > 2 && (
          <div className="text-xs text-gray-600 font-medium">
            +{dateEvents.length - 2} more
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white">
      <Calendar
        fullscreen
        value={currentDate}
        cellRender={(date) => renderCell(date)}
      />
    </div>
  )
}
