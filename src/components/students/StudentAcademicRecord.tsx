import { Card, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { Status } from '@/enums';

import { useAuth } from '@/hooks/useAuth';
import { useSemesters } from '@/hooks/useSemesters';
import { useSemesterSubjects } from '@/hooks/useSemesterSubjects';

import { ICourse } from '@/types/course';
import { IStudent } from '@/types/student';

import AcademicSubjectCard from './AcademicSubjectCard';
import SemesterSelector from '../dashboard/course/SemesterSelector';





const StudentAcademicRecord = ({ studentInfo }: IStudent) => {

  const { user } = useAuth()
  const { semesters, loadSemesters } = useSemesters();

  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>(undefined);

  const { semesterSubjects, loadSemesterSubjects, actionStatus } = useSemesterSubjects()

  useEffect(() => {
    if (selectedSemesterId) {
      loadSemesterSubjects({ page: 1, limit: 99, semesterId: selectedSemesterId })
    }
  }, [loadSemesterSubjects, selectedSemesterId])

  useEffect(() => {
    if (user?.id) {
      loadSemesters({ page: 1, limit: 100, batchId: user?.batchId });
    } else if (studentInfo) {
      loadSemesters({ page: 1, limit: 100, batchId: studentInfo?.batchId });
    }
  }, [loadSemesters, studentInfo, user?.batchId, user?.id]);

  // Auto-select current semester based on current date
  useEffect(() => {
    if (semesters.length > 0 && !selectedSemesterId) {
      const currentDate = new Date();

      // Find semester where current date is between start and end date
      const currentSemester = semesters.find((semester) => {
        const startDate = new Date(semester.startDate);
        const endDate = new Date(semester.endDate);
        return currentDate >= startDate && currentDate <= endDate;
      });

      if (currentSemester) {
        setSelectedSemesterId(currentSemester.id);
      } else {
        // If no current semester found, select the first one
        setSelectedSemesterId(semesters[0]?.id);
      }
    }
  }, [semesters, selectedSemesterId]);



  return (
    <div className="space-y-4 overflow-y-auto min-h-screen">
      <StudentCourseHeader course={studentInfo.course || null} />

      {/* Semester Selection */}
      <SemesterSelector
        semesters={semesters}
        selectedSemesterId={selectedSemesterId}
        onSemesterChange={setSelectedSemesterId}
      />

      {/* Subjects Display */}
      {selectedSemesterId && (
        <Card className="rounded-2xl shadow-sm" style={{ margin: '12px 12px' }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Typography.Text strong className="text-lg">
                Subjects
              </Typography.Text>
              {semesterSubjects.length > 1 && (
                <Typography.Text type="secondary">
                  {semesterSubjects.length} subjects
                </Typography.Text>
              )}
            </div>

            {actionStatus.status === Status.LOADING && (
              <div className="text-center py-8">
                <Typography.Text type="secondary">Loading subjects...</Typography.Text>
              </div>
            )}



            {semesterSubjects && actionStatus.status !== Status.LOADING && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {semesterSubjects.map((subject) => (
                  <AcademicSubjectCard
                    key={subject.id}
                    subject={subject}
                    semesterId={selectedSemesterId}

                  />
                ))}
              </div>
            )}

            {semesterSubjects && semesterSubjects.length === 0 && (
              <div className="text-center py-8">
                <Typography.Text type="secondary">
                  No subjects found for this semester
                </Typography.Text>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentAcademicRecord;

function StudentCourseHeader({ course }: { course: ICourse | null }) {
  return (
    <Card className="p-4 rounded-2xl shadow-sm" style={{ margin: '12px 12px' }}>
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <Typography.Title level={2} className="text-2xl font-bold">
            {course?.name}
          </Typography.Title>
          <Typography.Text>{course?.code}</Typography.Text>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Typography.Title level={5}>{course?.department?.name}</Typography.Title>
          <Typography.Text>{course?.department?.code}</Typography.Text>
        </div>
        <Typography.Text>{course?.description}</Typography.Text>
      </div>
      <div className="flex flex-col gap-2"></div>
    </Card>
  );
}
