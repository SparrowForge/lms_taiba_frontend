"use client";
import React from 'react';
import CourseCard from '../components/Card/CourseCard';
import CourseSummaryCard from '../components/Card/CourseSummaryCard';
import UpComingEvents from './UpComingEvents';

const CoursePage = () => {
    return (
        <div>
      <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
        <div className="max-w-7xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">Welcome back, John!</h2>
        <CourseSummaryCard/>

          {/* Courses Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Your Courses</h3>
             <CourseCard/>
            </div>

            {/* right-hand sidebar */}
            <UpComingEvents/>
          </div>
        </div>
      </main>
    </div>
    );
};

export default CoursePage;