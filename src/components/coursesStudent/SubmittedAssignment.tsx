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




const SubmittedAssignment: React.FC = () => {
  const { t } = useLocalization();
  const { user } = useAuth()

  const {courseAssignmentSubmissions, loadCourseAssignmentSubmissions, listStatus } = useCourseAssignmentSubmissions()


  useEffect(() => {
    if (user?.student?.id) {
      loadCourseAssignmentSubmissions({ studentId: user?.student?.id });
    } else if (user?.faculty?.id) {
      loadCourseAssignmentSubmissions({ facultyId: user?.faculty?.id });
    }
  }, [loadCourseAssignmentSubmissions, user]);


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
        <Empty description="NO_ASSIGNMENT" />
      )}

      {/* Assignment Cards */}
      {listStatus.status === Status.SUCCESS && courseAssignmentSubmissions.length > 0 && (
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
          {courseAssignmentSubmissions.map((item) => (
            <AssignmentSubmissionCardByStudent data={item} />
          ))}
        </div>
      )}

      

    </Card>
  );
};

export default SubmittedAssignment;
