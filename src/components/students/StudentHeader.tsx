'use client'

import { PrinterOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons'
import { Card, Tag, Row, Col, Button, Space, } from 'antd'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useStudents } from '@/hooks/useStudents'

import type { IStudent, } from '@/types/student'

import StudentFormDrawer from './StudentFormDrawer'

interface StudentHeaderProps {
  student: IStudent | null
}

export default function StudentHeader({ student }: StudentHeaderProps) {
  const { id } = useParams()
  const [initials, setInitials] = useState('')
  useEffect(() => {
    if (student?.firstName && student?.lastName) {
      setInitials(student.firstName.charAt(0) + student.lastName.charAt(0));
    }
  }, [student]);
  const { loadStudent } = useStudents()

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>();

  const handleEditDrawer = (studentId: number) => {
    setSelectedStudentId(studentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadStudent(Number(id));
  };



  return (
    <div className="mb-6">
      <Card className="shadow-sm">
        <Row gutter={[24, 24]} align="middle">
          <Col span={24} md={6}>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {student?.firstName} {student?.lastName}
                </h1>
                <p className="text-gray-600 mb-2">{student?.profile?.email}</p>
                <Tag color="green">Active</Tag>
              </div>
            </div>
          </Col>

          <Col span={24} md={6}>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-xs text-gray-500 mb-1">PROGRAM</p>
              <p className="font-semibold text-sm">{student?.course?.name}</p>
              <p className="text-xs text-gray-600">{student?.course?.code}</p>
            </div>
          </Col>

          <Col span={24} md={6}>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-xs text-gray-500 mb-1">BATCH</p>
              <p className="font-semibold text-sm">{student?.batch?.name}</p>
              <p className="text-xs text-gray-600">{student?.batch?.code}</p>
            </div>
          </Col>

          <Col span={24} md={6}>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-xs text-gray-500 mb-1">FEE STATUS</p>
              <Tag color="orange" className="mb-1">Assigned</Tag>
              <p className="text-xs text-gray-500 mt-5">{student?.feeStructure?.totalFees} {student?.feeStructure?.currency}</p>
            </div>
          </Col>


        </Row>

        <Row justify="end" className="mt-6 pt-4">
          <Space>
            <Button onClick={() => window.print()} icon={<PrinterOutlined />}>Print</Button>
            <Button onClick={() => handleEditDrawer(Number(id))} type="primary" icon={<EditOutlined />}>
              Edit Profile
            </Button>
          </Space>
        </Row>
      </Card>

      <StudentFormDrawer
        mode={drawerMode}
        studentId={selectedStudentId}
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  )
}
