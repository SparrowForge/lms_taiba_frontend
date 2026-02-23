'use client'

import { CheckCircleOutlined, HomeOutlined, FilePdfOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Space, Spin, Statistic } from 'antd'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import { LOCALE_KEYS } from '@/constants/localizationKeys'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { PageHeader } from '@/components/ui/PageHeader'

import { useLocalization } from '@/hooks/useLocalization'


export default function ExamCompletionPage() {
    const { t } = useLocalization();
    const router = useRouter();
    const entityName = t(LOCALE_KEYS.EXAM_SUBMISSION, { defaultValue: 'Exam Submission' });
    const [loading, setLoading] = useState(true)
    const [submissionTime] = useState(new Date().toLocaleString())

    useEffect(() => {
        // Simulate submission processing
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <Spin size="large" tip="Processing your submission..." />
            </div>
        )
    }

    return (
        <ProtectedRoute>
            <MainLayout>
                {/* <PageHeader
                    title={t(LOCALE_KEYS.PARTICIPATE_EXAM, { name: entityName })}
                    onBack={() => router.back()}
                /> */}
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <CheckCircleOutlined
                                style={{
                                    fontSize: '72px',
                                    color: '#10b981',
                                    marginBottom: '16px',
                                }}
                            />
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                                Exam Completed!
                            </h1>
                            <p className="text-lg text-gray-600">
                                Your exam has been successfully submitted
                            </p>
                        </div>

                        {/* Confirmation Card */}
                        <Card
                            className="mb-8 shadow-lg"
                            style={{
                                borderTop: '4px solid #10b981',
                            }}
                        >
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div className="grid grid-cols-2 gap-4 md:gap-6">
                                    <Statistic
                                        title="Submission Status"
                                        value="Successful"
                                        valueStyle={{ color: '#10b981', fontSize: '18px' }}
                                        prefix="✓ "
                                    />
                                    <Statistic
                                        title="Submitted At"
                                        value={submissionTime}
                                        valueStyle={{ fontSize: '14px' }}
                                    />
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                    <p className="text-gray-700">
                                        <strong>Confirmation:</strong> Your exam responses have been recorded and
                                        submitted successfully. You will receive an email confirmation shortly.
                                    </p>
                                </div>

                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                   
                                    <p className="text-sm text-gray-600">
                                        <strong>Status:</strong> Awaiting Review
                                    </p>
                                </Space>
                            </Space>
                        </Card>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                                type="primary"
                                size="large"
                                icon={<HomeOutlined />}
                                onClick={() => (window.location.href = '/')}
                                style={{marginTop:"16px"}}
                            >
                                Go to Home
                            </Button>
                          
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 text-center text-gray-600 text-sm">
                            <p>
                                If you have any questions about your exam, please contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </ProtectedRoute>
    )
}
