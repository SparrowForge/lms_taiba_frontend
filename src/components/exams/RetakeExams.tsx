'use client';

import {
    FileTextOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ArrowUpOutlined,
    PlusOutlined,
    CheckOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import {
    Tabs,
    Select,
    Button,
    Card,
    Space,
    Empty,
    Segmented,
    Row,
    Col
} from 'antd';
import { useEffect, useState } from 'react';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useSemesters } from '@/hooks/useSemesters';
import { useSemesterSubjects } from '@/hooks/useSemesterSubjects';


import FailedStudents from './FailedStudents';
import RetakeSchedules from './RetakeSchedules';


export default function RetakeExams() {

    const [selectedSubject, setSelectedSubject] = useState();
    const [selectedSemester, setSelectedSemester] = useState();
    const [selectedBatch, setSelectedBatch] = useState();
    const [selectedCourse, setSelectedCourse] = useState();
    const { courses, loadCourses } = useCourses()
    const { batches, loadBatches } = useBatches()
    const { semesters, loadSemesters } = useSemesters()
    const { semesterSubjects, loadSemesterSubjects } = useSemesterSubjects()

    useEffect(() => {
        loadCourses({ page: 1, limit: 99 })
    }, [loadCourses])
    useEffect(() => {
        if (selectedCourse) {
            loadBatches({ page: 1, limit: 99, courseId: selectedCourse })
        }
    }, [loadBatches, loadCourses, selectedCourse])
    useEffect(() => {
        if (selectedBatch) {
            loadSemesters({ page: 1, limit: 99, batchId: selectedBatch })
        }
    }, [loadCourses, loadSemesters, selectedBatch])
    useEffect(() => {
        if (selectedSemester) {
            loadSemesterSubjects({ page: 1, limit: 99 })
        }
    }, [selectedSemester, loadSemesterSubjects])





    return (
        <div style={{ padding: "0 10px", height: '70vh', overflowY: "auto" }}>

            <Row style={{ marginBottom: 10 }} gutter={16}>
                <Col xs={24} sm={12} md={6}>
                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>Course</label>
                    </div>
                    <Select
                        value={selectedCourse}
                        onChange={setSelectedCourse}
                        style={{ width: '100%' }}
                        options={courses.map(batch => ({ label: batch.name, value: batch.id }))}
                        placeholder="Select Batch"
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
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
                <Col xs={24} sm={12} md={6}>
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
                <Col xs={24} sm={12} md={6}>
                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>Subject</label>
                    </div>
                    <Select
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        style={{ width: '100%' }}
                        options={semesterSubjects.map(semesterSubject => ({ label: semesterSubject.subject.name, value: semesterSubject.subjectId }))}
                        placeholder="Select Subject"
                    />
                </Col>

            </Row>

            <Card style={{ borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
                        <CalendarOutlined style={{ marginRight: '8px' }} />
                        Retake Exam Management
                    </h2>
                    <p style={{ margin: '0', color: '#666', fontSize: '13px' }}>
                        Schedule retake exams and enroll failed students. Original grades are preserved for audit compliance.
                    </p>
                </div>


                <div style={{ marginBottom: '24px' }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 500, fontSize: '14px' }}>Select Subject</p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Select
                            value={selectedSubject}
                            onChange={setSelectedSubject}
                            options={semesterSubjects.map(item => ({ label: item.subject.name, value:item.subjectId}))}
                        style={{ flex: 1 }}
                        placeholder="Select Subject"
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                        >
                            Schedule Retake
                        </Button>
                    </div>
                </div>

                <Tabs
                    defaultActiveKey="failed-students"
                    items={[
                        {
                            key: 'failed-students',
                            label: (
                                <span>
                                    <span style={{ marginRight: '8px' }}>⚠️</span>
                                    Failed Students (0)
                                </span>
                            ),
                            children: <FailedStudents />
                        },
                        {
                            key: 'retake-schedules',
                            label: (
                                <span>
                                    <CalendarOutlined style={{ marginRight: '8px' }} />
                                    Retake Schedules (0)
                                </span>
                            ),
                            children: <RetakeSchedules />
                        },
                    ]}
                />
            </Card>


        </div>
    );
}
