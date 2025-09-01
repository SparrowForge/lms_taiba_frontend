'use client';

import { Tabs } from 'antd';
import {useRouter} from 'next/navigation';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import ClassScheduleCalendarView from '@/components/classSchedules/ClassScheduleCalendarView';
import ClassScheduleListView from '@/components/classSchedules/ClassScheduleListView';
import {MainLayout} from '@/components/layout/MainLayout';


import {useLocalization} from '@/hooks/useLocalization';




export default function ClassSchedulesPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });
  const router = useRouter();


  return (
    <ProtectedRoute>
      <MainLayout>
        <Tabs type='card' size='large' style={{ margin: 12 }}>
          <Tabs.TabPane tab="Calendar" key="calendar">
            <ClassScheduleCalendarView/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="List" key="list">
            <ClassScheduleListView />
          </Tabs.TabPane>
        </Tabs>
      </MainLayout>
    </ProtectedRoute>
  );
}
