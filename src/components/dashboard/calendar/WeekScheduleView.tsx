'use client'

import { Table } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { useEffect, useMemo, useState } from 'react'

import { useEventTypes } from '@/hooks/useEventTypes'

import { IClassSchedule } from '@/types/classSchedule'
import { IEvent } from '@/types/event'
import { IExam } from '@/types/exam'

import { ScheduleDetailsDrawer } from '../schedule'

dayjs.extend(isBetween)
dayjs.extend(utc)

interface WeekScheduleViewProps {
  currentDate: Dayjs
  events: IEvent[]
  exams: IExam[]
  classSchedules: IClassSchedule[]
  handleViewDetails: any
}

export default function WeekScheduleView({
  currentDate,
  events,
  exams,
  classSchedules,
  handleViewDetails
}: WeekScheduleViewProps) {
  const { eventTypes, loadEventTypes } = useEventTypes()

  const [selectedSchedule, setSelectedSchedule] =
    useState<IClassSchedule | null>(null)
  const [clickedDate, setClickedDate] = useState<string | undefined>(undefined)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const handleScheduleClick = (schedule: IClassSchedule, date?: string) => {
    setSelectedSchedule(schedule)
    setClickedDate(date)
    setDrawerVisible(true)
  }

  const handleCloseDrawer = () => {
    setDrawerVisible(false)
    setSelectedSchedule(null)
    setClickedDate(undefined)
  }

  useEffect(() => {
    loadEventTypes({ page: 1, limit: 99 })
  }, [loadEventTypes])

  const times = [
    '7AM', '8AM', '9AM', '10AM', '11AM', '12PM',
    '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'
  ]

  // Start of week (Sunday)
  const weekStart = currentDate.startOf('week')

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day')),
    [weekStart]
  )

  // 📅 Events (date range based)
  const getEventsForDay = (date: Dayjs) => {
    return events.filter((event) => {
      const start = dayjs.utc(event.startAt).local().startOf('day')
      const end = dayjs.utc(event.endAt).local().endOf('day')
      return date.isBetween(start, end, 'day', '[]')
    })
  }

  // 📘 Class schedules (weekly recurring)
  const getClassSchedulesForDay = (date: Dayjs, time: string) => {
    return classSchedules.filter((schedule) => {
      const scheduleDayNumber = schedule.weekDay?.dayNumber
      const dayNumber = date.day() === 0 ? 7 : date.day()

      if (scheduleDayNumber !== dayNumber) return false

      const slotTime = dayjs(schedule.timeSlot?.startTime, 'HH:mm:ss')
      const cellTime = dayjs(time, ['hA'])

      return slotTime.hour() === cellTime.hour()
    })
  }

  // 📝 Exams (exact date + hour)
  const getExamsForDayAndTime = (date: Dayjs, time: string) => {
    return exams.filter((exam) => {
      const examDateTime = dayjs.utc(exam.examDatetime).local()
      const cellTime = dayjs(time, ['hA'])

      return (
        examDateTime.isSame(date, 'day') &&
        examDateTime.hour() === cellTime.hour()
      )
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
                className={`text-lg font-bold ${isToday ? 'text-orange-500' : 'text-gray-600'
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
            const dayExams = getExamsForDayAndTime(day, record.time)

            return (
              <div
                className={`min-h-20 border-r p-2 space-y-1 ${isToday ? 'bg-orange-50' : ''
                  }`}
              >

                {daySchedules.map((schedule) => (
                  <div
                    onClick={() =>
                      handleScheduleClick(schedule, day.format('YYYY-MM-DD'))
                    }
                    key={`schedule-${schedule.id}`}
                    className="text-xs px-2 py-1 rounded bg-blue-500 text-white truncate cursor-pointer"
                    title={`${schedule.subject?.name} - ${schedule.timeSlot?.name}`}
                  >
                    {schedule.subject?.name} ({schedule.timeSlot?.name})
                  </div>
                ))}

                {dayExams.map((exam) => (
                  <div
                    onClick={() => handleViewDetails(exam.id)}
                    key={`exam-${exam.id}`}
                    className="text-xs px-2 py-1 rounded bg-red-500 text-white truncate cursor-pointer"
                    title={`${exam.examType?.name} • ${exam.subject?.name}`}
                  >
                    {exam.examType?.name} - {exam.subject?.name}
                  </div>
                ))}


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
                      title={event.name}
                    >
                      {event.name}
                    </div>
                  )
                })}

                {daySchedules.length === 0 &&
                  dayEvents.length === 0 &&
                  dayExams.length === 0 && (
                    <div className="text-xs text-gray-300">—</div>
                  )}
              </div>
            )
          },
        }
      }),
    ]
  }, [days, events, exams, eventTypes, classSchedules])

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

      <ScheduleDetailsDrawer
        schedule={selectedSchedule}
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        clickedDate={clickedDate}
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
