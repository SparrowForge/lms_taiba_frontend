'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';


import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import Quiz from '@/components/participateExam/Quiz';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import { useExams } from '@/hooks/useExams';



export default function ParticipateExamMCQ() {
    const { t } = useLocalization();
    const router = useRouter();
    // const entityName = t({ defaultValue: 'Participate Exam' });


    const handleQuizSubmit = async (answers: Record<number, string>) => {
        console.log("Quiz submitted with answers:", answers)

    }

    return (
        <ProtectedRoute>
            <MainLayout>
                <PageHeader
                    title="Participate Exam"
                    onBack={() => router.back()}
                />
                <Quiz
                    title="Sample Quiz"
                    onSubmit={handleQuizSubmit}
                    onCancel={() => console.log("Quiz cancelled")}
                />
            </MainLayout>
        </ProtectedRoute>
    );
}
