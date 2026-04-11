'use client'

import { Calendar } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'

import { useEventTypes } from '@/hooks/useEventTypes'

import { IClassSchedule } from '@/types/classSchedule'
import { IEvent } from '@/types/event'
import { IExam } from '@/types/exam'

import { ScheduleDetailsDrawer } from '../schedule'

dayjs.extend(isBetween)
dayjs.extend(utc)

interface MonthCalendarViewProps {
  currentDate: Dayjs
  events: IEvent[]
  exams: IExam[]
  classSchedules: IClassSchedule[],
  handleViewDetails: any
}

export default function MonthCalendarView({
  currentDate,
  events,
  exams,
  classSchedules,
  handleViewDetails
}: MonthCalendarViewProps) {
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


  const getDateEvents = (date: Dayjs) => {
    if (!date) return []

    return events.filter((event) => {
      const start = dayjs.utc(event.startAt).local().startOf('day')
      const end = dayjs.utc(event.endAt).local().endOf('day')

      return date.isBetween(start, end, 'day', '[]')
    })
  }


  const getDateSchedules = (date: Dayjs) => {
    return classSchedules.filter((schedule) => {
      const scheduleDayNumber = schedule.weekDay?.dayNumber
      const dayNumber = date.day() === 0 ? 7 : date.day() // Sunday fix

      if (scheduleDayNumber !== dayNumber) return false

      const startDate = dayjs(schedule.startDate)
      const endDate = dayjs(schedule.endDate)

      return date.isBetween(startDate, endDate, 'day', '[]')
    })
  }


  const getDateExams = (date: Dayjs) => {
    return exams.filter((exam) => {
      const examDate = dayjs.utc(exam.examDatetime).local()
      return examDate.isSame(date, 'day')
    })
  }

  const renderCell = (date: Dayjs) => {
    const dateSchedules = getDateSchedules(date)
    const dateExams = getDateExams(date)
    const dateEvents = getDateEvents(date)

    return (
      <div className="space-y-1 min-h-[60px]">

        {dateSchedules.slice(0, 2).map((schedule) => (
          <div
            key={`schedule-${schedule.id}-${date.format('YYYY-MM-DD')}`}
            onClick={() => handleScheduleClick(schedule, date.format('YYYY-MM-DD'))}
            className="text-xs px-1 py-0.5 rounded truncate text-white bg-blue-500 cursor-pointer"
            title={`${schedule.subject?.name} - ${schedule.timeSlot?.name}`}
          >
            {schedule.subject?.name} ({schedule.timeSlot?.name})
          </div>
        ))}

        {dateSchedules.length > 2 && (
          <div className="text-xs text-gray-600 font-medium">
            +{dateSchedules.length - 2} more
          </div>
        )}


        {dateExams.slice(0, 2).map((exam) => (
          <div
            onClick={() => handleViewDetails(exam.id)}
            key={`exam-${exam.id}-${date.format('YYYY-MM-DD')}`}
            className="text-xs px-1 py-0.5 rounded truncate text-white bg-red-500 cursor-pointer"
            title={`${exam.name} • ${exam.subject?.name}`}
          >
            {exam.examType?.name} - {exam.subject?.name}
          </div>
        ))}

        {dateExams.length > 2 && (
          <div className="text-xs text-gray-600 font-medium">
            +{dateExams.length - 2} more
          </div>
        )}

        {/* 📅 Events */}
        {dateEvents.slice(0, 2).map((event) => {
          const typeInfo = eventTypes?.[event.eventTypeId] || {
            label: 'Other',
            color: '#808080'
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

      <ScheduleDetailsDrawer
        schedule={selectedSchedule}
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        clickedDate={clickedDate}
      />
    </div>
  )
}
