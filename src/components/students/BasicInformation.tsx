'use client'

import { EditOutlined, UserOutlined, CalendarOutlined, EnvironmentOutlined, IdcardOutlined } from '@ant-design/icons'
import { Card, Divider, Button, Tag } from 'antd'
import React from "react"

import { IStudent } from '@/types/student'




interface BasicInformationProps {
  student: IStudent | null;
}
export default function BasicInformation({ student }: BasicInformationProps) {
    const InfoItem = ({ label, value, icon }: { label: string; value: string | null; icon?: React.ReactNode }) => (
        <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                {icon}
                <span>{label}</span>
            </div>
            <p className="font-medium text-sm">{value || 'N/A'}</p>
        </div>
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card
                title="Basic Information"
                extra={<Button type="text" size="small" icon={<EditOutlined />} />}
                className="shadow-sm"
            >
                <div className="text-xs text-gray-500 mb-4">Personal identification details</div>

                <InfoItem
                    label="Full Name (English)"
                    value={`${student?.firstName} ${student?.lastName}`}
                    icon={<UserOutlined className="text-blue-500" />}
                />

                <InfoItem
                    label="Student Number"
                    value={student?.registrationNo || null}
                    icon={<IdcardOutlined className="text-blue-500" />}
                />

                <Divider className="my-4" />

                <InfoItem
                    label="National ID"
                    value={student?.profile?.identityNo || null}
                />

                <InfoItem
                    label="Date of Birth"
                    value={student?.profile?.dob ? new Date(student?.profile.dob).toLocaleDateString() : 'N/A'}
                    icon={<CalendarOutlined className="text-blue-500" />}
                />

                <InfoItem
                    label="Place of Birth"
                    value={student?.profile?.placeOfBirth || null}
                    icon={<EnvironmentOutlined className="text-blue-500" />}
                />

                <Divider className="my-4" />

                <Tag color='blue'><InfoItem label="Gender" value={student?.profile?.gender.toUpperCase() || 'N/A'} /></Tag>
                <Tag color='blue'><InfoItem label="Marital Status" value={student?.profile?.maritalStatus.toUpperCase() || 'N/A'} /></Tag>
                {/* <InfoItem label="Religion" value="Islam" /> */}
            </Card>

            <Card
                title="Nationality Information"
                extra={<Button type="text" size="small" icon={<EditOutlined />} />}
                className="shadow-sm"
            >
                <div className="text-xs text-gray-500 mb-4">Student and family nationality details</div>

                <InfoItem label="Student Nationality" value={student?.profile?.placeOfBirth || 'N/A'} />

                <div className="bg-orange-50 border border-orange-200 rounded px-3 py-2 mb-4">
                    <span className="text-xs text-orange-700">{student?.profile?.permanentAddress.country || 'N/A'}</span>
                </div>

                <Divider className="my-4" />

                <InfoItem label="Father's Nationality" value={student?.profile?.placeOfBirth || 'N/A'} />

                <Divider className="my-4" />

                <InfoItem label="Mother's Nationality" value={student?.profile?.placeOfBirth || 'N/A'} />
            </Card>
        </div>
    )
}
