"use client"

import { BgColorsOutlined, CalendarOutlined, LeftOutlined, PlusOutlined, RightOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Select, Space, Tag } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { useState } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ClassScheduleCalendarView from '@/components/classSchedules/ClassScheduleCalendarView';
import ClassSchedulesSection from '@/components/dashboard/calendar/ClassSchedulesSection';
import ListEventView from '@/components/dashboard/calendar/ListEventView';
import MonthCalendarView from '@/components/dashboard/calendar/MonthCalendarView';
import UpcomingEventsSection from '@/components/dashboard/calendar/UpcomingEventsSection';
import WeekScheduleView from '@/components/dashboard/calendar/WeekScheduleView';
import { MainLayout } from '@/components/layout/MainLayout';

const CalenderDashboard = () => {
  const [viewType, setViewType] = useState('list')
  const [currentDate, setCurrentDate] = useState(dayjs('2026-02-10'))
  const [selectedBatch, setSelectedBatch] = useState('all')
  const [selectedYear, setSelectedYear] = useState('2025-2026')

  const eventTypes = [
    { label: 'Holiday', color: '#52c41a' },
    { label: 'Break', color: '#722ed1' },
    { label: 'Registration', color: '#eb2f96' },
    { label: 'Classes Start', color: '#da9917' },
    { label: 'Midterm Exam', color: '#ff7a45' },
    { label: 'Final Exam', color: '#da282b' },
    { label: 'Grade Deadline', color: '#0f8585' },
    { label: 'Withdrawal Deadline', color: '#a79210' },
  ]

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  const handleToday = () => {
    setCurrentDate(dayjs())
  }

  const renderTabContent = () => {
    switch (viewType) {
      case 'week':
        return <WeekScheduleView currentDate={currentDate} />
      case 'month':
        return <MonthCalendarView currentDate={currentDate} />
      default:
        return <ListEventView currentDate={currentDate} />
    }
  }
  return (
    <ProtectedRoute>
      <MainLayout>
        {/* <div className="h-[95vh] overflow-y-auto">
          <ClassScheduleCalendarView />
        </div> */}
        <div className="h-[95vh] bg-white overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Academic Calendar
              </h1>
              <p className="text-gray-600 text-sm">
                View and manage all academic events, exams, holidays, and batch schedules
              </p>
            </div>
            <Space>
              <Button type="default" icon={<BgColorsOutlined />}>
                Auto-Generate
              </Button>
              <Button type="primary" icon={<PlusOutlined />}>
                Add Event
              </Button>
            </Space>
          </div>

          <Content className="p-8">
            {/* Navigation and Controls */}
            <Card className="mb-6 border-gray-200">
              <div className="flex flex-col gap-4">
                {/* Date Navigation */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Space>
                    <Button
                      icon={<LeftOutlined />}
                      onClick={handlePrevMonth}
                      size="small"
                    />
                    <Button onClick={handleToday} size="small">
                      Today
                    </Button>
                    <Button
                      icon={<RightOutlined />}
                      onClick={handleNextMonth}
                      size="small"
                    />
                  </Space>
                  <span className="font-semibold text-gray-900">
                    {currentDate.format('MMMM YYYY')}
                  </span>

                  {/* View Type Buttons */}
                  <Space>
                    <Button
                      icon={<CalendarOutlined />}
                      onClick={() => setViewType('month')}
                      type={viewType === 'month' ? 'primary' : 'default'}
                    >
                      Month
                    </Button>
                    <Button
                      icon={<BgColorsOutlined />}
                      onClick={() => setViewType('week')}
                      type={viewType === 'week' ? 'primary' : 'default'}
                    >
                      Week
                    </Button>
                    <Button
                      icon={<UnorderedListOutlined />}
                      onClick={() => setViewType('list')}
                      type={viewType === 'list' ? 'primary' : 'default'}
                    >
                      List
                    </Button>
                  </Space>

                  {/* Filters */}
                  <Select
                    value={selectedYear}
                    onChange={setSelectedYear}
                    style={{ width: 120 }}
                    options={[
                      { label: '2025-2026', value: '2025-2026' },
                      { label: '2024-2025', value: '2024-2025' },
                      { label: '2026-2027', value: '2026-2027' },
                    ]}
                  />

                  <Select
                    value={selectedBatch}
                    onChange={setSelectedBatch}
                    style={{ width: 150 }}
                    options={[
                      { label: 'All Batches', value: 'all' },
                      { label: 'Civil Engineering 2025-A', value: 'ce-a' },
                      { label: 'Electrical Engineering 2025-B', value: 'ee-b' },
                      { label: 'Mechanical Engineering 2025-C', value: 'me-c' },
                    ]}
                  />
                </div>

                {/* Event Type Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700 font-medium">Event Types:</span>

                  {eventTypes.map((type) => (
                    <Button
                      key={type.label}
                      style={{
                        backgroundColor: type.color,
                        color: '#fff',
                        borderColor: type.color,
                      }}
                      className="transition-all hover:opacity-80 hover:scale-105"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>

              </div>
            </Card>

            {/* Main Calendar View */}
            <Card className="mb-6 border-gray-200">
              {renderTabContent()}
            </Card>

            {/* Bottom Sections */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <ClassSchedulesSection />
              </Col>
              <Col xs={24} lg={12}>
                <UpcomingEventsSection />
              </Col>
            </Row>
          </Content>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CalenderDashboard;
