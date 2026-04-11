'use client';

import { EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { Card, Tabs, Table, Tag, Badge, Statistic, Row, Col, Button, Divider } from 'antd';
import { useMemo } from 'react';




export const academicMockData = {
  summary: {
    cumulativeGPA: 0.0,
    gpaScale: 5.0,
    creditsEarned: 0,
    creditsAttempted: 0,
    subjectsPassed: 0,
    subjectsFailed: 0,
    subjectsInProgress: 6,
  },
  gradeComponents: {
    totalMarks: 100,
    components: [
      { name: "Attendance", marks: 10 },
      { name: "Behavior / Assignments", marks: 10 },
      { name: "Monthly Exam 1", marks: 10 },
      { name: "Monthly Exam 2", marks: 10 },
      { name: "Final Exam", marks: 60 },
    ],
  },
  semester: {
    semesterId: 1,
    name: "Semester 1",
    term: "First Term 2025 (1446)",
    totalCreditHours: 17,
    earnedCredits: 0,
    semesterGPA: 0.0,
    subjects: [
      {
        subjectCode: "MATH101",
        subjectName: "Mathematics I",
        credits: 3,
        marks: {
          attendance: 0,
          behavior: 0,
          monthlyExam1: 0,
          monthlyExam2: 0,
          finalExam: 0,
          total: 0,
        },
        grade: "F",
        status: "Pending",
      },
      {
        subjectCode: "PHYS101",
        subjectName: "Physics I",
        credits: 4,
        marks: {
          attendance: 0,
          behavior: 0,
          monthlyExam1: 0,
          monthlyExam2: 0,
          finalExam: 0,
          total: 0,
        },
        grade: "F",
        status: "Pending",
      },
      {
        subjectCode: "ENG101",
        subjectName: "Engineering Drawing",
        credits: 3,
        marks: {
          attendance: 0,
          behavior: 0,
          monthlyExam1: 0,
          monthlyExam2: 0,
          finalExam: 0,
          total: 0,
        },
        grade: "F",
        status: "Pending",
      },
      {
        subjectCode: "COMP101",
        subjectName: "Computer Fundamentals",
        credits: 3,
        marks: {
          attendance: 0,
          behavior: 0,
          monthlyExam1: 0,
          monthlyExam2: 0,
          finalExam: 0,
          total: 0,
        },
        grade: "F",
        status: "Pending",
      },
      {
        subjectCode: "ENGL101",
        subjectName: "English Language I",
        credits: 2,
        marks: {
          attendance: 0,
          behavior: 0,
          monthlyExam1: 0,
          monthlyExam2: 0,
          finalExam: 0,
          total: 0,
        },
        grade: "F",
        status: "Pending",
      },
      {
        subjectCode: "ARAB101",
        subjectName: "Arabic Language",
        credits: 2,
        marks: {
          attendance: 0,
          behavior: 0,
          monthlyExam1: 0,
          monthlyExam2: 0,
          finalExam: 0,
          total: 0,
        },
        grade: "F",
        status: "Pending",
      },
    ],
  },
};


export function AcademicResultGrade() {
  const { summary, gradeComponents, semester } = academicMockData;

  // Summary cards
  const summaryCards = useMemo(
    () => [
      {
        key: 'gpa',
        title: 'Cumulative GPA',
        value: summary.cumulativeGPA,
        suffix: ` / ${summary.gpaScale}`,
        color: '#ff7a45',
      },
      {
        key: 'credits',
        title: 'Credits Earned',
        value: summary.creditsEarned,
        suffix: ` of ${summary.creditsAttempted} attempted`,
        color: '#000',
      },
      {
        key: 'passed',
        title: 'Subjects Passed',
        value: summary.subjectsPassed,
        color: '#52c41a',
      },
      {
        key: 'failed',
        title: 'Subjects Failed',
        value: summary.subjectsFailed,
        color: '#f5222d',
      },
      {
        key: 'progress',
        title: 'In Progress',
        value: summary.subjectsInProgress,
        color: '#1890ff',
      },
    ],
    [summary]
  );

  // Table columns for subjects
  const tableColumns = [
    {
      title: 'Subject',
      dataIndex: 'subjectCode',
      key: 'subject',
      render: (_: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0050b3' }}>{record.subjectCode}</div>
          <div style={{ fontSize: '13px', color: '#595959' }}>{record.subjectName}</div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'Att',
      dataIndex: ['marks', 'attendance'],
      key: 'attendance',
      width: 70,
      align: 'center' as const,
      render: (value: number) => <span style={{ color: value > 0 ? '#000' : '#ff4d4f' }}>{value}</span>,
    },
    {
      title: 'Bhv',
      dataIndex: ['marks', 'behavior'],
      key: 'behavior',
      width: 70,
      align: 'center' as const,
      render: (value: number) => <span style={{ color: value > 0 ? '#000' : '#ff4d4f' }}>{value}</span>,
    },
    {
      title: 'M1',
      dataIndex: ['marks', 'monthlyExam1'],
      key: 'monthlyExam1',
      width: 70,
      align: 'center' as const,
      render: (value: number) => <span style={{ color: value > 0 ? '#000' : '#ff4d4f' }}>{value}</span>,
    },
    {
      title: 'M2',
      dataIndex: ['marks', 'monthlyExam2'],
      key: 'monthlyExam2',
      width: 70,
      align: 'center' as const,
      render: (value: number) => <span style={{ color: value > 0 ? '#000' : '#ff4d4f' }}>{value}</span>,
    },
    {
      title: 'Final',
      dataIndex: ['marks', 'finalExam'],
      key: 'finalExam',
      width: 80,
      align: 'center' as const,
      render: (value: number) => <span style={{ color: value > 0 ? '#000' : '#ff4d4f' }}>{value}</span>,
    },
    {
      title: 'Total',
      dataIndex: ['marks', 'total'],
      key: 'total',
      width: 80,
      align: 'center' as const,
      render: (value: number) => <span style={{ fontWeight: 600, color: value > 0 ? '#000' : '#ff4d4f' }}>{value}</span>,
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      width: 70,
      align: 'center' as const,
      render: (grade: string) => (
        <Tag color={grade === 'F' ? 'red' : 'green'} style={{ fontSize: '12px', fontWeight: 600 }}>
          {grade}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center' as const,
      render: (status: string) => <span style={{ fontSize: '12px' }}>{status}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: () => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" icon={<DownloadOutlined />} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' , marginBottom:"100px"}}>
      <div >
        {/* Summary Cards */}
        <Card style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}>
          <Row gutter={24}>
            {summaryCards.map((card) => (
              <Col key={card.key} xs={24} sm={12} md={8} lg={4.8}>
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <Statistic
                    value={card.value}
                    suffix={card.suffix}
                    valueStyle={{ color: card.color, fontSize: '24px', fontWeight: 700 }}
                  />
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '8px' }}>{card.title}</div>
                  {card.key === 'credits' && (
                    <div style={{ color: '#8c8c8c', fontSize: '11px', marginTop: '2px' }}>
                      of {summary.creditsAttempted} attempted
                    </div>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Grade Components */}
        <Card style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
              Grade Components ({gradeComponents.totalMarks} Marks Total)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {gradeComponents.components.map((component: { name: string; marks: number }, idx: number) => (
              <Badge
                key={idx}
                count={`${component.marks}`}
                style={{ backgroundColor: '#1890ff', fontSize: '11px' }}
                title={component.name}
              >
                <div style={{ padding: '8px 12px', background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '12px' }}>
                  {component.name} ({component.marks})
                </div>
              </Badge>
            ))}
          </div>
        </Card>

        {/* Semester Section */}
        <Card style={{ border: '1px solid #e8e8e8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{semester.name}</h2>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                {semester.term} • {semester.totalCreditHours} credit hours • Earned: {semester.earnedCredits} credits
              </div>
            </div>
            <div
              style={{
                background: '#f5222d',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              GPA: {semester.semesterGPA.toFixed(2)}
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

        <Tabs
            defaultActiveKey="summary"
            items={[
                {
                    key: 'summary',
                    label: 'Summary',
                    children: (
                        <Table
                            columns={tableColumns}
                            dataSource={semester.subjects.map((subject, idx) => ({
                                key: idx,
                                ...subject,
                            }))}
                            pagination={false}
                            size="small"
                            scroll={{ x: 1200 }}
                            style={{ marginTop: '16px' }}
                        />
                    ),
                },
                {
                    key: 'assessment',
                    label: 'Class Assessment',
                    children: (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#8c8c8c' }}>
                    Class Assessment details coming soon
                  </div>
                ),
              },
              {
                key: 'midterm',
                label: 'Mid-Term Exams',
                children: (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#8c8c8c' }}>
                    Mid-Term Exams details coming soon
                  </div>
                ),
              },
              {
                key: 'finalexam',
                label: 'Final Exam',
                children: (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#8c8c8c' }}>
                    Final Exam details coming soon
                  </div>
                ),
              },
            ]}
            tabBarStyle={{
              background: '#e8e8e8',
              padding: '0 12px',
              margin: '0 -12px',
            }}
          />
        </Card>
      </div>
    </div>
  );
}
