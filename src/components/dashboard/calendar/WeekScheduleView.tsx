'use client'

import { Table } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { useEffect, useMemo } from 'react'

import { useEventTypes } from '@/hooks/useEventTypes'

import { IEvent } from '@/types/event'

dayjs.extend(isBetween)
dayjs.extend(utc)

interface WeekScheduleViewProps {
  currentDate: Dayjs
  events: IEvent[]
}

export default function WeekScheduleView({
  currentDate,
  events,
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

  // ✅ Correct multi-day + timezone-safe logic
  const getEventsForDay = (date: Dayjs) => {
    return events.filter((event) => {
      const start = dayjs.utc(event.startAt).local().startOf('day')
      const end = dayjs.utc(event.endAt).local().endOf('day')

      return date.isBetween(start, end, 'day', '[]')
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
        const dayEvents = getEventsForDay(day)
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
          render: () => (
            <div
              className={`min-h-20 border-r p-2 space-y-1 ${
                isToday ? 'bg-orange-50' : ''
              }`}
            >
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => {
                  const typeInfo = eventTypes?.[event.eventTypeId] || {
                    label: 'Other',
                    color: '#808080',
                  }

                  return (
                    <div
                      key={`${event.id}-${day.format('YYYY-MM-DD')}`}
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
                })
              ) : (
                <div className="text-xs text-gray-300">—</div>
              )}
            </div>
          ),
        }
      }),
    ]
  }, [days, events, eventTypes])

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
