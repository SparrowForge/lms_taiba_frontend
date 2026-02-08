'use client'

import {
  BookOutlined,
  RiseOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { Row, Col, Card } from 'antd'
import React from 'react'

import StudentAcademicDegreeProgress from './StudentAcademicDegreeProgress'
import StudentAcademicSemesters from './StudentAcademicSemesters'
import StudentAcademicStatCard from './StudentAcademicStatCard'

import type { ColProps } from 'antd'

export const mockData = {
  currentSemester: 1,
  creditsEarned: 36,
  cumulativeGPA: 3.42,
  summerCompleted: 0,
  degreeProgress: {
    completed: 36,
    total: 90,
    percentage: 40,
    inProgress: 1,
    upcoming: 4,
  },
  semesters: [
    {
      id: 1,
      number: 1,
      name: 'First Semester',
      status: 'In Progress',
      gpa: 3.42,
      courses: [
        {
          id: 1,
          code: 'MTH101',
          name: 'Engineering Mathematics I',
          credits: 3,
          grade: 'B+',
          status: 'In Progress',
        },
        {
          id: 2,
          code: 'ENG102',
          name: 'English Language I',
          credits: 2,
          grade: 'B',
          status: 'In Progress',
        },
        {
          id: 3,
          code: 'PHY101',
          name: 'Engineering Physics',
          credits: 4,
          grade: 'A-',
          status: 'In Progress',
        },
        {
          id: 4,
          code: 'CMP101',
          name: 'Computer Applications',
          credits: 3,
          grade: 'A-',
          status: 'In Progress',
        },
        {
          id: 5,
          code: 'ENG101',
          name: 'Technical Drawing',
          credits: 3,
          grade: 'A',
          status: 'In Progress',
        },
        {
          id: 6,
          code: 'ISL101',
          name: 'Islamic Studies',
          credits: 3,
          grade: 'B+',
          status: 'In Progress',
        },
      ],
    },
    {
      id: 2,
      number: 2,
      name: 'Second Semester',
      status: 'Upcoming',
      gpa: 3.55,
      courses: [
        {
          id: 7,
          code: 'MTH102',
          name: 'Engineering Mathematics II',
          credits: 3,
          grade: 'A-',
          status: 'Upcoming',
        },
        {
          id: 8,
          code: 'ENG203',
          name: 'English Language II',
          credits: 2,
          grade: 'A',
          status: 'Upcoming',
        },
        {
          id: 9,
          code: 'ENG201',
          name: 'Statics & Dynamics',
          credits: 4,
          grade: 'B+',
          status: 'Upcoming',
        },
        {
          id: 10,
          code: 'CMP102',
          name: 'AutoCAD',
          credits: 3,
          grade: 'A',
          status: 'Upcoming',
        },
        {
          id: 11,
          code: 'EN202',
          name: 'Materials Science',
          credits: 3,
          grade: 'B',
          status: 'Upcoming',
        },
        {
          id: 12,
          code: 'ARB101',
          name: 'Arabic Language',
          credits: 3,
          grade: 'B+',
          status: 'Upcoming',
        },
      ],
    },
    {
      id: 3,
      number: 3,
      name: 'Third Semester',
      status: 'Upcoming',
      courses: [],
    },
  ],
}

export default function StudentAcademicRecord() {
  const statColProps: ColProps = {
    xs: 24,
    sm: 12,
    lg: 6,
  }

  return (
    <div style={{ marginBottom: "100px" }}>
      <div>
        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col {...statColProps}>
            <StudentAcademicStatCard
              icon={<BookOutlined />}
              title="Current Semester"
              value={mockData.currentSemester}
            />
          </Col>
          <Col {...statColProps}>
            <StudentAcademicStatCard
              icon={<StarOutlined />}
              title="Credits Earned"
              value={mockData.creditsEarned}
            />
          </Col>
          <Col {...statColProps}>
            <StudentAcademicStatCard
              icon={<RiseOutlined />}
              title="Cumulative GPA"
              value={mockData.cumulativeGPA}
            />
          </Col>
          <Col {...statColProps}>
            <StudentAcademicStatCard
              icon={<CheckCircleOutlined />}
              title="Summer Completed"
              value={mockData.summerCompleted}
            />
          </Col>
        </Row>

        {/* Degree Progress */}
        <div className="mb-8">
          <StudentAcademicDegreeProgress {...mockData.degreeProgress} />
        </div>

        {/* Semester Timeline */}
        <div>
          <Card><h2 className="text-xl font-bold text-gray-900 mb-6">Semester Timeline</h2></Card>
          {mockData.semesters.map((semester, index) => (
            <StudentAcademicSemesters key={semester.id} semester={semester} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
