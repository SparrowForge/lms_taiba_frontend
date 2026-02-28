'use client';


import { Card, Empty, Spin, } from 'antd';
import React, { useEffect, } from 'react';


import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';


import { useAuth } from '@/hooks/useAuth';
import { useCourseAssignmentSubmissions } from '@/hooks/useCourseAssignmentSubmissions';
import { useLocalization } from '@/hooks/useLocalization';

import AssignmentSubmissionCardByStudent from './AssignmentSumissionCardByStudent';







const SubmittedAssignment: React.FC = () => {
  const { t } = useLocalization();
  const { user } = useAuth()

  const { courseAssignmentSubmissions, loadCourseAssignmentSubmissions, listStatus } = useCourseAssignmentSubmissions()


  useEffect(() => {
    if (user?.student?.id) {
      loadCourseAssignmentSubmissions({ studentId: user?.student?.id });
    } else if (user?.faculty?.id) {
      loadCourseAssignmentSubmissions();
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
        <div className="grid grid-cols-2 gap-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
          {courseAssignmentSubmissions.map((item:any) => (
            <AssignmentSubmissionCardByStudent key={item.id} data={item} />
          ))}
        </div>
      )}



    </Card>
  );
};

export default SubmittedAssignment;
