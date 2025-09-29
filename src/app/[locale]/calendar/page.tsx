import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import ClassScheduleCalendarView from '@/components/classSchedules/ClassScheduleCalendarView';
import {MainLayout} from '@/components/layout/MainLayout';

const CalenderDashboard = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
          <ClassScheduleCalendarView />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CalenderDashboard;
