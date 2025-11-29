'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

import Assignments from './Assignments';
import SubmittedAssignment from './SubmittedAssignment';
import TabData from './TabData';
import CourseMaterials from '../lms/CourseMaterials';
import UpperTab from '../lms/UpperTab';




const MyCoursesSection = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const {user} = useAuth()

  useEffect(()=>{
    if(tab){
      setActiveTab(tab)
    }
  },[tab])

  return (
    <div className="md:my-6">
      <UpperTab items={TabData} initial={tab ?? 'materials'} onTabChange={(tab) => setActiveTab(tab)} />

      {activeTab === 'materials' && <CourseMaterials />}
      {activeTab === 'assignments' && <Assignments />}
      {user?.student?.id && activeTab === 'submittedAssignments' && <SubmittedAssignment />}
      {activeTab === 'grading' && <div>Grading Content is empty</div>}
      {activeTab === 'discussion' && <div>Discussion Content</div>}
    </div>
  );
};

export default MyCoursesSection;
