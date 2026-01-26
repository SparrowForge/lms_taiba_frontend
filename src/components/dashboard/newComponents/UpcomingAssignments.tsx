'use client';
import {
  CalculatorOutlined,
  CodeOutlined,
  DiffOutlined,
  ExceptionOutlined,
  ExperimentOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Button, Card } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import CourseAssignmentDetailsDrawer from '@/components/courseAssignments/CourseAssignmentDetailsDrawer';

import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useLocalization } from '@/hooks/useLocalization';

import IconBgColoredCard from '../dashboardui/cards/IconBgColoredCard';

const getAssignmentStyle = (assignment: any) => {
  switch (assignment.type?.toLowerCase()) {
    case 'lab':
      return {
        color: '#ef4444',
        bgColor: '#fef2f2',
        bgColorIcon: '#fee2e2',
        icon: <ExperimentOutlined style={{ color: '#ef4444' }} />,
      };
    case 'math':
      return {
        color: '#f59e0b',
        bgColor: '#fffbeb',
        bgColorIcon: '#fef3c7',
        icon: <CalculatorOutlined style={{ color: '#f59e0b' }} />,
      };
    case 'project':
      return {
        color: '#5190f7',
        bgColor: '#eff6ff',
        bgColorIcon: '#dbeafe',
        icon: <CodeOutlined style={{ color: '#5190f7' }} />,
      };
    case 'essay':
      return {
        color: '#6b7280',
        bgColor: '#f3f4f6',
        bgColorIcon: '#e5e7eb',
        icon: <FileTextOutlined style={{ color: '#6b7280' }} />,
      };
    case 'homework':
      return {
        color: '#d97706',
        bgColor: '#fffbeb',
        bgColorIcon: '#fef3c7',
        icon: <DiffOutlined style={{ color: '#d97706' }} />,
      };
    default:
      return {
        color: '#10b981',
        bgColor: '#ecfdf5',
        bgColorIcon: '#d1fae5',
        icon: <FileTextOutlined style={{ color: '#10b981' }} />,
      };
  }
};

// 🔹 Compute tag
const getAssignmentTag = (assignment: any) => {
  const today = dayjs();
  const dueDate = dayjs(assignment.dueDate);
  const publishDate = dayjs(assignment.publishDate);

  if (dueDate.diff(today, 'day') <= 1) return 'Urgent';
  if (publishDate.diff(today, 'day') <= 0 && publishDate.diff(today, 'day') >= -1) return 'Started';
  if (assignment.maxAttempt && assignment.maxAttempt <= 1) return 'Important';
  if (assignment.type?.toLowerCase() === 'project' || assignment.maxAttempt > 1)
    return 'Group Work';
  if (assignment.type?.toLowerCase() === 'quiz') return 'Quiz';
  if (assignment.type?.toLowerCase() === 'lab') return 'Lab';

  return assignment.tag || '';
};

const UpcomingAssignments = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const { courseAssignments, loadCourseAssignments } = useCourseAssignments();

  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsCourseAssignmentId, setSelectedDetailsCourseAssignmentId] = useState<
    number | undefined
  >();

  useEffect(() => {
    loadCourseAssignments({ page: 1, limit: 100 });
  }, [loadCourseAssignments]);

  const upcomingAssignments = (courseAssignments || []).filter(
    (a: any) => dayjs(a.dueDate).isAfter(dayjs(), 'day') || dayjs(a.dueDate).isSame(dayjs(), 'day'),
  );

  const sortedAssignments = [...upcomingAssignments].sort(
    (a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf(),
  );

  const handleViewDetails = (courseAssignmentId: number) => {
    setSelectedDetailsCourseAssignmentId(courseAssignmentId);
    setDetailsDrawerVisible(true);
  };

  return (
    <Card className="rounded-2xl shadow-sm min-h-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">{t(LOCALE_KEYS.UPCOMING_ASSIGNMENT)}</h2>
        <Button
          type="text"
          style={{ padding: 0 }}
          onClick={() => router.push('/dashboard/course')}
        >
          <span className="text-blue-600 cursor-pointer">{t(LOCALE_KEYS.ALL_TASKS)}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto h-[500px]">
        {sortedAssignments.map((a: any, i: number) => {
          const style = getAssignmentStyle(a);
          const tag = getAssignmentTag(a);
          const isUrgent = tag === 'Urgent';

          return (
            <IconBgColoredCard
              key={i}
              text={a.title}
              due={dayjs(a.dueDate).format('MMM D, YYYY')}
              tag={tag}
              color={isUrgent ? '#ef4444' : style.color}
              bgColor={isUrgent ? '#fef2f2' : style.bgColor}
              bgColorIcon={isUrgent ? '#fee2e2' : style.bgColorIcon}
              icon={isUrgent ? <ExceptionOutlined style={{ color: '#ef4444' }} /> : style.icon}
              rounded="md"
              onClick={() => handleViewDetails(a.id)}
            />
          );
        })}
      </div>

      <CourseAssignmentDetailsDrawer
        courseAssignmentId={selectedDetailsCourseAssignmentId}
        visible={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={() => {}}
      />
    </Card>
  );
};

export default UpcomingAssignments;
