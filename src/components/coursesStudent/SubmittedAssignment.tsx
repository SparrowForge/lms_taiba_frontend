'use client';


import { Card, Empty, Select, Spin, Typography, } from 'antd';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, } from 'react';


import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';
import { UserType } from '@/enums/user-type.enum';

import { useAuth } from '@/hooks/useAuth';
import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useCourseAssignmentSubmissions } from '@/hooks/useCourseAssignmentSubmissions';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourseAssignment } from '@/types/courseAssignment';

import AssignmentSubmissionCardByStudent from './AssignmentSumissionCardByStudent';




const SubmittedAssignment: React.FC = () => {
  const { t } = useLocalization();
  const { user } = useAuth()
  const [selectedAssignment, setSelectedAssignment] = useState<number>()
  const { loadCourseAssignments, courseAssignments, actionStatus } = useCourseAssignments()

  const { courseAssignmentSubmissions, loadCourseAssignmentSubmissions, listStatus } = useCourseAssignmentSubmissions()
  const { id } = useParams()


  useEffect(() => {
    if (user?.student?.id) {
      loadCourseAssignmentSubmissions({ studentId: user?.student?.id });
    } else if (user?.faculty?.id && selectedAssignment) {
      loadCourseAssignmentSubmissions({ assignmentId: selectedAssignment });
    }
  }, [loadCourseAssignmentSubmissions, selectedAssignment, user]);

  const onAssignmentChange = (item: ICourseAssignment) => {
    console.log(item)
    setSelectedAssignment(item.id)
  }

  useEffect(() => {
    if (user?.type === UserType.FACULTY) {
      loadCourseAssignments({ subjectId: Number(id), facultyId: user?.faculty?.id })
    }
  }, [id, loadCourseAssignments, user?.faculty?.id, user?.type])


  return (
    <Card className="rounded-xl shadow-sm mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t(LOCALE_KEYS.SUBMITTED_ASSIGNMENT)}</h2>
      </div>

      {user.type === UserType.FACULTY && (
        <Select
          value={selectedAssignment}
          placeholder="Choose an assignment to view submissions"
          className="w-full"
          size="large"
          allowClear
          showSearch
          loading={actionStatus.status === Status.LOADING}
          optionFilterProp="label"
          style={{ borderRadius: '8px' }}

          onChange={(value) => {
            const assignment = courseAssignments.find(a => a.id === value);
            onAssignmentChange(assignment);
          }}

          options={courseAssignments.map(item => ({
            value: item.id,
            label: `Term ${item.title}`,
          }))}
        />
      )}

      {/* States */}
      {listStatus.status === Status.LOADING && (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      )}

      {listStatus.status === Status.SUCCESS && courseAssignmentSubmissions.length === 0 && (
        <Empty description="NO_SUBMITTED_ASSIGNMENT" />
      )}

      {/* Assignment Cards */}
      {listStatus.status === Status.SUCCESS && courseAssignmentSubmissions.length > 0 && (
        <div className="grid grid-cols-2 gap-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
          {courseAssignmentSubmissions.map((item: any) => (
            <AssignmentSubmissionCardByStudent key={item.id} data={item} />
          ))}
        </div>
      )}



    </Card>
  );
};

export default SubmittedAssignment;
