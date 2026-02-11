'use client'

import { Calendar } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { useEffect } from 'react'

import { useEventTypes } from '@/hooks/useEventTypes'

import { IEvent } from '@/types/event'

dayjs.extend(isBetween)
dayjs.extend(utc)

interface MonthCalendarViewProps {
  currentDate: Dayjs
  events: IEvent[]
}

export default function MonthCalendarView({
  currentDate,
  events,
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

  const renderCell = (date: Dayjs) => {
    const dateEvents = getDateEvents(date)

    return (
      <div className="space-y-1 min-h-[60px]">
        {dateEvents.slice(0, 2).map((event) => {
          const typeInfo = eventTypes?.[event.eventTypeId] || {
            label: 'Other',
            color: '#808080',
          }

          return (
            <div
              key={`${event.id}-${date.format('YYYY-MM-DD')}`}
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
        cellRender={(date) => renderCell(date)}  // ✅ FIXED
      />
    </div>
  )
}
