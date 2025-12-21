'use client';

import {Alert, Card, Segmented, Spin} from 'antd';
import {useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

import {IClassSchedule} from '@/types/classSchedule';

import {useGetMySchedulesQuery} from '@/store/api/classScheduleApi';

import MonthlyView from './MonthlyView';
import ScheduleDetailsDrawer from './ScheduleDetailsDrawer';
import TodayClasses from './TodayClasses';
import WeeklyView from './WeeklyView';
import ClassScheduleCalendarView from '@/components/classSchedules/ClassScheduleCalendarView';

const ScheduleView: React.FC = () => {
  const { t } = useLocalization();
  const [view, setView] = useState<'Week' | 'Month'>('Week');
  const [selectedSchedule, setSelectedSchedule] = useState<IClassSchedule | null>(null);
  const [clickedDate, setClickedDate] = useState<string | undefined>(undefined);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { data, isLoading, error } = useGetMySchedulesQuery();

  const handleScheduleClick = (schedule: IClassSchedule, date?: string) => {
    setSelectedSchedule(schedule);
    setClickedDate(date);
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedSchedule(null);
    setClickedDate(undefined);
  };

  if (isLoading) {
    return (
      <Card className="shadow-md rounded-xl min-h-[500px] flex items-center justify-center">
        <Spin size="large" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md rounded-xl">
        <Alert
          message={t(LOCALE_KEYS.ERROR)}
          description="Failed to load schedules"
          type="error"
          showIcon
        />
      </Card>
    );
  }

  const schedulesData = data?.data;

  return (
    <Card className="shadow-md rounded-xl min-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg m-0">
          {t(LOCALE_KEYS.WEEKLY_SCHEDULE_TITLE, { defaultValue: 'Weekly Schedule' })}
        </h3>
        <Segmented
          options={['Week', 'Month']}
          value={view}
          onChange={(val) => setView(val as 'Week' | 'Month')}
          size="large"
        />
      </div>

      {/* Content */}
      {view === 'Week' ? (
        <>
          <WeeklyView
            weekSchedules={schedulesData?.week.schedules || []}
            onScheduleClick={handleScheduleClick}
          />
          <TodayClasses
            todaySchedules={schedulesData?.today.schedules || []}
            onScheduleClick={handleScheduleClick}
          />
        </>
      ) : (
        <ClassScheduleCalendarView/>
      )}

      {/* Schedule Details Drawer */}
      <ScheduleDetailsDrawer
        schedule={selectedSchedule}
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        clickedDate={clickedDate}
      />
    </Card>
  );
};

export default ScheduleView;
