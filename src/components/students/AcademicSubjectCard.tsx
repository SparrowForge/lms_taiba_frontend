// SubjectCard.tsx
'use client'

import React from 'react'

import { ISemesterSubject } from '@/types/semesterSubject'



interface SubjectCardProps {
    subject: ISemesterSubject
    semesterId: number
}

const AcademicSubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
    const { subject: subj, semester } = subject

    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-md transition duration-200">
            <h3 className="text-lg font-semibold">{subj.name}</h3>
            <p className="text-sm text-gray-500">Code: {subj.code}</p>
            <p className="text-sm text-gray-500">Credit Hours: {subj.creditHours}</p>
            <p className="text-sm text-gray-500">
                Semester: {semester.name} (Term {semester.termNo})
            </p>
            <p className="text-sm text-gray-500">
                Duration: {new Date(semester.startDate).toLocaleDateString()} -{' '}
                {new Date(semester.endDate).toLocaleDateString()}
            </p>
        </div>
    )
}

export default AcademicSubjectCard
