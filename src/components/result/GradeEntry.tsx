import { Card, Col, Empty, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'

import { useBatches } from '@/hooks/useBatches'
import { useExams } from '@/hooks/useExams'
import { useExamTypes } from '@/hooks/useExamTypes'
import { useSemesters } from '@/hooks/useSemesters'
import { useSemesterSubjects } from '@/hooks/useSemesterSubjects'

import StudentResultAssign from './StudentsResultAssign'
import GradingPage from '../examResults/GradingPage'
import SemesterFinalResultManagement from '../examResults/SemesterFinalResultManagement'

const GradeEntry = () => {
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
            loadSemesters({ page: 1, limit: 99, batchId: selectedBatch })
        }
    }, [selectedBatch, loadSemesters])

    useEffect(() => {
        if (selectedSemester) {
            loadSemesterSubjects({ page: 1, limit: 99, semesterId: selectedSemester })
        }
    }, [selectedSemester, loadSemesterSubjects])

    const renderTabContent = () => {
        if (selectedGradeType === undefined || selectedExam === undefined) return null
        switch (selectedGradeType) {
            case 1:
                return <StudentResultAssign examId={selectedExam} />
            case 2:
                return <SemesterFinalResultManagement batch={selectedBatch} subject={selectedSemesterSubject} />
            case 3:
                return <GradingPage />
            default:
                return <Empty description="Select a batch to start grading" />
        }
    }
    return (
        <div>

            <Card>
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

            {/* {
                (!selectedBatch) && <Card><Empty description="Select a batch to start grading" /></Card>
            } */}
            {/* {
                (!selectedSemester && selectedBatch) && <Card><Empty description="Select a semester to start grading" /></Card>
            }
            {
                (!selectedSemesterSubject && selectedBatch && selectedSemester) && <Card><Empty description="Select a subject to start grading" /></Card>
            }
            {
                (!selectedGradeType && selectedBatch && selectedSemester && selectedSemesterSubject) && <Card><Empty description="Select a grade type to start grading" /></Card>
            }
            {
                (!selectedExam && selectedBatch && selectedSemester && selectedSemesterSubject && selectedGradeType) && <Card><Empty description="Select an exam to start grading" /></Card>
            } */}
            {/* <SemesterFinalResultManagement batch={selectedBatch} subject={selectedSemesterSubject} /> */}
            <StudentResultAssign examId={selectedExam} />
        </div>
    )
}

export default GradeEntry
