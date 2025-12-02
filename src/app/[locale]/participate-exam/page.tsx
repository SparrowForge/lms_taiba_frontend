'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import QuestionSet from '@/components/questionSet/QuestionSet';
import QuizParticipant from '@/components/participateExam/QuizParticipant';

// Sample questions for demonstration
const SAMPLE_QUESTIONS = [
    {
        id: "1",
        questionText: "What is the capital of France?",
        options: [
            { text: "London", order: 0 },
            { text: "Paris", order: 1 },
            { text: "Berlin", order: 2 },
            { text: "Madrid", order: 3 },
        ],
        correctOptionNumber: "b",
        difficultyLevel: "easy" as const,
    },
    {
        id: "2",
        questionText: "Which planet is known as the Red Planet?",
        options: [
            { text: "Venus", order: 0 },
            { text: "Jupiter", order: 1 },
            { text: "Mars", order: 2 },
            { text: "Saturn", order: 3 },
        ],
        correctOptionNumber: "c",
        difficultyLevel: "easy" as const,
    },
    {
        id: "3",
        questionText: "What is the chemical symbol for the element Gold?",
        options: [
            { text: "Go", order: 0 },
            { text: "Gd", order: 1 },
            { text: "Au", order: 2 },
            { text: "Ag", order: 3 },
        ],
        correctOptionNumber: "c",
        difficultyLevel: "medium" as const,
    },
    {
        id: "4",
        questionText: "Who wrote 'Romeo and Juliet'?",
        options: [
            { text: "Jane Austen", order: 0 },
            { text: "William Shakespeare", order: 1 },
            { text: "Charles Dickens", order: 2 },
            { text: "Mark Twain", order: 3 },
        ],
        correctOptionNumber: "b",
        difficultyLevel: "easy" as const,
    },
    {
        id: "5",
        questionText: "What is the derivative of x³ + 2x² - 5x + 7?",
        options: [
            { text: "3x² + 4x - 5", order: 0 },
            { text: "3x² - 2x - 5", order: 1 },
            { text: "x² + 2x - 5", order: 2 },
            { text: "3x + 4 - 5", order: 3 },
        ],
        correctOptionNumber: "a",
        difficultyLevel: "hard" as const,
    },
]


export default function ParticipateExamMCQ() {
    const { t } = useLocalization();
    const router = useRouter();
    // const entityName = t({ defaultValue: 'Participate Exam' });

    const handleQuizSubmit = async (answers: Record<number, string>) => {
        console.log("Quiz submitted with answers:", answers)
        // You can send this to your backend here
        alert(`Quiz submitted! Answers: ${JSON.stringify(answers, null, 2)}`)
    }

    return (
        <ProtectedRoute>
            <MainLayout>
                <PageHeader
                    title="Participate Exam"
                    onBack={() => router.back()}
                />

                <QuizParticipant
                    questions={SAMPLE_QUESTIONS}
                    title="Sample Quiz"
                    onSubmit={handleQuizSubmit}
                    onCancel={() => console.log("Quiz cancelled")}
                />
            </MainLayout>
        </ProtectedRoute>
    );
}
