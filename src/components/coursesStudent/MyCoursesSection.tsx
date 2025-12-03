'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { UserType } from '@/enums/user-type.enum';

import { useAuth } from '@/hooks/useAuth';

import Assignments from './Assignments';
import SubmittedAssignment from './SubmittedAssignment';
import  { FacultyTabData, StudentTabData } from './TabData';
import FacultyExamsManagement from '../exams/FacultyExamsManagement';
import CourseMaterials from '../lms/CourseMaterials';
import UpperTab from '../lms/UpperTab';
import StudentExamParticipate from '../exams/StudentExamParticipate';



const MyCoursesSection = () => {
  const [activeTab, setActiveTab] = useState('materials');
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
        <UpperTab items={FacultyTabData} initial={tab ?? 'materials'} onTabChange={(tab) => setActiveTab(tab)} />
      }
      {user?.type === UserType.STUDENT &&
        <UpperTab items={StudentTabData} initial={tab ?? 'materials'} onTabChange={(tab) => setActiveTab(tab)} />
      }
      {activeTab === 'materials' && <CourseMaterials />}
      {activeTab === 'assignments' && <Assignments />}
      {user?.type === UserType.STUDENT && activeTab === 'submittedAssignments' && <SubmittedAssignment />}
      {user?.type === UserType.FACULTY && activeTab === 'exam' && <FacultyExamsManagement/>}
      {user?.type === UserType.STUDENT && activeTab === 'exam' && <StudentExamParticipate/>}
      {activeTab === 'grading' && <div>Grading Content is empty</div>}
      {activeTab === 'discussion' && <div>Discussion Content</div>}
    </div>
  );
};

export default MyCoursesSection;
