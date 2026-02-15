"use client"
import {  useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ExamSubmissions } from '@/components/examSubmission/ExamSubmissions'
import { MainLayout } from '@/components/layout/MainLayout'

import { useExamSubmissions } from '@/hooks/useExamSubmissions'

const ExamSubmissionDetailsPage = () => {
    const { examSubmissions, loadExamSubmissions } = useExamSubmissions();
    const searchParams = useSearchParams()
    const subjectId = searchParams.get("subjectId")

    useEffect(() => {
        if (subjectId) {
            loadExamSubmissions({ page: 1, limit: 99, subjectId })
        }
    }, [subjectId, loadExamSubmissions])
    return (
        <ProtectedRoute>
            <MainLayout>
                <ExamSubmissions data={examSubmissions} />
            </MainLayout>
        </ProtectedRoute>
    )
}

export default ExamSubmissionDetailsPage
