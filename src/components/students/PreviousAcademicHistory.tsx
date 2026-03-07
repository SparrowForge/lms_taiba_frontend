'use client'

import {
    PlusOutlined,
    BookOutlined,
    CalendarOutlined,
} from '@ant-design/icons'
import { Card, Button, Tag, Space, Empty, Select, Typography, } from 'antd'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useStudentEducations } from '@/hooks/useStudentEducations'

import StudentEducationFormDrawer from '../studentEducations/StudentEducationFormDrawer'
import { useLocalization } from '@/hooks/useLocalization'
import { useTranslations } from 'next-intl'
import { LOCALE_KEYS } from '@/constants/localizationKeys'
import { toast } from 'react-toastify'
import { useStudents } from '@/hooks/useStudents'
import { useAuth } from '@/hooks/useAuth'

const getDegreeTypeLabel = (
    degreeType: string,
): { label: string; color: string } => {
    const types: Record<string, { label: string; color: string }> = {
        'High School': { label: 'High School', color: '#4096FF' },
        'Middle School': { label: 'Middle School', color: '#4096FF' },
        'Primary School': { label: 'Primary School', color: '#4096FF' },
        'Higher Secondary Certificate': { label: 'HSC', color: '#4096FF' },
        'Secondary School Certificate': { label: 'SSC', color: '#4096FF' },
    }

    return types[degreeType] || { label: degreeType, color: '#4096FF' }
}



export default function PreviousAcademicHistory() {
    const { editStudent } = useStudents()
    const { loadStudentEducations, studentEducations } =
        useStudentEducations()
    const { id } = useParams()
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [selectedStudentEducationId, setSelectedStudentEducationId] = useState<
        number | undefined
    >();

    const { user } = useAuth()

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
        } else if (user?.student?.id) {
            loadStudentEducations({
                page: 1,
                limit: 1,
                studentId: Number(user.student.id),
            })
        }
    }, [loadStudentEducations, id, user?.student?.id])




    const educations = studentEducations ?? []

    return (
        <Card title={
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 ">
                    Previous Academic History
                </h3>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateDrawer}
                    className="flex items-center gap-2"
                >
                    Add Education
                </Button>
            </div>
        }>
        
            {
                educations.length === 0 ? <Empty description="No education history records." />
                    : <div className="rounded-lg overflow-y-auto">
                        <div className="space-y-4 ">
                           
                            {educations.map((education, index) => {
                                const degreeInfo = getDegreeTypeLabel(
                                    education.degreeType,
                                )

                                return (
                                    <Card
                                        key={education.id ?? index}
                                        className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow mb-2"
                                        styles={{ body: { padding: '24px' } }}
                                        style={{ margin: "10px 0" }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <BookOutlined className="text-xl text-blue-500" />
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
                                                                <p className="text-lg font-semibold text-blue-500">
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
                    </div>
            }


            <StudentEducationFormDrawer
                mode={drawerMode}
                studentEducationId={selectedStudentEducationId}
                visible={drawerVisible}
                onCancel={() => setDrawerVisible(false)}
                onSuccess={handleDrawerSuccess}
            />

        </Card>
    )
}
