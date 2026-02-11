'use client'

import { Tag, Empty } from 'antd'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useEffect } from 'react'

import { useEventTypes } from '@/hooks/useEventTypes'

import { IEvent } from '@/types/event'

dayjs.extend(isBetween)

interface ListEventViewProps {
  currentDate: any,
  events: IEvent[]
}

export default function ListEventView({ currentDate, events }: ListEventViewProps) {
  const { eventTypes, loadEventTypes } = useEventTypes()

  useEffect(() => {
    loadEventTypes({ page: 1, limit: 99 })
  }, [loadEventTypes])

  const groupedEvents = events.reduce(
    (acc, event) => {
      const monthKey = dayjs(event.startAt).format('MMMM YYYY')
      if (!acc[monthKey]) {
        acc[monthKey] = []
      }
      acc[monthKey].push(event)
      return acc
    },
    {} as Record<string, typeof events>
  )

  if (events.length === 0) {
    return <Empty description="No events found" />
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents)
        .sort(([monthA], [monthB]) => {
          return dayjs(monthA, 'MMMM YYYY').isBefore(
            dayjs(monthB, 'MMMM YYYY')
          )
            ? -1
            : 1
        })
        .map(([month, monthEvents]) => (
          <div key={month}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {month}
            </h3>
            <div className="space-y-3">
              {monthEvents.map((event) => {
                const typeInfo = eventTypes[event.eventTypeId] || {
                  label: 'Other',
                  color: '#808080',
                }
                const startDate = dayjs(event.startAt).format('MMM D')
                const endDate = dayjs(event.endAt).format('MMM D')

                return (
                  <div
                    key={event.id}
                    className="p-4 border-l-4 rounded-lg"
                    style={{
                      borderLeftColor: typeInfo.color,
                      backgroundColor: `${typeInfo.color}15`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h4 className="font-semibold text-gray-900">
                            {event.name}
                          </h4>
                          <Tag
                            style={{
                              color: typeInfo.color,
                              borderColor: typeInfo.color,
                              backgroundColor: `${typeInfo.color}80`
                            }}
                          >
                            {typeInfo.name}
                          </Tag>

                        </div>
                        <p className="text-sm text-gray-600">
                          {startDate} - {endDate}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Course:</span>{' '}
                            {event.course?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Batch:</span>{' '}
                            {event.batch?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
    </div>
  )
}
