'use client'

import { Badge, Card, Tabs, Empty } from 'antd'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { UserType } from '@/enums/user-type.enum'
import { useAuth } from '@/hooks/useAuth'
import { useExamResults } from '@/hooks/useExamResults'

function calculateGPA(marks: number, total: number) {
    if (!total) return 0
    const p = (marks / total) * 100
    if (p >= 80) return 4
    if (p >= 70) return 3.5
    if (p >= 60) return 3
    if (p >= 50) return 2
    return 0
}

function getGrade(marks: number, total: number) {
    if (!total) return 'F'
    const p = (marks / total) * 100
    if (p >= 80) return 'A'
    if (p >= 70) return 'B'
    if (p >= 60) return 'C'
    if (p >= 50) return 'D'
    return 'F'
}

export default function AcademicResult() {
    const { loadExamResults, examResults } = useExamResults()
    const { user } = useAuth()
    const { id } = useParams()

    useEffect(() => {
        if (user && user.type === UserType.STUDENT && user.student) {
            loadExamResults({
                page: 1,
                limit: 99,
                studentId: user.student.id,
            })
        } else if (id) {
            loadExamResults({
                page: 1,
                limit: 99,
                studentId: id,
            })
        }
    }, [id, loadExamResults, user])

    // If no data, show Empty card
    if (!examResults || examResults.length === 0) {
        return (
            <div className="">
                <Card className="">
                    <Empty
                        description={
                            <span className="text-gray-500">
                                No academic results available
                            </span>
                        }
                    />
                </Card>
            </div>
        )
    }

    const base = examResults[0]

    const summary = useMemo(() => {
        const total = examResults.reduce((s, r) => {
            return r.exam && r.exam.marks ? s + r.exam.marks : s
        }, 0)

        const obtained = examResults.reduce((s, r) => {
            return typeof r.marksObtained === 'number'
                ? s + r.marksObtained
                : s
        }, 0)

        return {
            total,
            obtained,
            gpa: calculateGPA(obtained, total),
            percentage: total ? (obtained / total) * 100 : 0,
        }
    }, [examResults])

    return (
        <div className="min-h-screen">
            <main>
                {/* GPA, Total Exams, Batch Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card>
                        <p className="text-xs uppercase">Current GPA</p>
                        <p className="text-3xl font-bold">{summary.gpa.toFixed(2)}</p>
                        <p className="text-xs">{summary.percentage.toFixed(1)}%</p>
                    </Card>

                    <Card>
                        <p className="text-xs uppercase">Total Exams</p>
                        <p className="text-3xl font-bold">{examResults.length}</p>
                    </Card>

                    <Card>
                        <p className="text-xs uppercase">Batch</p>
                        <p className="font-semibold">
                            {base.exam?.batch?.code ?? 'N/A'}
                        </p>
                    </Card>
                </div>

                {/* Grade Components */}
                <Card className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold">Grade Components</h2>
                    <div className="flex flex-wrap gap-3">
                        {examResults.map((r) => {
                            if (!r.exam?.subject) return null
                            return (
                                <div
                                    key={r.id}
                                    className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3"
                                >
                                    <span className="text-sm">{r.exam.subject.name}</span>
                                    <Badge>
                                        {r.marksObtained ?? 0}/{r.exam.marks ?? 0}
                                    </Badge>
                                </div>
                            )
                        })}
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
                                                    if (!r.exam?.subject) return null
                                                    const grade = getGrade(
                                                        r.marksObtained ?? 0,
                                                        r.exam.marks ?? 0
                                                    )
                                                    return (
                                                        <tr key={r.id}>
                                                            <td>
                                                                <b>{r.exam.subject.code}</b>
                                                                <div>{r.exam.subject.name}</div>
                                                            </td>
                                                            <td align="center">{r.exam.subject.creditHours ?? 0}</td>
                                                            <td align="center">{r.marksObtained ?? 0}/{r.exam.marks ?? 0}</td>
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
                                        {examResults.map((r) => {
                                            if (!r.exam) return null
                                            return (
                                                <div
                                                    key={r.id}
                                                    className="rounded-lg bg-muted p-4"
                                                >
                                                    <h3 className="font-semibold">{r.exam.name ?? 'N/A'}</h3>
                                                    <p>Marks: {r.marksObtained ?? 0}/{r.exam.marks ?? 0}</p>
                                                    <p>Percentage: {r.exam.marks ? ((r.marksObtained ?? 0) / r.exam.marks * 100).toFixed(1) : '0.0'}%</p>
                                                </div>
                                            )
                                        })}
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