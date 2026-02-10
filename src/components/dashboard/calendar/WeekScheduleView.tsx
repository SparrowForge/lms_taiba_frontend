'use client'

import { Table } from 'antd'
import dayjs from 'dayjs'

interface WeekScheduleViewProps {
  currentDate: any
}

export default function WeekScheduleView({ currentDate }: WeekScheduleViewProps) {
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

  // Get start of week (Sunday)
  const weekStart = currentDate.startOf('week')

  const days = Array.from({ length: 7 }, (_, i) =>
    weekStart.add(i, 'day')
  )

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 80,
      fixed: 'left' as const,
      render: (text: string) => (
        <div className="font-semibold text-sm text-gray-700">{text}</div>
      ),
    },
    ...days.map((day) => ({
      title: (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            {day.format('ddd')}
          </div>
          <div
            className={`text-lg font-bold ${
              day.format('DD') === dayjs().format('DD') &&
              day.format('MM') === dayjs().format('MM')
                ? 'text-orange-500'
                : 'text-gray-600'
            }`}
          >
            {day.format('DD')}
          </div>
        </div>
      ),
      dataIndex: `day-${day.format('YYYY-MM-DD')}`,
      key: `day-${day.format('YYYY-MM-DD')}`,
      align: 'center' as const,
      render: (text: any) => (
        <div
          className={`h-16 border-r ${
            day.format('DD') === '10' ? 'bg-orange-50' : ''
          }`}
        />
      ),
    })),
  ]

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
        }
      `}</style>
    </div>
  )
}
