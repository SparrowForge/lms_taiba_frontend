'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { UserType } from '@/enums/user-type.enum';

import { useAuth } from '@/hooks/useAuth';

import Assignments from './Assignments';
import SubmittedAssignment from './SubmittedAssignment';
import  { FacultyTabData, StudentTabData } from './TabData';
import { DiscussionSection } from '../dashboard/discussion/DiscussionSection';
import ExamResultIndividualSubject from '../examResults/ExamResultIndividualSubject';
import FacultyExamsManagement from '../exams/FacultyExamsManagement';
import StudentExamParticipate from '../exams/StudentExamParticipate';
import CourseMaterials from '../lms/CourseMaterials';
import UpperTab from '../lms/UpperTab';



const MyCoursesSection = () => {
  const [activeTab, setActiveTab] = useState('discussion');
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { user } = useAuth()

  useEffect(() => {
    if (tab) {
      setActiveTab(tab)
    }
  }, [tab])

  return (
    <div className="md:my-6">
      {user?.type === UserType.FACULTY &&
        <UpperTab items={FacultyTabData} initial={tab ?? 'discussion'} onTabChange={(tab) => setActiveTab(tab)} />
      }
      {user?.type === UserType.STUDENT &&
        <UpperTab items={StudentTabData} initial={tab ?? 'discussion'} onTabChange={(tab) => setActiveTab(tab)} />
      }
      {activeTab === 'materials' && <CourseMaterials />}
      
      {activeTab === 'assignments' && <Assignments />}
      {user?.type === UserType.STUDENT && activeTab === 'submittedAssignments' && <SubmittedAssignment />}
      {user?.type === UserType.FACULTY && activeTab === 'exam' && <FacultyExamsManagement/>}
      {user?.type === UserType.STUDENT && activeTab === 'exam' && <StudentExamParticipate/>}
      {user?.type === UserType.STUDENT && activeTab === 'result' && <ExamResultIndividualSubject/>}
      {activeTab === 'grading' && <div>Grading Content is empty</div>}
      {activeTab === 'discussion' && <DiscussionSection/>}
    </div>
  );
};

export default MyCoursesSection;
