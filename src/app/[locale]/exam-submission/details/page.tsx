'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ExamSubmissions } from '@/components/examSubmission/ExamSubmissions'
import { MainLayout } from '@/components/layout/MainLayout'

import { useExamSubmissions } from '@/hooks/useExamSubmissions'
import { useLocalization } from '@/hooks/useLocalization'
import { LOCALE_KEYS } from '@/constants/localizationKeys'
import { PageHeader } from '@/components/ui/PageHeader'

const ExamSubmissionDetailsPage = () => {
  const { examSubmissions, loadExamSubmissions } = useExamSubmissions()
  const searchParams = useSearchParams()
  const subjectId = searchParams.get('subjectId')
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });
  const router = useRouter()

  useEffect(() => {
    if (subjectId) {
      loadExamSubmissions({ page: 1, limit: 99, subjectId })
    }
  }, [subjectId, loadExamSubmissions])

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.REVIEW_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <ExamSubmissions data={examSubmissions} />
      </MainLayout>
    </ProtectedRoute>
  )
}

export default ExamSubmissionDetailsPage
