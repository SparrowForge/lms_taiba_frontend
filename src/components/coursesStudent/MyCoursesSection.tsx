'use client';

import { useState } from 'react';

import Assignments from './Assignments';
import TabData from './TabData';
import CourseMaterials from '../lms/CourseMaterials';
import UpperTab from '../lms/UpperTab';

const MyCoursesSection = () => {
  const [activeTab, setActiveTab] = useState('materials');
  return (
    <div className="md:my-6">
      <UpperTab items={TabData} onTabChange={(key) => setActiveTab(key)} />

      {activeTab === 'materials' && <CourseMaterials />}
      {activeTab === 'assignments' && <Assignments />}
      {activeTab === 'grading' && <div>Grading Content is empty</div>}
      {activeTab === 'discussion' && <div>Discussion Content</div>}
    </div>
  );
};

export default MyCoursesSection;
