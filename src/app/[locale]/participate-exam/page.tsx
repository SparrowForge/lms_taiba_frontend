'use client';
import { useRouter } from 'next/navigation';
import React  from 'react';
import { toast } from 'react-toastify';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import Quiz from '@/components/participateExam/Quiz';
import { PageHeader } from '@/components/ui/PageHeader';
import { useExamSubmissions } from '@/hooks/useExamSubmissions';
import { useLocalization } from '@/hooks/useLocalization';
import { getErrorMessage } from '@/types/errors';
import { IExamSubmissionCreate } from '@/types/examSubmission';


export default function ParticipateExamPage() {
    const { t } = useLocalization();
    const router = useRouter();
    const entityName = t(LOCALE_KEYS.EXAM_SUBMISSION, { defaultValue: 'Exam Submission' });
    const { createExamSubmission } = useExamSubmissions();

    const handleQuizSubmit = async (answers: IExamSubmissionCreate) => {
        try {
            await createExamSubmission(answers as IExamSubmissionCreate);
            toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
            router.push('/exam-complete');
        } catch (error: unknown) {
            let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
                name: entityName,
                defaultValue: `Failed to submit ${entityName.toLowerCase()}`,
            });
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { message?: string } } };
                if (apiError.response?.data?.message) {
                    errorMessage = apiError.response.data.message;
                }
            } else {
                errorMessage = getErrorMessage(error);
            }
            toast.error(errorMessage);
        }
    }
    return (
        <ProtectedRoute>
            <MainLayout>
                <PageHeader
                    title={t(LOCALE_KEYS.PARTICIPATE_EXAM, { name: entityName })}
                    onBack={() => router.back()}
                />
                <Quiz
                    title="Sample Quiz"
                    onSubmit={handleQuizSubmit}
                />
            </MainLayout>
        </ProtectedRoute>
    );
}
