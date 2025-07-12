'use client';
import React from 'react';

// Sample dynamic data
const courses = [
  {
    title: 'Advanced Mathematics',
    instructor: 'Dr. Sarah Johnson',
    progress: 65,
    nextClass: 'Monday, 10:00 AM',
    assignmentsDue: 2,
  },
  {
    title: 'Programming Fundamentals',
    instructor: 'Prof. Michael Chen',
    progress: 80,
    nextClass: 'Wednesday, 2:00 PM',
    assignmentsDue: 1,
  },
  {
    title: 'Introduction to Psychology',
    instructor: 'Dr. Emma Rodriguez',
    progress: 45,
    nextClass: 'Friday, 1:00 PM',
    assignmentsDue: 0,
  },
];

const CourseCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {courses.map((course, index) => (
        <div
          key={index}
          className="rounded-lg border border-[#333333]/10 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform duration-300"
        >
          {/* Header gradient */}
          <div
            className="h-32"
            style={{
              background:
                'linear-gradient(to right, rgb(167, 115, 42), rgb(249, 244, 142))',
            }}
          ></div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold truncate">{course.title}</h3>
            <p className="text-sm text-muted-foreground">{course.instructor}</p>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div
                className="relative w-full overflow-hidden rounded-full bg-orange-200 h-2"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={course.progress}
              >
                <div
                  className="h-full bg-orange-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>


            <div className="flex justify-between gap-2 pt-2 text-xs">
              <div className="bg-muted rounded p-2">
                <p className="text-muted-foreground">Next Class:</p>
                <p className="font-medium">{course.nextClass}</p>
              </div>
              <div
                className={`rounded p-2 ${course.assignmentsDue === 0
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-orange-50 text-orangeCustom-500'
                  }`}
              >
                <p className="text-muted-foreground">Assignments:</p>
                <p className="font-medium">{course.assignmentsDue} due</p>
              </div>

            </div>
          </div>

          {/* Footer */}
          <button className="inline-flex items-center justify-center w-full h-10 border-t border-[#333333]/10 hover:bg-muted px-4 py-2 text-sm font-medium">
            Enter Course
          </button>
        </div>
      ))}
    </div>
  );
};

export default CourseCard;
