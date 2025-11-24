'use client';

import { useEffect, useState } from 'react';

import Assignments from './Assignments';
import TabData from './TabData';
import CourseMaterials from '../lms/CourseMaterials';
import UpperTab from '../lms/UpperTab';

import { useSearchParams } from 'next/navigation';

const MyCoursesSection = () => {
  const [activeTab, setActiveTab] = useState('');
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(()=>{
    if(tab){
      setActiveTab(tab)
    }
  },[tab])

  return (
    <div className="md:my-6">
      <UpperTab items={TabData} initial={tab} onTabChange={(tab) => setActiveTab(tab)} />

      {activeTab === 'materials' && <CourseMaterials />}
      {activeTab === 'assignments' && <Assignments />}
      {activeTab === 'grading' && <div>Grading Content is empty</div>}
      {activeTab === 'discussion' && <div>Discussion Content</div>}
    </div>
  );
};

export default MyCoursesSection;
