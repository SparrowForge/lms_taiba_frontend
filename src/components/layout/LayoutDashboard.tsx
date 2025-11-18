'use client';
import {Row} from 'antd';

import {UserType} from '@/enums/user-type.enum';

import {useAuth} from '@/hooks/useAuth';

import StudentLayout from './StudentLayout';
import TeacherLayout from './TeacherLayout';

const LayoutDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="overflow-auto">
      <Row
        gutter={[24, 24]}
        className="pl-6"
        style={{ width: '100%', minWidth: 0, height: '100%' }}
      >
        {user?.type === UserType.FACULTY ? (
          <TeacherLayout />
        ) : user?.type === UserType.STUDENT ? (
          <StudentLayout />
        ) : (
          <div />
        )}
      </Row>
    </div>
  );
};

export default LayoutDashboard;
