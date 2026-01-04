import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import QuestionPaperPage from '@/components/questionSet/QuestionPaperPage'
import React from 'react'

const QuestionSetDetails = () => {
  return (
    <ProtectedRoute>
        <MainLayout>
            <QuestionPaperPage/>
        </MainLayout>
    </ProtectedRoute>
  )
}

export default QuestionSetDetails
