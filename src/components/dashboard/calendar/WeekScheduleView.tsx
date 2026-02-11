'use client'

import { Table } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { useEffect, useMemo } from 'react'

import { useEventTypes } from '@/hooks/useEventTypes'

import { IClassSchedule } from '@/types/classSchedule'
import { IEvent } from '@/types/event'
import { IExam } from '@/types/exam'

dayjs.extend(isBetween)
dayjs.extend(utc)

interface WeekScheduleViewProps {
  currentDate: Dayjs
  events: IEvent[]
  exams: IExam[]
  classSchedules: IClassSchedule[]
}

export default function WeekScheduleView({
  currentDate,
  events,
  exams,
  classSchedules
}: WeekScheduleViewProps) {
  const { eventTypes, loadEventTypes } = useEventTypes()

  useEffect(() => {
    loadEventTypes({ page: 1, limit: 99 })
  }, [loadEventTypes])

  const times = [
    '7AM',
    '8AM',
    '9AM',
    '10AM',
    '11AM',
    '12PM',
    '1PM',
    '2PM',
    '3PM',
    '4PM',
    '5PM',
    '6PM',
  ]

  // Start of week (Sunday)
  const weekStart = currentDate.startOf('week')

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day')),
    [weekStart]
  )

  // ✅ Correct multi-day + timezone-safe logic for events
  const getEventsForDay = (date: Dayjs) => {
    return events.filter((event) => {
      const start = dayjs.utc(event.startAt).local().startOf('day')
      const end = dayjs.utc(event.endAt).local().endOf('day')

      return date.isBetween(start, end, 'day', '[]')
    })
  }

  // ✅ Filter class schedules for a specific day and time
  const getClassSchedulesForDay = (date: Dayjs, time: string) => {
    return classSchedules.filter((schedule) => {
      const scheduleDayNumber = schedule.weekDay?.dayNumber
      const dayNumber = date.day() === 0 ? 7 : date.day() // Sunday=0, adjust if your data uses 1-7

      if (scheduleDayNumber !== dayNumber) return false

      const slotTime = dayjs(schedule.timeSlot?.startTime, 'HH:mm:ss')
      const cellTime = dayjs(time, ['hA']) // Convert table time to dayjs

      // Check if hour matches (rough check)
      return slotTime.hour() === cellTime.hour()
    })
  }

  const columns = useMemo(() => {
    return [
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        width: 90,
        fixed: 'left' as const,
        render: (text: string) => (
          <div className="font-semibold text-sm text-gray-700 px-2 py-4">
            {text}
          </div>
        ),
      },
      ...days.map((day) => {
        const isToday = day.isSame(dayjs(), 'day')

        return {
          title: (
            <div className="text-center py-2">
              <div className="text-sm font-semibold text-gray-900">
                {day.format('ddd')}
              </div>
              <div
                className={`text-lg font-bold ${
                  isToday ? 'text-orange-500' : 'text-gray-600'
                }`}
              >
                {day.format('DD')}
              </div>
            </div>
          ),
          dataIndex: `day-${day.format('YYYY-MM-DD')}`,
          key: `day-${day.format('YYYY-MM-DD')}`,
          align: 'center' as const,
          render: (_: any, record: any) => {
            const dayEvents = getEventsForDay(day)
            const daySchedules = getClassSchedulesForDay(day, record.time)

            return (
              <div
                className={`min-h-20 border-r p-2 space-y-1 ${
                  isToday ? 'bg-orange-50' : ''
                }`}
              >
                {/* Render class schedules */}
                {daySchedules.map((schedule) => (
                  <div
                    key={`schedule-${schedule.id}`}
                    className="text-xs px-2 py-1 rounded bg-blue-500 text-white truncate"
                    title={`${schedule.subject?.name} - ${schedule.faculty?.fullName} (${schedule.timeSlot?.name})`}
                  >
                    {schedule.subject?.name} ({schedule.timeSlot?.name})
                  </div>
                ))}

                {/* Render events */}
                {dayEvents.map((event) => {
                  const typeInfo = eventTypes?.[event.eventTypeId] || {
                    label: 'Other',
                    color: '#808080',
                  }

                  return (
                    <div
                      key={`event-${event.id}`}
                      className="text-xs px-2 py-1 rounded text-white truncate"
                      style={{ backgroundColor: typeInfo.color }}
                      title={`${event.name} (${dayjs
                        .utc(event.startAt)
                        .local()
                        .format('DD MMM')} - ${dayjs
                        .utc(event.endAt)
                        .local()
                        .format('DD MMM')})`}
                    >
                      {event.name}
                    </div>
                  )
                })}

                {/* Show placeholder if empty */}
                {daySchedules.length === 0 && dayEvents.length === 0 && (
                  <div className="text-xs text-gray-300">—</div>
                )}
              </div>
            )
          },
        }
      }),
    ]
  }, [days, events, eventTypes, classSchedules])

  const data = times.map((time) => ({
    key: time,
    time,
  }))

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        bordered
        className="antd-week-schedule"
        scroll={{ x: 'max-content' }}
      />

      <style jsx>{`
        :global(.antd-week-schedule .ant-table) {
          border-collapse: collapse;
        }

        :global(.antd-week-schedule .ant-table-cell) {
          padding: 0 !important;
          text-align: center;
          vertical-align: top;
        }
      `}</style>
    </div>
  )
}
