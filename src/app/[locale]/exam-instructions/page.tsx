import React from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ExamInstruction from '@/components/examInstructions/ExamInstruction'
import { MainLayout } from '@/components/layout/MainLayout'


const ExamInstructionPage = () => {
  return (
     <ProtectedRoute>
          <MainLayout>
            <ExamInstruction/>
          </MainLayout>
        </ProtectedRoute>
  )
}

export default ExamInstructionPage
