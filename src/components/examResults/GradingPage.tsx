'use client'

import { SaveOutlined, FileTextOutlined, RedoOutlined } from '@ant-design/icons'
import {
    Select,
    Button,
    Table,
    Input,
    Card,
    Row,
    Col,
    Space,
    Tag,
    message,
} from 'antd'
import { useState } from 'react'

interface Student {
    id: string
    name: string
    studentId: string
    rawScore: number | null
    converted: number
    status: 'Saved' | 'Unsaved'
}

export default function GradingPage() {

    const [students, setStudents] = useState<Student[]>([
        {
            id: '1',
            name: 'Ahmed Al-Rashid',
            studentId: 'STU:2024-001',
            rawScore: 0,
            converted: 0.0,
            status: 'Unsaved',
        },
        {
            id: '2',
            name: 'Fatima Hassan',
            studentId: 'STU:2024-002',
            rawScore: 0,
            converted: 0.0,
            status: 'Unsaved',
        },
        {
            id: '3',
            name: 'Mohammed Al-Zahrani',
            studentId: 'STU:2024-003',
            rawScore: 0,
            converted: 0.0,
            status: 'Unsaved',
        },
        {
            id: '4',
            name: 'Omar Al-Qahtani',
            studentId: 'STU:2024-009',
            rawScore: 0,
            converted: 0.0,
            status: 'Unsaved',
        },
    ])

    const handleScoreChange = (studentId: string, value: string) => {
        const numValue = value ? parseFloat(value) : null
        setStudents((prev) =>
            prev.map((student) => {
                if (student.id === studentId) {
                    const converted = numValue ? Math.round((numValue / 100) * 10 * 10) / 10 : 0
                    return {
                        ...student,
                        rawScore: numValue,
                        converted,
                        status: 'Unsaved',
                    }
                }
                return student
            })
        )
    }

    const handleSaveAll = () => {
        setStudents((prev) =>
            prev.map((student) => ({
                ...student,
                status: 'Saved',
            }))
        )
        message.success('All grades saved successfully!')
    }

    const classAverage =
        students.length > 0
            ? (
                (students.reduce((sum, s) => sum + s.converted, 0) / students.length) *
                10
            ).toFixed(1)
            : '0.0'

    const columns = [
        {
            title: 'Student',
            dataIndex: 'name',
            key: 'student',
            width: '30%',
            render: (text: string, record: Student) => (
                <div>
                    <div className="font-semibold">{text}</div>
                    <div className="text-sm text-gray-500">{record.studentId}</div>
                </div>
            ),
        },
        {
            title: 'Raw Score\n(out of 100)',
            dataIndex: 'rawScore',
            key: 'rawScore',
            width: '25%',
            render: (value: number | null, record: Student) => (
                <Input
                    type="number"
                    value={value ?? ''}
                    onChange={(e) => handleScoreChange(record.id, e.target.value)}
                    placeholder="0"
                    style={{ width: '80px' }}
                    min="0"
                    max="100"
                />
            ),
        },
        {
            title: 'Converted\n(out of 10)',
            dataIndex: 'converted',
            key: 'converted',
            width: '20%',
            render: (value: number) => <span>{value.toFixed(1)}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            render: (status: string) => (
                <Tag color={status === 'Saved' ? 'green' : 'warning'}>{status}</Tag>
            ),
        },
    ]

    return (
        <div style={{  backgroundColor: '#f5f5f5', height: '65vh', overflowY: "auto" }}>
            <Card >
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                {/* {gradeType} - {subject} */}
                            </h2>
                            <p style={{ color: '#666', fontSize: '14px' }}>
                                Semester 1 • Enter raw scores out of 100 (converts to 10 marks)
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: '#999' }}>Class Avg</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{classAverage}%</div>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                icon={<SaveOutlined />}
                                onClick={handleSaveAll}
                            >
                                Save All
                            </Button>
                        </div>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={students}
                    rowKey="id"
                    pagination={false}
                    bordered
                    size="middle"
                    style={{ marginTop: '16px', height: '65vh',  }}
                />
            </Card>
        </div>
    )
}
