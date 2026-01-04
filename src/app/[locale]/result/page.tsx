import React from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import StudentsResult from '@/components/result/StudentsResult'


const StudetListResultPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <StudentsResult/>
      </MainLayout>
    </ProtectedRoute>
  )
}

export default StudetListResultPage
