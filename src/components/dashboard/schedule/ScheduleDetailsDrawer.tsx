'use client';

import {
  AppstoreOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ReloadOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
import { Button, Descriptions, Divider, Drawer, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import CourseAssignmentFormDrawer from '@/components/courseAssignments/CourseAssignmentFormDrawer';
import { IClassSchedule } from '@/types/classSchedule';

interface ScheduleDetailsDrawerProps {
  schedule: IClassSchedule | null;
  visible: boolean;
  onClose: () => void;
  clickedDate?: string; // The specific date that was clicked (for recurring schedules)
}

const ScheduleDetailsDrawer: React.FC<ScheduleDetailsDrawerProps> = ({
  schedule,
  visible,
  onClose,
  clickedDate,
}) => {
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCourseAssignmentId, setSelectedCourseAssignmentId] = useState<
    number | undefined
  >();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { t } = useLocalization();
  const router = useRouter();

  if (!schedule) return null;

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMMM D, YYYY');
  };

  const formatTime = (timeString: string) => {
    return dayjs(`2000-01-01 ${timeString}`).format('h:mm A');
  };

  const handleUploadMaterial = () => {
    // Navigate to course materials with pre-filled schedule data
    router.push(
      `/course-materials/create?courseId=${schedule.subject?.courseId}&subjectId=${schedule.subjectId}&batchId=${schedule.batchId}&semesterId=${schedule.semesterId}&facultyId=${schedule.facultyId}`,
    );
    onClose();
  };

  const handleTakeAttendance = () => {
    console.log('clickedDate', clickedDate);
    console.log('schedule.attendances', schedule.attendances);
    // Navigate to attendance page with schedule data and specific date
    // If clickedDate is provided, find attendance for that specific date
    let attendanceId = schedule.attendances?.[0]?.id;

    if (clickedDate && schedule.attendances) {
      // Find attendance matching the clicked date
      const matchingAttendance = schedule.attendances.find(
        (att) => dayjs(att.date).format('YYYY-MM-DD') === dayjs(clickedDate).format('YYYY-MM-DD'),
      );
      if (matchingAttendance) {
        attendanceId = matchingAttendance.id;
      }
    }

    console.log('attendanceId', attendanceId);

    if (attendanceId) {
      router.push(`/attendances/${attendanceId}/mark`);
    }
    // else {
    //   // If no attendance exists, create new one with schedule and date info
    //   const dateParam = clickedDate ? `&date=${dayjs(clickedDate).format('YYYY-MM-DD')}` : '';
    //   router.push(`/attendances/create?scheduleId=${schedule.id}${dateParam}`);
    // }
    onClose();
  };

  // const handleCreateAssignment = () => {
  //   // Navigate to create assignment page
  //   router.push(
  //     `/course-assignments/create?subjectId=${schedule.subjectId}&batchId=${schedule.batchId}&semesterId=${schedule.semesterId}`,
  //   );
  //   onClose();
  // };

  const handleViewSubmissions = () => {
    // Navigate to assignment submissions page
    router.push(
      `/course-assignment-submissions?subjectId=${schedule.subjectId}&batchId=${schedule.batchId}`,
    );
    onClose();
  };

  const handleCreateDrawer = () => {
    setSelectedCourseAssignmentId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };
  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    // loadCourseAssignments({ page: 1, limit: 10 });
  };

  const handleStartClass = () => {
    console.log('Start Class', schedule.zoomSession?.startUrl);
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <BookOutlined className="text-blue-500 text-xl" />
          <div>
            <div className="font-semibold text-lg">
              {schedule.subject?.name || 'Schedule Details'}
            </div>
            <div className="text-sm text-gray-500 font-normal">
              {schedule.batch?.name} - {schedule.semester?.name}
            </div>
          </div>
        </div>
      }
      width={600}
      open={visible}
      onClose={onClose}
      destroyOnClose
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </div>
      }
    >
      {/* Action Buttons */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-semibold mb-3 text-gray-700">{t(LOCALE_KEYS.ACTIONS)}</div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleUploadMaterial}
            block
            className="h-10"
          >
            Upload Material
          </Button>
          <Button
            icon={<CheckCircleOutlined />}
            onClick={handleTakeAttendance}
            block
            className="h-10"
          >
            Take Attendance
          </Button>
          <Button icon={<EditOutlined />} onClick={handleCreateDrawer} block className="h-10">
            Create Assignment
          </Button>
          <Button
            icon={<FileTextOutlined />}
            onClick={handleViewSubmissions}
            block
            className="h-10"
          >
            View Submissions
          </Button>
          <Button
            icon={<ZoomInOutlined />}
            onClick={handleStartClass}
            block
            className="h-10"
            target="_blank"
            href={(schedule.zoomSession?.startUrl && schedule.zoomSession?.startUrl) || undefined}
          >
            Start Class
          </Button>
        </div>
      </div>
      {/* Schedule Type Badge */}
      <div className="mb-6">
        <Tag
          color={schedule.isRecurring ? 'blue' : 'orange'}
          icon={schedule.isRecurring ? <ReloadOutlined /> : <CalendarOutlined />}
          className="px-3 py-1 text-sm"
        >
          {schedule.isRecurring ? t(LOCALE_KEYS.IS_RECURRING) : 'One Time'}
        </Tag>
        <Tag color="default" className="px-3 py-1 text-sm">
          {schedule.scheduleType?.name || 'Regular'}
        </Tag>
        {schedule.status && (
          <Tag color="success" className="px-3 py-1 text-sm">
            {schedule.status}
          </Tag>
        )}
      </div>

      <Divider orientation="left" className="text-base font-semibold">
        <AppstoreOutlined className="mr-2" />
        {t(LOCALE_KEYS.INFORMATION)}
      </Divider>

      <Descriptions column={1} bordered className="mb-6">
        <Descriptions.Item
          label={
            <span>
              <BookOutlined className="mr-2 text-blue-500" />
              {t(LOCALE_KEYS.SUBJECT)}
            </span>
          }
        >
          <div>
            <div className="font-semibold">{schedule.subject?.name || 'N/A'}</div>
            {schedule.subject?.code && (
              <div className="text-xs text-gray-500">{schedule.subject.code}</div>
            )}
          </div>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <AppstoreOutlined className="mr-2 text-green-500" />
              {t(LOCALE_KEYS.BATCH)}
            </span>
          }
        >
          {schedule.batch?.name || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <CalendarOutlined className="mr-2 text-purple-500" />
              {t(LOCALE_KEYS.SEMESTER)}
            </span>
          }
        >
          {schedule.semester?.name || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <UserOutlined className="mr-2 text-orange-500" />
              {t(LOCALE_KEYS.FACULTY)}
            </span>
          }
        >
          <div>
            <div className="font-semibold">{schedule.faculty?.fullName || 'N/A'}</div>
            {schedule.faculty?.email && (
              <div className="text-xs text-gray-500">{schedule.faculty.email}</div>
            )}
          </div>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" className="text-base font-semibold">
        <ClockCircleOutlined className="mr-2" />
        Schedule Details
      </Divider>

      <Descriptions column={1} bordered className="mb-6">
        <Descriptions.Item
          label={
            <span>
              <CalendarOutlined className="mr-2 text-blue-500" />
              {t(LOCALE_KEYS.WEEK_DAY)}
            </span>
          }
        >
          <Tag color="blue">{schedule.weekDay?.name || 'N/A'}</Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <ClockCircleOutlined className="mr-2 text-cyan-500" />
              {t(LOCALE_KEYS.TIME_SLOT)}
            </span>
          }
        >
          <div>
            <div className="font-semibold">{schedule.timeSlot?.name || 'N/A'}</div>
            {schedule.timeSlot?.startTime && schedule.timeSlot?.endTime && (
              <div className="text-sm text-gray-600">
                {formatTime(schedule.timeSlot.startTime)} - {formatTime(schedule.timeSlot.endTime)}
              </div>
            )}
          </div>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <CalendarOutlined className="mr-2 text-green-500" />
              {t(LOCALE_KEYS.START_DATE)}
            </span>
          }
        >
          {formatDate(schedule.startDate)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <CalendarOutlined className="mr-2 text-red-500" />
              {t(LOCALE_KEYS.END_DATE)}
            </span>
          }
        >
          {formatDate(schedule.endDate)}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" className="text-base font-semibold">
        <EnvironmentOutlined className="mr-2" />
        Location & Capacity
      </Divider>

      <Descriptions column={1} bordered>
        <Descriptions.Item
          label={
            <span>
              <EnvironmentOutlined className="mr-2 text-purple-500" />
              {t(LOCALE_KEYS.ROOM)}
            </span>
          }
        >
          <div>
            <div className="font-semibold">{schedule.room?.name || 'N/A'}</div>
          </div>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <TeamOutlined className="mr-2 text-orange-500" />
              {t(LOCALE_KEYS.MAX_CAPACITY)}
            </span>
          }
        >
          <Tag color="blue" className="px-3 py-1">
            {schedule.maxCapacity || 0} {t(LOCALE_KEYS.STUDENTS, { defaultValue: 'students' })}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <CourseAssignmentFormDrawer
        mode={drawerMode}
        courseAssignmentId={selectedCourseAssignmentId}
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        onSuccess={handleDrawerSuccess}
        isAdmin={false}
        subjectId={schedule.subjectId}
        semesId={schedule.semesterId}
        batId={schedule.batchId}
      />
    </Drawer>
  );
};

export default ScheduleDetailsDrawer;
