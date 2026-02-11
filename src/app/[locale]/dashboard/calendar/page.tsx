'use client'

import {
  CalendarOutlined,
  UnorderedListOutlined,
  BgColorsOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'
import {
  Layout,
  Button,
  Space,
  Select,

  Card,

} from 'antd'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ACADEMIC_YEAR_OPTIONS } from '@/utils/academicYearOptions'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ListEventView from '@/components/dashboard/calendar/ListEventView'
import MonthCalendarView from '@/components/dashboard/calendar/MonthCalendarView'
import WeekScheduleView from '@/components/dashboard/calendar/WeekScheduleView'
import EventFormDrawer from '@/components/events/EventFormDrawer'
import { MainLayout } from '@/components/layout/MainLayout'

import { useBatches } from '@/hooks/useBatches'
import { useClassSchedules } from '@/hooks/useClassSchedules'
import { useCourses } from '@/hooks/useCourses'
import { useEvents } from '@/hooks/useEvents'
import { useEventTypes } from '@/hooks/useEventTypes'
import { useExams } from '@/hooks/useExams'




const { Content } = Layout

export default function Home() {
  const [viewType, setViewType] = useState('list')
  const [currentDate, setCurrentDate] = useState(dayjs('2026-02-10'))
  const [selectedBatch, setSelectedBatch] = useState()
  const [selectedCourse, setSelectedCourse] = useState()
  const [selectedYear, setSelectedYear] = useState()
  const [selectedEventType, setSelectedEventType] = useState<number | null>(null)
  const { events, loadEvents } = useEvents()
  const { courses, loadCourses } = useCourses()
  const { loadBatches, batches } = useBatches()
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>();
  const { eventTypes, loadEventTypes } = useEventTypes()
  const { classSchedules, loadClassSchedules } = useClassSchedules()
  const { exams, loadExams } = useExams()
  const router = useRouter();
  const pathname = usePathname()



  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');


  useEffect(() => {
    loadCourses({ page: 1, limit: 99 })
  }, [loadCourses])



  useEffect(() => {
    loadEventTypes({ page: 1, limit: 99, })
  }, [loadEventTypes,])

  useEffect(() => {
    const params: any = {};


    if (selectedYear) params.academicYear = selectedYear;
    if (selectedEventType) params.eventTypeId = selectedEventType;

    console.log(selectedEventType)
    // Keep skip & limit if needed
    if (skip) params.skip = skip;
    if (limit) params.limit = limit;

    // Update the URL without reloading the page
    const searchParams = new URLSearchParams(params).toString();
    router.replace(`?${searchParams}`);

    // Load events and related data
    loadEvents({ page: 1, limit: 10, ...params });
    if (selectedBatch) {
      loadClassSchedules({ page: 1, limit: 99, batchId: selectedBatch });
      loadExams({ page: 1, limit: 99, batchId: selectedBatch });
    }
    if (selectedCourse) {
      loadBatches({ page: 1, limit: 99, courseId: selectedCourse });
    }
  }, [selectedBatch, selectedCourse, selectedYear, selectedEventType, skip, limit, router, loadEvents, loadClassSchedules, loadExams, loadBatches]);

  const hasFilters =
    !!selectedYear ||
    !!selectedCourse ||
    !!selectedBatch ||
    !!selectedEventType

  const handleClearFilters = () => {
    // reset state
    setSelectedYear(undefined)
    setSelectedCourse(undefined)
    setSelectedBatch(undefined)

    // remove all query params
    router.replace(pathname)
    // reload base data
    loadEvents({ page: 1, limit: 10 })
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
        return <WeekScheduleView classSchedules={classSchedules} exams={exams} events={events} currentDate={currentDate} />
      case 'month':
        return <MonthCalendarView classSchedules={classSchedules} exams={exams} events={events} currentDate={currentDate} />
      default:
        return <ListEventView classSchedules={classSchedules} exams={exams} events={events} currentDate={currentDate} />
    }
  }



  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto bg-white">
          <div className="bg-white border-b border-gray-200 px-8 py-4">
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
                <Button type="primary" onClick={() => handleCreateDrawer()} icon={<PlusOutlined />}>
                  Add Event
                </Button>
              </Space>
            </div>
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
                    placeholder="Select Year"
                    options={ACADEMIC_YEAR_OPTIONS}
                  />
                  <Select
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    style={{ width: 150 }}
                    placeholder="Select Course"
                    options={courses.map((course) => ({
                      label: course.name,
                      value: course.id,
                    }))}
                  />
                  <Select
                    value={selectedBatch}
                    onChange={setSelectedBatch}
                    style={{ width: 150 }}
                    placeholder="Select Batch"
                    options={batches.map((batch) => ({
                      label: batch.name,
                      value: batch.id,
                    }))}
                  />
                  {hasFilters && (
                    <Button
                      danger
                      type="default"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}

                </div>

                {/* Event Type Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700 font-medium">Event Types</span>
                  {eventTypes.map((type) => (
                    <Button
                      key={type.name}
                      onClick={() => setSelectedEventType(type.id)}
                      style={{
                        color: selectedEventType === type.id ? '#fff' : type.color,
                        borderColor: type.color,
                        backgroundColor:
                          selectedEventType === type.id
                            ? type.color
                            : `${type.color}20`, // light background when not selected
                        fontWeight: selectedEventType === type.id ? 600 : 400,
                      }}
                    >
                      {type.name}
                    </Button>

                  ))}
                </div>
              </div>
            </Card>

            {/* Main Calendar View */}
            <Card className="mb-6 border-gray-200">
              {renderTabContent()}
            </Card>


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
  )
}
