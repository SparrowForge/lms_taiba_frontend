'use client'

import {
    PlusOutlined,
    BookOutlined,
    CalendarOutlined,
} from '@ant-design/icons'
import { Card, Button, Tag, Space,  } from 'antd'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useStudentEducations } from '@/hooks/useStudentEducations'

import StudentEducationFormDrawer from '../studentEducations/StudentEducationFormDrawer'

const getDegreeTypeLabel = (
    degreeType: string,
): { label: string; color: string } => {
    const types: Record<string, { label: string; color: string }> = {
        'High School': { label: 'High School', color: '#ff6b35' },
        'Middle School': { label: 'Middle School', color: '#ff6b35' },
        'Primary School': { label: 'Primary School', color: '#ff6b35' },
        'Higher Secondary Certificate': { label: 'HSC', color: '#ff6b35' },
        'Secondary School Certificate': { label: 'SSC', color: '#ff6b35' },
    }

    return types[degreeType] || { label: degreeType, color: '#ff6b35' }
}

export default function PreviousAcademicHistory() {

    const { loadStudentEducations, studentEducations } =
        useStudentEducations()
    const { id } = useParams()
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [selectedStudentEducationId, setSelectedStudentEducationId] = useState<
        number | undefined
    >();

    const handleCreateDrawer = () => {
        setSelectedStudentEducationId(undefined);
        setDrawerMode('create');
        setDrawerVisible(true);
    };

    const handleDrawerSuccess = () => {
        setDrawerVisible(false);
        loadStudentEducations({ page: 1, limit: 10 });
    };

    useEffect(() => {
        if (id) {
            loadStudentEducations({
                page: 1,
                limit: 99,
                studentId: id,
            })
        }
    }, [loadStudentEducations, id])


    const educations = studentEducations ?? []

    if (educations.length === 0) {
        return (
            <Card className="mt-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <BookOutlined className="text-2xl text-gray-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Previous Academic History
                            </h3>
                            <p className="text-sm text-gray-500">
                                Educational background before enrollment
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                        No education history records.
                    </p>
                </div>

            </Card>
        )
    }

    return (
        <>
            <Card className="mt-6 rounded-lg min-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <BookOutlined className="text-2xl text-gray-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Previous Academic History
                            </h3>
                            <p className="text-sm text-gray-500">
                                Educational background before enrollment
                            </p>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        danger
                        icon={<PlusOutlined />}
                        onClick={handleCreateDrawer}
                        className="flex items-center gap-2"
                    >
                        Add Education
                    </Button>
                </div>

                <div className="space-y-4 ">
                    {educations.map((education, index) => {
                        const degreeInfo = getDegreeTypeLabel(
                            education.degreeType,
                        )

                        return (
                            <Card
                                key={education.id ?? index}
                                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow mb-10"
                                styles={{ body: { padding: '24px' } }}
                                style={{margin:"40px 0"}}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <BookOutlined className="text-xl text-orange-500" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-800">
                                                        {education.institute}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {education.degreeName}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Tag
                                                        color={degreeInfo.color}
                                                        className="text-white font-medium"
                                                    >
                                                        {degreeInfo.label}
                                                    </Tag>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-orange-500">
                                                            {education.result === '5'
                                                                ? 'A'
                                                                : education.result === '4'
                                                                    ? 'B'
                                                                    : education.result === '3'
                                                                        ? 'C'
                                                                        : 'D'}{' '}
                                                            (92%)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-3">
                                                <Space size="small">
                                                    <CalendarOutlined className="text-gray-500" />
                                                    <span>{education.passingYear}</span>
                                                </Space>

                                                {/* <Space size="small">
                                                <EnvironmentOutlined className="text-gray-500" />
                                                <span>Riyadh, Saudi Arabia</span>
                                            </Space> */}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-xs text-gray-500 font-semibold mb-2">
                                                    GROUP / MAJOR
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {education.groupMajor}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </Card>

            <StudentEducationFormDrawer
                mode={drawerMode}
                studentEducationId={selectedStudentEducationId}
                visible={drawerVisible}
                onCancel={() => setDrawerVisible(false)}
                onSuccess={handleDrawerSuccess}
            />

        </>
    )
}
