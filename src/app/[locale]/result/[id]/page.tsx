import React from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import StudentResultSheet from '@/components/result/StudentResultSheet'

const StudentResultDetailPage = () => {
  return (
    <ProtectedRoute>
        <MainLayout>
            <StudentResultSheet/>
        </MainLayout>
    </ProtectedRoute>
  )
}

export default StudentResultDetailPage
