'use client';

import { Card, Badge } from 'antd'
import React from 'react'



interface Course {
  id: number
  code: string
  name: string
  credits: number
  grade: string
  status: string
}

interface CourseCardProps {
  course: Course
  semesterNumber: number
}

export const gradeColors: Record<string, string> = {
  'A+': '#52C41A',
  A: '#52C41A',
  'A-': '#52C41A',
  'B+': '#1890FF',
  B: '#1890FF',
  'B-': '#1890FF',
  C: '#FAAD14',
  'C+': '#FAAD14',
  D: '#F5222D',
  F: '#F5222D',
}


const StudentAcademicCourseCards: React.FC<CourseCardProps> = ({ course }) => {
  const gradeColor = gradeColors[course.grade] || '#1890FF'

  return (
    <>
      <Card className="course-card mb-3" bordered={false}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{course.name}</div>
            <div className="text-sm text-gray-600 mt-1">
              {course.code} • {course.credits} credits
            </div>
          </div>
          <Badge
            count={course.grade}
            style={{
              backgroundColor: gradeColor,
              marginRight: '0px',
              minWidth: '48px',
              height: '48px',
              lineHeight: '48px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '50%',
            }}
          />
        </div>
      </Card>

      <style jsx>{`
        :global(.course-card) {
          border: 1px solid #f0f0f0 !important;
          border-radius: 8px !important;
          background: white !important;
          transition: all 0.3s ease;
        }

        :global(.course-card:hover) {
          box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
            0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  )
}

export default StudentAcademicCourseCards
