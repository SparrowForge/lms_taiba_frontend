'use client';

import {
  BookOutlined,
  CalculatorOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { Button, Card, Empty, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import CourseAssignmentDetailsDrawer from '@/components/courseAssignments/CourseAssignmentDetailsDrawer';

import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useLocalization } from '@/hooks/useLocalization';
import { useAuth } from '@/hooks/useAuth';

// 🔹 Icon map for assignment types
const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'lab':
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100">
          <ExperimentOutlined style={{ fontSize: 22, color: '#ef4444' }} />
        </div>
      );
    case 'math':
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-100">
          <CalculatorOutlined style={{ fontSize: 22, color: '#f59e0b' }} />
        </div>
      );
    case 'project':
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
          <FileTextOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
      );
    case 'essay':
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
          <BookOutlined style={{ fontSize: 22, color: '#6b7280' }} />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100">
          <SnippetsOutlined style={{ fontSize: 22, color: '#10b981' }} />
        </div>
      );
  }
};

// 🔹 Tag logic
const getAssignmentTag = (assignment: any) => {
  const today = dayjs();
  const dueDate = dayjs(assignment.dueDate);
  const publishDate = dayjs(assignment.publishDate);

  if (dueDate.diff(today, 'day') <= 1) return 'Urgent';
  if (publishDate.diff(today, 'day') <= 0 && publishDate.diff(today, 'day') >= -1) return 'Started';
  if (assignment.maxAttempt && assignment.maxAttempt <= 1) return 'Important';
  if (assignment.type?.toLowerCase() === 'project') return 'Project';
  if (assignment.type?.toLowerCase() === 'lab') return 'Lab';

  return assignment.tag || 'General';
};

const Assignments: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const {user} = useAuth()
  const {id} = useParams()
  const { courseAssignments, listStatus, loadCourseAssignments } = useCourseAssignments();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | undefined>();

  useEffect(() => {
    if(user?.student?.batchId){
      loadCourseAssignments({ batchId:user?.student?.batchId, subjectId:id});
    }
  }, [id,loadCourseAssignments, user?.student?.batchId]);

  const sortedAssignments = [...(courseAssignments || [])].sort(
    (a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf(),
  );

  const handleViewDetails = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setDetailsDrawerVisible(true);
  };

  return (
    <Card className="rounded-xl shadow-sm mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t(LOCALE_KEYS.UPCOMING_ASSIGNMENT)}</h2>
        <Button type="primary" onClick={() => router.push('/course-assignments')}>
          {t(LOCALE_KEYS.ALL_TASKS)}
        </Button>
      </div>

      {/* States */}
      {listStatus.status === Status.LOADING && (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      )}

      {listStatus.status === Status.SUCCESS && sortedAssignments.length === 0 && (
        // <Empty description={t(LOCALE_KEYS.NO_ASSIGNMENTS)} />
        <Empty description="NO_ASSIGNMENTS" />
      )}

      {/* Assignment Cards */}
      {listStatus.status === Status.SUCCESS && sortedAssignments.length > 0 && (
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
          {sortedAssignments.map((a) => (
            <Card
              key={a.id}
              className="shadow-sm"
              bodyStyle={{ padding: '12px 16px' }}
              onClick={() => handleViewDetails(a.id)}
            >
              <div className="flex items-center justify-between">
                {/* Left section: Icon + Title */}
                <div className="flex items-center gap-3">
                  {getIcon(a.type || 'default')}
                  <div>
                    <h3 className="font-medium text-lg">{a.title}</h3>
                    <p className="text-xs text-gray-500">
                      Due: {dayjs(a.dueDate).format('MMM D, YYYY')}
                    </p>
                  </div>
                </div>

                {/* Right section: Tag */}
                <div className="flex items-center gap-4">
                  <Tag color="blue">{getAssignmentTag(a)}</Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CourseAssignmentDetailsDrawer
        courseAssignmentId={selectedAssignmentId}
        visible={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={() => {}}
      />
    </Card>
  );
};

export default Assignments;
