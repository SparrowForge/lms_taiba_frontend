import React from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { FinalExamResultManagement } from '@/components/examResults/FinalExamResultManagement'
import { MainLayout } from '@/components/layout/MainLayout'
import StudentResultAssign from '@/components/result/StudentsResultAssign'

const ResultCreatePage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <StudentResultAssign />
        {/* <FinalExamResultManagement/> */}
      </MainLayout>
    </ProtectedRoute>
  )
}

export default ResultCreatePage
