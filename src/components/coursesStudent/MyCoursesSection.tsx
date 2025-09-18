"use client"

import { useState } from 'react';
import UpperTab from '../lms/UpperTab';
import TabData from './TabData';
import CourseMaterials from '../lms/CourseMaterials';
import Assignments from './Assignments';

const MyCoursesSection = () => {
    const [activeTab, setActiveTab] = useState('materials');
    return (
        <div className='md:my-6'>
            <UpperTab items={TabData} onTabChange={(key) => setActiveTab(key)} />

            {activeTab === 'materials' && <CourseMaterials />}
            {activeTab === 'assignments' && <Assignments />}
            {activeTab === 'grading' && <div>Grading Content is empty</div>}
            {activeTab === 'discussion' && <div>Discussion Content</div>}

        </div>
    );
};

export default MyCoursesSection;