import React from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import StudentResultAssign from '@/components/result/StudentsResultAssign'

const ResultCreatePage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <StudentResultAssign />
      </MainLayout>
    </ProtectedRoute>
  )
}

export default ResultCreatePage
