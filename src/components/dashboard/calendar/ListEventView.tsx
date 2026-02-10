'use client'

import { Tag } from 'antd'

interface Event {
  id: string
  title: string
  type: string
  dateRange: [string, string]
  batch?: string
  typeColor: string
}

interface ListEventViewProps {
  currentDate: any
}

export default function ListEventView({ currentDate }: ListEventViewProps) {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Registration Open - First Term',
      type: 'Registration',
      dateRange: ['Sep 1', 'Sep 7'],
      typeColor: '#eb2f96',
    },
    {
      id: '2',
      title: 'Civil Engineering Batch 2025-A - Registration',
      type: 'Registration',
      dateRange: ['Sep 1', 'Sep 7'],
      batch: 'Civil Engineering Batch 2025-A',
      typeColor: '#eb2f96',
    },
    {
      id: '3',
      title: 'Electrical Engineering Batch 2025-B - Registration',
      type: 'Registration',
      dateRange: ['Sep 1', 'Sep 7'],
      batch: 'Electrical Engineering Batch 2025-B',
      typeColor: '#eb2f96',
    },
    {
      id: '4',
      title: 'National Day Holiday',
      type: 'Holiday',
      dateRange: ['Sep 23', 'Sep 23'],
      typeColor: '#52c41a',
    },
    {
      id: '5',
      title: 'Midterm Examinations',
      type: 'Midterm Exam',
      dateRange: ['Oct 20', 'Oct 26'],
      typeColor: '#ff7a45',
    },
  ]

  const groupedEvents = mockEvents.reduce(
    (acc, event) => {
      const monthKey = 'September 2025'
      if (!acc[monthKey]) {
        acc[monthKey] = []
      }
      acc[monthKey].push(event)
      return acc
    },
    {} as Record<string, Event[]>
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([month, events]) => (
        <div key={month}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{month}</h3>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 border-l-4 rounded-lg"
                style={{ borderLeftColor: event.typeColor, backgroundColor: `${event.typeColor}15` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <Tag color={event.typeColor} style={{ color: event.typeColor }}>
                        {event.type}
                      </Tag>
                    </div>
                    <p className="text-sm text-gray-600">
                      {event.dateRange[0]} - {event.dateRange[1]}
                    </p>
                    {event.batch && (
                      <p className="text-xs text-gray-500 mt-2">{event.batch}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* October 2025 section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">October 2025</h3>
        <div className="space-y-3">
          <div
            className="p-4 border-l-4 rounded-lg"
            style={{ borderLeftColor: '#ff7a45', backgroundColor: '#ff7a4515' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-gray-900">Midterm Examinations</h4>
                  <Tag color="#ff7a45" style={{ color: '#ff7a45' }}>
                    Midterm Exam
                  </Tag>
                </div>
                <p className="text-sm text-gray-600">Oct 20 - Oct 26</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
