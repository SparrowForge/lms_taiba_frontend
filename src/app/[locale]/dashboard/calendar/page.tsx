"use client"

import { BgColorsOutlined, CalendarOutlined, LeftOutlined, PlusOutlined, RightOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Select, Space, Tag } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ClassScheduleCalendarView from '@/components/classSchedules/ClassScheduleCalendarView';
import ClassSchedulesSection from '@/components/dashboard/calendar/ClassSchedulesSection';
import ListEventView from '@/components/dashboard/calendar/ListEventView';
import MonthCalendarView from '@/components/dashboard/calendar/MonthCalendarView';
import UpcomingEventsSection from '@/components/dashboard/calendar/UpcomingEventsSection';
import WeekScheduleView from '@/components/dashboard/calendar/WeekScheduleView';
import { MainLayout } from '@/components/layout/MainLayout';
import EventFormDrawer from '@/components/events/EventFormDrawer';
import { useEvents } from '@/hooks/useEvents';
import { ACADEMIC_YEAR_OPTIONS } from '@/utils/academicYearOptions';
import { useCourses } from '@/hooks/useCourses';
import { useBatches } from '@/hooks/useBatches';

const CalenderDashboard = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>();
  const [viewType, setViewType] = useState('list')
  const [currentDate, setCurrentDate] = useState(dayjs('2026-02-10'))
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedBatch, setSelectedBatch] = useState('all')
  const [selectedYear, setSelectedYear] = useState()
  const { events, listStatus, pagination, loadEvents, removeEvent } = useEvents();
  const {courses, loadCourses} = useCourses()
  const {batches, loadBatches} = useBatches()

  useEffect(()=>{
    loadCourses({ page: 1, limit: 100 })
  },[loadCourses])

  useEffect(()=>{
    if(selectedCourse !== 'all'){
      const selectedCourseObj = courses.find(course => `course-${course.id}` === selectedCourse)
      if(selectedCourseObj){
        loadBatches({ page: 1, limit: 100, courseId: selectedCourseObj.id })
      }
    }
  },[courses, loadBatches, selectedCourse])

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

  const handleCreateDrawer = () => {
    setSelectedEventId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadEvents({ page: 1, limit: 10 });
  };
  return (
    <ProtectedRoute>
      <MainLayout>
        {/* <div className="h-[95vh] overflow-y-auto">
          <ClassScheduleCalendarView />
        </div> */}
        <div className="h-[95vh] bg-white overflow-y-auto">
          <div className="flex items-center justify-between px-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Academic Calendar
              </h1>
              <p className="text-gray-600 text-sm">
                View and manage all academic events, exams, holidays, and batch schedules
              </p>
            </div>
            <Space>
              <Button onClick={() => handleCreateDrawer()} type="primary" icon={<PlusOutlined />}>
                Add Event
              </Button>
            </Space>
          </div>

          <Content className="p-8">

            <Card className="mb-6 border-gray-200">
              <div className="flex flex-col gap-4">

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
                    options={ACADEMIC_YEAR_OPTIONS}
                  />

                  <Select
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    style={{ width: 150 }}
                    options={[
                      { label: 'All Courses', value: 'all' },
                      ...courses.map(course => ({ label: course.name, value: course.id }))
                    ]}
                  />
                  <Select
                    value={selectedBatch}
                    onChange={setSelectedBatch}
                    style={{ width: 150 }}
                    options={batches.map(batch => ({ label: batch.name, value: batch.id }))}
                  />
                </div>


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


            <Card className="mb-6 border-gray-200">
              {renderTabContent()}
            </Card>


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

        <EventFormDrawer
          mode={drawerMode}
          eventId={selectedEventId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CalenderDashboard;
