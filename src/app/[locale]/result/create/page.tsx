import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import StudentsResult from '@/components/result/StudentsResult'
import React from 'react'

const ResultCreatePage = () => {
  return (
    <ProtectedRoute>
    <MainLayout>
        <StudentsResult/>
    </MainLayout>
    </ProtectedRoute>
  )
}

export default ResultCreatePage
