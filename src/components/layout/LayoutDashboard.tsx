'use client';
import { Row } from 'antd';

import { useRole } from '@/hooks/useRole';

import StudentLayout from './StudentLayout';
import TeacherLayout from './TeacherLayout';

const LayoutDashboard = () => {
  const role = useRole();
  return (
    <div className="h-[600px] overflow-auto">
      <Row
        gutter={[24, 24]}
        className="pl-6"
        style={{ width: '100%', minWidth: 0, height: '100%' }}
      >
        {role === 'teacher' ? <TeacherLayout /> : <StudentLayout />}
      </Row>
    </div>
  );
};

export default LayoutDashboard;
