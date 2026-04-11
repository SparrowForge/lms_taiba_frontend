'use client';

import { Card, Row, Col, Empty, Tag } from 'antd'
import React from 'react'

import StudentAcademicCourseCards from './StudentAcademicCourseCards';


interface Course {
  id: number
  code: string
  name: string
  credits: number
  grade: string
  status: string
}

interface Semester {
  id: number
  number: number
  name: string
  status: string
  gpa?: number
  courses: Course[]
}

interface SemesterSectionProps {
  semester: Semester
  index: number
}

const StudentAcademicSemesters: React.FC<SemesterSectionProps> = ({ semester, index }) => {


  return (
    <>
      <Card className="semester-section mb-8 my-10" bordered={false}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full"
              style={{
                backgroundColor:
                  semester.status === 'In Progress' ? '#1890FF' : '#D9D9D9',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {semester.number}
            </div>
            <div>
              <div className="font-bold text-gray-900">{semester.name}</div>
              <div className="text-sm text-gray-600">
                {semester.status === 'In Progress'
                  ? 'Currently enrolled'
                  : 'Not started'}
              </div>
            </div>
          </div>
          <div className="text-right">
            {semester.gpa && (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {semester.gpa}
                </div>
                <div className="text-xs text-gray-600">Semester GPA</div>
              </>
            )}
            {semester.status === 'In Progress' && (
              <Tag color="processing" style={{ marginTop: '8px' }}>
                In Progress
              </Tag>
            )}
            {semester.status === 'Upcoming' && (
              <Tag color="default" style={{ marginTop: '8px' }}>
                Upcoming
              </Tag>
            )}
          </div>
        </div>

        {semester.courses.length > 0 ? (
          <Row gutter={[16, 16]}>
            {semester.courses.map((course) => (
              <Col key={course.id} xs={24} sm={24} md={12} lg={8}>
                <StudentAcademicCourseCards course={course} semesterNumber={semester.number} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No courses scheduled" />
        )}
      </Card>

      <style jsx>{`
        :global(.semester-section) {
          border: 1px solid #f0f0f0 !important;
          border-radius: 8px !important;
          background: white !important;
        }
      `}</style>
    </>
  )
}

export default StudentAcademicSemesters
