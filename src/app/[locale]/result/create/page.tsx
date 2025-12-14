import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'

import StudentResultAssign from '@/components/result/StudentsResultAssign'
import React from 'react'

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
