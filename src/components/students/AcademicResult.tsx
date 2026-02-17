'use client'

import { Badge, Card, Tabs } from 'antd'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { UserType } from '@/enums/user-type.enum'

import { useAuth } from '@/hooks/useAuth'
import { useExamResults } from '@/hooks/useExamResults'

function calculateGPA(marks: number, total: number) {
    const p = (marks / total) * 100
    if (p >= 80) return 4
    if (p >= 70) return 3.5
    if (p >= 60) return 3
    if (p >= 50) return 2
    return 0
}

function getGrade(marks: number, total: number) {
    const p = (marks / total) * 100
    if (p >= 80) return 'A'
    if (p >= 70) return 'B'
    if (p >= 60) return 'C'
    if (p >= 50) return 'D'
    return 'F'
}

export default function AcademicResult() {
    const { loadExamResults, examResults = [] } = useExamResults()
    const { user } = useAuth()
    const { id } = useParams()

    useEffect(() => {
        if (user?.type === UserType.STUDENT) {
            loadExamResults({ page: 1, limit: 99, studentId: user?.student?.id })
        } else if (id) {
            loadExamResults({ page: 1, limit: 99, studentId: id })
        }
    }, [id, loadExamResults, user])

    const base = examResults[0]

    const summary = useMemo(() => {
        if (!examResults.length) return null

        const total = examResults.reduce((s, r) => s + r.exam.marks, 0)
        const obtained = examResults.reduce(
            (s, r) => s + r.marksObtained,
            0
        )

        return {
            total,
            obtained,
            gpa: calculateGPA(obtained, total),
            percentage: (obtained / total) * 100,
        }
    }, [examResults])

    if (!base || !summary) return null

    return (
        <div className="min-h-screen">


            <main className=" ">
                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                    <Card>
                        <p className="text-xs uppercase">Current GPA</p>
                        <p className="text-3xl font-bold">
                            {summary.gpa.toFixed(2)}
                        </p>
                        <p className="text-xs">{summary.percentage.toFixed(1)}%</p>
                    </Card>

                    <Card>
                        <p className="text-xs uppercase">Credits Earned</p>
                        <p className="text-3xl font-bold">
                            {examResults.reduce(
                                (s, r) => s + r.exam.subject.creditHours,
                                0
                            )}
                        </p>
                    </Card>

                    <Card>
                        <p className="text-xs uppercase">Subjects</p>
                        <p className="text-3xl font-bold">{examResults.length}</p>
                    </Card>

                    <Card>
                        <p className="text-xs uppercase">Semester</p>
                        <p className="font-semibold">{base.exam.semester.name}</p>
                    </Card>

                    <Card>
                        <p className="text-xs uppercase">Session</p>
                        <p className="font-semibold">{base.exam.batch.code}</p>
                    </Card>
                </div>

                {/* Grade Components */}
                <Card className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold">Grade Components</h2>
                    <div className="flex flex-wrap gap-3">
                        {examResults.map((r) => (
                            <div
                                key={r.id}
                                className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3"
                            >
                                <span className="text-sm">{r.exam.subject.name}</span>
                                <Badge>
                                    {r.marksObtained}/{r.exam.marks}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Tabs */}
                <Card>
                    <Tabs
                        defaultActiveKey="summary"
                        items={[
                            {
                                key: 'summary',
                                label: 'Summary',
                                children: (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Credits</th>
                                                    <th>Final</th>
                                                    <th>Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {examResults.map((r) => {
                                                    const grade = getGrade(
                                                        r.marksObtained,
                                                        r.exam.marks
                                                    )

                                                    return (
                                                        <tr key={r.id}>
                                                            <td>
                                                                <b>{r.exam.subject.code}</b>
                                                                <div>{r.exam.subject.name}</div>
                                                            </td>
                                                            <td align="center">
                                                                {r.exam.subject.creditHours}
                                                            </td>
                                                            <td align="center">
                                                                {r.marksObtained}/{r.exam.marks}
                                                            </td>
                                                            <td align="center">
                                                                <Badge>{grade}</Badge>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ),
                            },
                            {
                                key: 'assessment',
                                label: 'Class Assessment',
                                children: (
                                    <p className="text-muted-foreground p-4">
                                        No class assessment data available
                                    </p>
                                ),
                            },
                            {
                                key: 'midterm',
                                label: 'Mid-Term Exams',
                                children: (
                                    <p className="text-muted-foreground p-4">
                                        No mid-term exam data available
                                    </p>
                                ),
                            },
                            {
                                key: 'final',
                                label: 'Final Exam',
                                children: (
                                    <div className="p-4 space-y-4">
                                        {examResults.map((r) => (
                                            <div
                                                key={r.id}
                                                className="rounded-lg bg-muted p-4"
                                            >
                                                <h3 className="font-semibold">
                                                    {r.exam.name}
                                                </h3>
                                                <p>
                                                    Marks: {r.marksObtained}/{r.exam.marks}
                                                </p>
                                                <p>
                                                    Percentage:{' '}
                                                    {(
                                                        (r.marksObtained / r.exam.marks) *
                                                        100
                                                    ).toFixed(1)}
                                                    %
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </Card>
            </main>
        </div>
    )
}
