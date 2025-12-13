import React from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import StudentResultAssign from '@/components/result/StudentsResultAssign'


const StudetListResultPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <StudentResultAssign/>
      </MainLayout>
    </ProtectedRoute>
  )
}

export default StudetListResultPage
