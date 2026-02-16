"use client"
import { FileTextOutlined, RedoOutlined } from '@ant-design/icons'
import {
  Select,
  Button,
  Card,
  Row,
  Col,
  Space,
  Empty,
} from 'antd'
import React, { useEffect, useState } from 'react'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import GradingPage from '@/components/examResults/GradingPage'
import { MainLayout } from '@/components/layout/MainLayout'
import StudentResultAssign from '@/components/result/StudentsResultAssign'

import { useBatches } from '@/hooks/useBatches'
import { useExams } from '@/hooks/useExams'
import { useExamTypes } from '@/hooks/useExamTypes'
import { useSemesters } from '@/hooks/useSemesters'
import { useSemesterSubjects } from '@/hooks/useSemesterSubjects'
import { FinalExamResultManagement } from '@/components/examResults/FinalExamResultManagement'



const ResultCreatePage = () => {
  const [selectedBatch, setSelectedBatch] = useState()
  const [selectedSemester, setSelectedSemester] = useState()
  const [selectedSemesterSubject, setSelectedSemesterSubject] = useState()
  const [selectedGradeType, setSelectedGradeType] = useState<number | undefined>()
  const [selectedExam, setSelectedExam] = useState()
  const { batches, loadBatches } = useBatches()
  const { semesters, loadSemesters } = useSemesters()
  const { semesterSubjects, loadSemesterSubjects } = useSemesterSubjects()
  const { examTypes, loadExamTypes } = useExamTypes()
  const { exams, loadExams } = useExams()



  useEffect(() => {
    loadBatches({ page: 1, limit: 99 })
  }, [loadBatches])

  useEffect(() => {
    loadExamTypes({ page: 1, limit: 99 })
  }, [loadExamTypes])

  useEffect(() => {
    if (selectedGradeType && selectedSemester && selectedSemesterSubject) {
      loadExams({ page: 1, limit: 99, examTypeId: selectedGradeType, subjectId: selectedSemesterSubject, semesterId: selectedSemester })
    }
  }, [loadExams, selectedGradeType, selectedSemester, selectedSemesterSubject])

  useEffect(() => {
    if (selectedBatch) {
      loadSemesters({ page: 1, limit: 99 })
    }
  }, [selectedBatch, loadSemesters])

  useEffect(() => {
    if (selectedSemester) {
      loadSemesterSubjects({ page: 1, limit: 99 })
    }
  }, [selectedSemester, loadSemesterSubjects])

  const renderTabContent = () => {
    if (selectedGradeType === undefined || selectedExam === undefined) return null
    switch (selectedGradeType) {
      case 1:
        return <StudentResultAssign examId={selectedExam} />
      case 2:
        return <GradingPage />
      case 3:
        return <FinalExamResultManagement />
      default:
        return <Empty description="Select a batch to start grading" />
    }
  }



  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ marginBottom: '32px', padding: "8px 16px" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                Grading
              </h1>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Enter and manage student grades by semester and assessment type
              </p>
            </div>

          </div>

          <Space style={{ marginBottom: '24px' }}>
            <Button
              type="default"
              size="large"
              icon={<FileTextOutlined />}
              style={{
                borderRadius: '6px',
                paddingLeft: '20px',
                paddingRight: '20px',
              }}
            >
              Grade Entry
            </Button>
            <Button
              type="default"
              size="large"
              icon={<RedoOutlined />}
              style={{
                borderRadius: '6px',
                paddingLeft: '20px',
                paddingRight: '20px',
              }}
            >
              Retake Exams
            </Button>
          </Space>
        </div>
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={4}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Batch</label>
              </div>
              <Select
                value={selectedBatch}
                onChange={setSelectedBatch}
                style={{ width: '100%' }}
                options={batches.map(batch => ({ label: batch.name, value: batch.id }))}
                placeholder="Select Batch"
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Semester</label>
              </div>
              <Select
                value={selectedSemester}
                onChange={setSelectedSemester}
                style={{ width: '100%' }}
                options={semesters.map(semester => ({ label: semester.name, value: semester.id }))}
                placeholder="Select Semester"
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Subject</label>
              </div>
              <Select
                value={selectedSemesterSubject}
                onChange={setSelectedSemesterSubject}
                style={{ width: '100%' }}
                options={semesterSubjects.map(semesterSubject => ({ label: semesterSubject.subject.name, value: semesterSubject.subjectId }))}
                placeholder="Select Subject"
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Grade Type</label>
              </div>
              <Select
                value={selectedGradeType}
                onChange={setSelectedGradeType}
                style={{ width: '100%' }}
                options={examTypes.map(item => ({ label: item.name, value: item.id }))}
                placeholder="Select Grade"
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Exam</label>
              </div>
              <Select
                value={selectedExam}
                onChange={setSelectedExam}
                style={{ width: '100%' }}
                options={exams.map(item => ({ label: item.name, value: item.id }))}
                placeholder="Select Exam"
              />
            </Col>
          </Row>
        </Card>



        <div className="mt-8 ">
          {renderTabContent()}
        </div>

        {
          (!selectedGradeType && !selectedExam) && <Card><Empty description="Select a batch to start grading" /></Card>
        }
      </MainLayout>
    </ProtectedRoute>
  )
}

export default ResultCreatePage
