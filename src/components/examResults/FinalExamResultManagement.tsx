'use client';

import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Card,
  Collapse,
  Row,
  Col,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';

interface Exam {
  id: string;
  name: string;
  percentage: number;
  totalMarks: number;
  obtainedMarks: number | null;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  exams: Exam[];
  attendanceMarks: number;
  attendancePercentage: number;
  finalResult: number;
  grades: string;
}

interface MockSemester {
  id: string;
  name: string;
  subjects: Subject[];
}

interface FormEditingState {
  subjectId: string;
  examId?: string;
  type: 'exam' | 'attendance';
}

const MOCK_DATA: MockSemester[] = [
  {
    id: 'sem1',
    name: 'Semester 1',
    subjects: [
      {
        id: 'sub1',
        code: 'CS101',
        name: 'Data Structures',
        attendanceMarks: 7,
        attendancePercentage: 5,
        exams: [
          {
            id: 'exam1',
            name: 'Midterm Exam',
            percentage: 30,
            totalMarks: 30,
            obtainedMarks: 24,
          },
          {
            id: 'exam2',
            name: 'Final Exam',
            percentage: 40,
            totalMarks: 40,
            obtainedMarks: 32,
          },
          {
            id: 'exam3',
            name: 'Quiz 1',
            percentage: 15,
            totalMarks: 15,
            obtainedMarks: 12,
          },
          {
            id: 'exam4',
            name: 'Assignment',
            percentage: 10,
            totalMarks: 10,
            obtainedMarks: 9,
          },
        ],
        finalResult: 0,
        grades: '',
      },
      {
        id: 'sub2',
        code: 'CS102',
        name: 'Database Management',
        attendanceMarks: 8,
        attendancePercentage: 5,
        exams: [
          {
            id: 'exam5',
            name: 'Midterm Exam',
            percentage: 30,
            totalMarks: 30,
            obtainedMarks: 22,
          },
          {
            id: 'exam6',
            name: 'Final Exam',
            percentage: 40,
            totalMarks: 40,
            obtainedMarks: 35,
          },
          {
            id: 'exam7',
            name: 'Project',
            percentage: 30,
            totalMarks: 30,
            obtainedMarks: 28,
          },
        ],
        finalResult: 0,
        grades: '',
      },
    ],
  },
  {
    id: 'sem2',
    name: 'Semester 2',
    subjects: [
      {
        id: 'sub3',
        code: 'CS201',
        name: 'Algorithms',
        attendanceMarks: 9,
        attendancePercentage: 5,
        exams: [
          {
            id: 'exam8',
            name: 'Midterm Exam',
            percentage: 35,
            totalMarks: 35,
            obtainedMarks: 28,
          },
          {
            id: 'exam9',
            name: 'Final Exam',
            percentage: 40,
            totalMarks: 40,
            obtainedMarks: null,
          },
          {
            id: 'exam10',
            name: 'Lab Work',
            percentage: 25,
            totalMarks: 25,
            obtainedMarks: 20,
          },
        ],
        finalResult: 0,
        grades: '',
      },
    ],
  },
];

const gradeScale = [
  { min: 90, max: 100, grade: 'A+' },
  { min: 80, max: 89.99, grade: 'A' },
  { min: 70, max: 79.99, grade: 'B' },
  { min: 60, max: 69.99, grade: 'C' },
  { min: 50, max: 59.99, grade: 'D' },
  { min: 0, max: 49.99, grade: 'F' },
];

const calculateFinalResult = (subject: Subject): { result: number; grade: string } => {
  let totalWeightedMarks = 0;
  let totalPercentage = 0;
  let allMarksProvided = true;

  // Calculate exam weighted marks
  for (const exam of subject.exams) {
    if (exam.obtainedMarks === null) {
      allMarksProvided = false;
      continue;
    }
    const examPercentage = (exam.obtainedMarks / exam.totalMarks) * 100;
    totalWeightedMarks += (examPercentage * exam.percentage) / 100;
    totalPercentage += exam.percentage;
  }

  // Normalize if not all exams have marks
  if (totalPercentage > 0 && totalPercentage < 100) {
    totalWeightedMarks = (totalWeightedMarks / totalPercentage) * 100;
  }

  // Add attendance marks
  const attendanceMarksContribution =
    (subject.attendanceMarks / 10) * subject.attendancePercentage;
  const finalResult = totalWeightedMarks + attendanceMarksContribution;

  // Get grade
  let grade = 'N/A';
  if (allMarksProvided && totalPercentage === 100) {
    for (const scale of gradeScale) {
      if (finalResult >= scale.min && finalResult <= scale.max) {
        grade = scale.grade;
        break;
      }
    }
  }

  return { result: finalResult, grade };
};

export function FinalExamResultManagement() {
  const [semesters, setSemesters] = useState<MockSemester[]>(MOCK_DATA);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingState, setEditingState] = useState<FormEditingState | null>(null);
  const [form] = Form.useForm();

  // Calculate results for all subjects
  const calculateAllResults = (data: MockSemester[]) => {
    return data.map((semester) => ({
      ...semester,
      subjects: semester.subjects.map((subject) => {
        const { result, grade } = calculateFinalResult(subject);
        return {
          ...subject,
          finalResult: result,
          grades: grade,
        };
      }),
    }));
  };

  const handleEditExam = (subjectId: string, examId: string) => {
    const semester = semesters.find((s) =>
      s.subjects.some((sub) => sub.id === subjectId)
    );
    const subject = semester?.subjects.find((s) => s.id === subjectId);
    const exam = subject?.exams.find((e) => e.id === examId);

    if (exam) {
      form.setFieldsValue({
        obtainedMarks: exam.obtainedMarks,
      });
      setEditingState({ subjectId, examId, type: 'exam' });
      setIsModalVisible(true);
    }
  };

  const handleEditAttendance = (subjectId: string) => {
    const semester = semesters.find((s) =>
      s.subjects.some((sub) => sub.id === subjectId)
    );
    const subject = semester?.subjects.find((s) => s.id === subjectId);

    if (subject) {
      form.setFieldsValue({
        attendanceMarks: subject.attendanceMarks,
      });
      setEditingState({ subjectId, type: 'attendance' });
      setIsModalVisible(true);
    }
  };

  const handleAddExam = (subjectId: string) => {
    form.resetFields();
    setEditingState({ subjectId, type: 'exam' });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const newSemesters = semesters.map((semester) => ({
        ...semester,
        subjects: semester.subjects.map((subject) => {
          if (subject.id === editingState?.subjectId) {
            if (editingState.type === 'exam') {
              if (editingState.examId) {
                // Edit existing exam
                return {
                  ...subject,
                  exams: subject.exams.map((exam) =>
                    exam.id === editingState.examId
                      ? {
                          ...exam,
                          obtainedMarks: values.obtainedMarks,
                        }
                      : exam
                  ),
                };
              } else {
                // Add new exam
                const newExam: Exam = {
                  id: `exam_${Date.now()}`,
                  name: values.examName,
                  percentage: values.examPercentage,
                  totalMarks: values.totalMarks,
                  obtainedMarks: values.obtainedMarks,
                };
                return {
                  ...subject,
                  exams: [...subject.exams, newExam],
                };
              }
            } else {
              // Edit attendance
              return {
                ...subject,
                attendanceMarks: values.attendanceMarks,
              };
            }
          }
          return subject;
        }),
      }));

      const updatedSemesters = calculateAllResults(newSemesters);
      setSemesters(updatedSemesters);
      setIsModalVisible(false);
      setEditingState(null);
      form.resetFields();
      message.success(
        editingState?.examId
          ? 'Marks updated successfully!'
          : editingState?.type === 'exam'
            ? 'Exam added successfully!'
            : 'Attendance updated successfully!'
      );
    } catch (err) {
      message.error('Please fill all required fields');
    }
  };

  const handleDeleteExam = (subjectId: string, examId: string) => {
    Modal.confirm({
      title: 'Delete Exam',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this exam?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        const newSemesters = semesters.map((semester) => ({
          ...semester,
          subjects: semester.subjects.map((subject) => {
            if (subject.id === subjectId) {
              return {
                ...subject,
                exams: subject.exams.filter((exam) => exam.id !== examId),
              };
            }
            return subject;
          }),
        }));

        const updatedSemesters = calculateAllResults(newSemesters);
        setSemesters(updatedSemesters);
        message.success('Exam deleted successfully!');
      },
    });
  };

  const handleSubmitResults = () => {
    console.log(semesters)
    Modal.confirm({
      title: 'Submit Results',
      icon: <CheckCircleOutlined />,
      content:
        'Are you sure you want to submit all results? This action cannot be undone.',
      okText: 'Submit',
      cancelText: 'Cancel',
      onOk() {
        message.success('Results submitted successfully!');
        console.log('Results submitted:', semesters);
      },
    });
  };

  const ExamTable = ({ subject }: { subject: Subject }) => {
    const columns: TableColumnsType<Exam> = [
      {
        title: 'Exam Name',
        dataIndex: 'name',
        key: 'name',
        width: '35%',
      },
      {
        title: 'Total Marks',
        dataIndex: 'totalMarks',
        key: 'totalMarks',
        align: 'center',
        width: '15%',
      },
      {
        title: 'Obtained Marks',
        dataIndex: 'obtainedMarks',
        key: 'obtainedMarks',
        align: 'center',
        width: '15%',
        render: (text) => (
          <span style={{ fontWeight: '500', color: '#1890ff' }}>
            {text ?? '-'}
          </span>
        ),
      },
      {
        title: 'Percentage',
        key: 'percentage',
        align: 'center',
        width: '15%',
        render: (_, record) =>
          record.obtainedMarks !== null
            ? `${((record.obtainedMarks / record.totalMarks) * 100).toFixed(2)}%`
            : '-',
      },
      {
        title: 'Weight',
        dataIndex: 'percentage',
        key: 'weight',
        align: 'center',
        width: '10%',
        render: (text) => `${text}%`,
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        width: '20%',
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit Marks">
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditExam(subject.id, record.id)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteExam(subject.id, record.id)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={subject.exams}
        rowKey="id"
        pagination={false}
        size="small"
      />
    );
  };

  const calculateOverallGrade = () => {
    const calculatedSemesters = calculateAllResults(semesters);
    let totalMarks = 0;
    let subjectCount = 0;

    calculatedSemesters.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        totalMarks += subject.finalResult;
        subjectCount += 1;
      });
    });

    const overallGPA = subjectCount > 0 ? totalMarks / subjectCount : 0;
    let overallGrade = 'N/A';

    for (const scale of gradeScale) {
      if (overallGPA >= scale.min && overallGPA <= scale.max) {
        overallGrade = scale.grade;
        break;
      }
    }

    return {
      overallGPA: overallGPA.toFixed(2),
      overallGrade,
      totalSubjects: subjectCount,
    };
  };

  const overallStats = calculateOverallGrade();
  const calculatedSemesters = calculateAllResults(semesters);
  const totalSemesterGPA = calculatedSemesters.reduce((sum, semester) => {
    const semesterGPA =
      semester.subjects.reduce((s, sub) => s + sub.finalResult, 0) /
      (semester.subjects.length || 1);
    return sum + semesterGPA;
  }, 0);
  const avgSemesterGPA =
    calculatedSemesters.length > 0
      ? (totalSemesterGPA / calculatedSemesters.length).toFixed(2)
      : '0.00';

  return (
    <div className="p-2 md:p-6" style={{ background: '#f5f5f5', height: '100vh', overflowY: 'auto' }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Result Management</h2>}
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Overall GPA"
              value={overallStats.overallGPA}
              precision={2}
              suffix="/ 100"
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Overall Grade"
              value={overallStats.overallGrade}
              valueStyle={{
                color:
                  overallStats.overallGrade === 'A+'
                    ? '#52c41a'
                    : overallStats.overallGrade === 'A'
                      ? '#1890ff'
                      : overallStats.overallGrade === 'B'
                        ? '#faad14'
                        : overallStats.overallGrade === 'C'
                          ? '#ff7a45'
                          : overallStats.overallGrade === 'D'
                            ? '#ff4d4f'
                            : '#595959',
                fontSize: '28px',
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Average Semester GPA"
              value={avgSemesterGPA}
              precision={2}
              suffix="/ 100"
              valueStyle={{ color: '#722ed1', fontSize: '28px' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total Subjects"
              value={overallStats.totalSubjects}
              valueStyle={{ color: '#eb2f96', fontSize: '28px' }}
            />
          </Col>
        </Row>

        <Button
          type="primary"
          size="large"
          icon={<FileExcelOutlined />}
          onClick={handleSubmitResults}
        >
          Submit All Results
        </Button>
      </Card>

      {calculatedSemesters.map((semester) => {
        const semesterTotal = semester.subjects.reduce(
          (sum, sub) => sum + sub.finalResult,
          0
        );
        const semesterAverage =
          semester.subjects.length > 0
            ? (semesterTotal / semester.subjects.length).toFixed(2)
            : '0.00';

        return (
          <Card
            key={semester.id}
            title={<h3 style={{ margin: 0 }}>{semester.name}</h3>}
            style={{ marginBottom: '24px' }}
            extra={
              <Row gutter={[16, 16]}>
               
                <Col>
                  <Statistic
                    title="Semester Average"
                    value={semesterAverage}
                    precision={2}
                    suffix="/ 100"
                    valueStyle={{ fontSize: '14px', color: '#722ed1' }}
                  />
                </Col>
              </Row>
            }
          >
            <Collapse
              items={semester.subjects.map((subject) => ({
                key: subject.id,
                label: (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      paddingRight: '16px',
                      overflowY: 'auto',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: '600', marginRight: '8px' }}>
                        {subject.code}
                      </span>
                      <span>{subject.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <Statistic
                        value={subject.finalResult}
                        precision={2}
                        suffix=" / 100"
                        valueStyle={{ fontSize: '14px' }}
                      />
                      <Tag
                        color={
                          subject.grades === 'A+'
                            ? 'green'
                            : subject.grades === 'A'
                              ? 'cyan'
                              : subject.grades === 'B'
                                ? 'blue'
                                : subject.grades === 'C'
                                  ? 'orange'
                                  : subject.grades === 'D'
                                    ? 'volcano'
                                    : 'red'
                        }
                      >
                        {subject.grades}
                      </Tag>
                    </div>
                  </div>
                ),
                children: (
                  <div>
                    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                      <Col xs={24} sm={8}>
                        <Card size="small">
                          <Statistic
                            title="Attendance Marks"
                            value={subject.attendanceMarks}
                            suffix="/ 10"
                            valueStyle={{ color: '#faad14' }}
                          />
                          <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEditAttendance(subject.id)}
                            style={{ marginTop: '8px' }}
                          >
                            Edit
                          </Button>
                        </Card>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Card size="small">
                          <Statistic
                            title="Exams Added"
                            value={subject.exams.filter((e) => e.obtainedMarks !== null).length}
                            suffix={`/ ${subject.exams.length}`}
                            valueStyle={{ color: '#52c41a' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Card size="small">
                          <Statistic
                            title="Pending Exams"
                            value={subject.exams.filter((e) => e.obtainedMarks === null).length}
                            suffix={`/ ${subject.exams.length}`}
                            valueStyle={{ color: '#ff4d4f' }}
                          />
                        </Card>
                      </Col>
                    </Row>

                    <h4 style={{ marginTop: '16px', marginBottom: '12px' }}>
                      Exam Details
                    </h4>
                    <ExamTable subject={subject} />
                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={() => handleAddExam(subject.id)}
                      style={{ marginTop: '12px' }}
                    >
                      Add New Exam
                    </Button>
                  </div>
                ),
              }))}
            />
          </Card>
        );
      })}

      <Modal
        title={
          editingState?.type === 'attendance'
            ? 'Edit Attendance Marks'
            : editingState?.examId
              ? 'Edit Exam Marks'
              : 'Add New Exam'
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingState(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          {editingState?.type === 'attendance' ? (
            <Form.Item
              label="Attendance Marks (out of 10)"
              name="attendanceMarks"
              rules={[
                { required: true, message: 'Please enter attendance marks' },
                {
                  type: 'number',
                  min: 0,
                  max: 10,
                  message: 'Marks must be between 0 and 10',
                },
              ]}
            >
              <InputNumber min={0} max={10} />
            </Form.Item>
          ) : editingState?.examId ? (
            <Form.Item
              label="Obtained Marks"
              name="obtainedMarks"
              rules={[{ required: true, message: 'Please enter obtained marks' }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="Exam Name"
                name="examName"
                rules={[{ required: true, message: 'Please enter exam name' }]}
              >
                <Input placeholder="e.g., Midterm Exam" />
              </Form.Item>
              <Form.Item
                label="Total Marks"
                name="totalMarks"
                rules={[{ required: true, message: 'Please enter total marks' }]}
              >
                <InputNumber min={1} placeholder="e.g., 100" />
              </Form.Item>
              <Form.Item
                label="Obtained Marks"
                name="obtainedMarks"
                rules={[{ required: true, message: 'Please enter obtained marks' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                label="Exam Weight (%)"
                name="examPercentage"
                rules={[{ required: true, message: 'Please enter exam weight' }]}
              >
                <InputNumber min={1} placeholder="e.g., 30" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
