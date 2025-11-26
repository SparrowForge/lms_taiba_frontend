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
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import CourseAssignmentDetailsDrawer from '@/components/courseAssignments/CourseAssignmentDetailsDrawer';

import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useLocalization } from '@/hooks/useLocalization';
import { useAuth } from '@/hooks/useAuth';
import CourseAssignmentFormDrawer from '../courseAssignments/CourseAssignmentFormDrawer';
import { UserType } from '@/enums/user-type.enum';
import CourseAssignmentSubmissionFormDrawer from '../courseAssignmentSubmissions/CourseAssignmentSubmissionFormDrawer';
import { BiDetail, BiEditAlt } from 'react-icons/bi';
import { useCourseAssignmentSubmissions } from '@/hooks/useCourseAssignmentSubmissions';
import AssignmentSubmissionCardByStudent from './AssignmentSumissionCardByStudent';

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

const AssignmentSubmissionStudent: React.FC = () => {
  const { t } = useLocalization();
  const {user} = useAuth()
  const [assignmentSubmissiondrawerMode, setAssignmentSubmissionDrawerMode] = useState<'create' | 'edit'>('create');
  const [assignmentSubmissionDrawerVisible, setAssignmentSubmissionDrawerVisible] = useState(false);
  const {courseAssignmentSubmissions, loadCourseAssignmentSubmissions, listStatus} = useCourseAssignmentSubmissions()
  const [selectedAssignmentSubmissionId, setSelectedAssignmentSubmissionId] = useState<number | undefined>();

  useEffect(() => {
      if(user){
        loadCourseAssignmentSubmissions({ studentId:user?.student.id });
      }
  }, [loadCourseAssignmentSubmissions, user]);


  const handleAssignmentSubmissionDrawerSuccess = () => {
    setAssignmentSubmissionDrawerVisible(false);
    loadCourseAssignmentSubmissions({ page: 1, limit: 10 });
  };


  return (
    <Card className="rounded-xl shadow-sm mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t(LOCALE_KEYS.SUBMITTED_ASSIGNMENT)}</h2>
      </div>

      {/* States */}
      {listStatus.status === Status.LOADING && (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      )}

      {listStatus.status === Status.SUCCESS && courseAssignmentSubmissions.length === 0 && (
        <Empty description="NO_ASSIGNMENTS" />
      )}

      {/* Assignment Cards */}
      {listStatus.status === Status.SUCCESS && courseAssignmentSubmissions.length > 0 && (
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
          {courseAssignmentSubmissions.map((item) => (
            <AssignmentSubmissionCardByStudent data={item}/>
          ))}
        </div>
      )}

      <CourseAssignmentSubmissionFormDrawer
        mode={assignmentSubmissiondrawerMode}
        courseAssignmentSubmissionId={selectedAssignmentSubmissionId}
        visible={assignmentSubmissionDrawerVisible}
        onCancel={() => setAssignmentSubmissionDrawerVisible(false)}
        onSuccess={handleAssignmentSubmissionDrawerSuccess}
        isAdmin={false}
      />
      
    </Card>
  );
};

export default AssignmentSubmissionStudent;
