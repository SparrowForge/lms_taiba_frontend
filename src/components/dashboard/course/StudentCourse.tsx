import {Card, Typography} from 'antd';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

import {useSemesters} from '@/hooks/useSemesters';


import {ICourse} from '@/types/course';

import {useGetMeQuery, useGetMySubjectsQuery} from '@/store/api/studentApi';

import SemesterSelector from './SemesterSelector';
import SubjectCard from './SubjectCard';

const StudentCourse = () => {
  const router = useRouter();
  const { data: meData } = useGetMeQuery();
  const { semesters, loadSemesters } = useSemesters();

  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>(undefined);

  // Fetch subjects for selected semester - automatically refetches when semester changes
  const {
    data: subjectsData,
    isLoading: subjectsLoading,
    error: subjectsError,
  } = useGetMySubjectsQuery(
    selectedSemesterId,
    { skip: !selectedSemesterId }, // Skip query if no semester selected
  );

  useEffect(() => {
    if (meData?.data?.course?.id) {
      loadSemesters({ page: 1, limit: 100, batchId: meData?.data?.batch?.id });
    }
  }, [loadSemesters, meData?.data?.batch?.id, meData?.data?.course?.id]);

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
    <div className="space-y-4">
      <StudentCourseHeader course={meData?.data?.course || null} />

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
              {subjectsData?.data && (
                <Typography.Text type="secondary">
                  {subjectsData.data.subjects.length} subjects
                </Typography.Text>
              )}
            </div>

            {subjectsLoading && (
              <div className="text-center py-8">
                <Typography.Text type="secondary">Loading subjects...</Typography.Text>
              </div>
            )}

            {!!subjectsError && (
              <div className="text-center py-8">
                <Typography.Text type="danger">Failed to load subjects</Typography.Text>
              </div>
            )}

            {subjectsData?.data && !subjectsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectsData.data.subjects.map((subject) => (
                  <SubjectCard
                    key={subject?.id}
                    subject={subject}
                    semesterId={selectedSemesterId}
                    onClick={() => router.push(`/dashboard/course/${subject?.id}`)}
                  />
                ))}
              </div>
            )}

            {subjectsData?.data && subjectsData.data.subjects.length === 0 && (
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

export default StudentCourse;

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
