import { Tabs } from 'antd'
import React from 'react'

import StudentGrading from './StudentGrading'
import StudentSemesterGrading from './StudentSemesterGrading'
import StudentSubjectGrading from './StudentSubjectGrading'
import { ProtectedRoute } from '../auth/ProtectedRoute'

const StudentsResult = () => {
  return (
    <ProtectedRoute>

       <Tabs
        defaultActiveKey="exam"
        items={[
          {
            key: 'exam',
            label: 'Exam',
            children:
                <StudentGrading/>
          },
          {
            key: 'subject',
            label: 'Subject',
            children: (
              <StudentSubjectGrading/>
            ),
          },
          {
            key: 'semester',
            label: 'Semester',
            children: (
              <StudentSemesterGrading/>
            ),
          },
        ]}
      />
        
    </ProtectedRoute>
  )
}

export default StudentsResult
