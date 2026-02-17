'use client';

import { SaveOutlined,  } from '@ant-design/icons';
import {
  Form,
  Table,
  Button,
  InputNumber,
  Space,
  Card,
  Row,
  Col,
  Alert,
  Tag,
} from 'antd';
import { useState } from 'react';
import { AiFillCarryOut } from 'react-icons/ai';


interface StudentRecord {
  id: string;
  studentName: string;
  studentId: string;
  attendance: number;
  classMarks: number;
  midExam1: number;
  midExam2: number;
  finalExam: number;
}

const SemesterFinalResultManagement = () => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: '1',
      studentName: 'Sara Al-Otaibi',
      studentId: 'STU-2023-004',
      attendance: 8.5,
      classMarks: 0,
      midExam1: 0,
      midExam2: 0,
      finalExam: 0,
    },
    {
      id: '2',
      studentName: 'Khalid Omar',
      studentId: 'STU-2023-005',
      attendance: 7.0,
      classMarks: 0,
      midExam1: 0,
      midExam2: 0,
      finalExam: 0,
    },
    {
      id: '3',
      studentName: 'Hana Al-Shammari',
      studentId: 'STU-2023-010',
      attendance: 8.1,
      classMarks: 0,
      midExam1: 0,
      midExam2: 0,
      finalExam: 0,
    },
  ]);

  const calculateTotal = (record: StudentRecord) => {
    const total =
      (record.attendance * 10) / 100 +
      record.classMarks +
      record.midExam1 +
      record.midExam2 +
      record.finalExam;
    return total.toFixed(1);
  };

  const calculateGrade = (total: number) => {
    if (total >= 90) return 'A';
    if (total >= 80) return 'B';
    if (total >= 70) return 'C';
    if (total >= 60) return 'D';
    return 'F';
  };

  const handleFieldChange = (studentId: string, field: string, value: number) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, [field]: value || 0 }
          : student
      )
    );
  };

  const handleAutoFill = () => {
    const filledStudents = students.map((student) => ({
      ...student,
      classMarks: Math.random() * 10,
      midExam1: Math.random() * 10,
      midExam2: Math.random() * 10,
      finalExam: Math.random() * 60,
    }));
    setStudents(filledStudents);
  };

  const handleSubmit = () => {
    const formattedData = students.map((student) => {
      const total = parseFloat(calculateTotal(student));
      const grade = calculateGrade(total);

      return {
        studentName: student.studentName,
        studentId: student.studentId,
        attendance: student.attendance,
        classMarks: student.classMarks,
        midExam1: student.midExam1,
        midExam2: student.midExam2,
        finalExam: student.finalExam,
        total: total,
        grade: grade,
        status: 'Pending',
      };
    });

    console.log('All Students Marks Data:', formattedData);
    alert('Marks submitted successfully! Check console for data.');
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      width: 200,
      render: (text: string, record: StudentRecord) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.studentId}</div>
        </div>
      ),
    },
    {
      title: 'Attend. % (0-10)',
      dataIndex: 'attendance',
      key: 'attendance',
      width: 120,
      render: (text: number) => text.toFixed(1),
    },
    {
      title: 'Class (10)',
      dataIndex: 'classMarks',
      key: 'classMarks',
      width: 100,
      render: (_: any, record: StudentRecord) => (
        <InputNumber
          min={0}
          max={10}
          step={0.5}
          value={record.classMarks}
          onChange={(value) =>
            handleFieldChange(record.id, 'classMarks', value || 0)
          }
          style={{ width: '70px' }}
        />
      ),
    },
    {
      title: 'M.Exam 1 (0-10)',
      dataIndex: 'midExam1',
      key: 'midExam1',
      width: 120,
      render: (_: any, record: StudentRecord) => (
        <InputNumber
          min={0}
          max={10}
          step={0.5}
          value={record.midExam1}
          onChange={(value) =>
            handleFieldChange(record.id, 'midExam1', value || 0)
          }
          style={{ width: '70px' }}
        />
      ),
    },
    {
      title: 'M.Exam 2 (0-10)',
      dataIndex: 'midExam2',
      key: 'midExam2',
      width: 120,
      render: (_: any, record: StudentRecord) => (
        <InputNumber
          min={0}
          max={10}
          step={0.5}
          value={record.midExam2}
          onChange={(value) =>
            handleFieldChange(record.id, 'midExam2', value || 0)
          }
          style={{ width: '70px' }}
        />
      ),
    },
    {
      title: 'Final (0-60)',
      dataIndex: 'finalExam',
      key: 'finalExam',
      width: 120,
      render: (_: any, record: StudentRecord) => (
        <InputNumber
          min={0}
          max={60}
          step={0.5}
          value={record.finalExam}
          onChange={(value) =>
            handleFieldChange(record.id, 'finalExam', value || 0)
          }
          style={{ width: '70px' }}
        />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 80,
      render: (_: any, record: StudentRecord) => (
        <span style={{ fontWeight: 'bold' }}>
          {calculateTotal(record)}
        </span>
      ),
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      width: 80,
      render: (_: any, record: StudentRecord) => {
        const total = parseFloat(calculateTotal(record));
        const grade = calculateGrade(total);
        const color =
          grade === 'A'
            ? 'green'
            : grade === 'B'
              ? 'blue'
              : grade === 'C'
                ? 'orange'
                : grade === 'D'
                  ? 'gold'
                  : 'red';
        return <Tag color={color}>{grade}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: () => <Tag color="processing">Pending</Tag>,
    },
  ];

  // Calculate statistics
  const totalStudents = students.length;
  const classAverage = (
    students.reduce((sum, s) => sum + parseFloat(calculateTotal(s)), 0) /
    totalStudents
  ).toFixed(1);
  const passRate = (
    (students.filter(
      (s) => calculateGrade(parseFloat(calculateTotal(s))) !== 'F'
    ).length /
      totalStudents) *
    100
  ).toFixed(1);
  const failingCount = students.filter(
    (s) => calculateGrade(parseFloat(calculateTotal(s))) === 'F'
  ).length;

  return (
    <div style={{  paddingBottom:64 }}>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 8px 0' }}>
              Semester Final - EE101 Circuit Analysis
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              Semester 1 • Attendance auto-filled from Central Attendance (
              {totalStudents} students)
            </p>
          </div>
          <Space>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>Pass Rate</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {passRate}%
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>Avg. Grade</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {classAverage}/100
              </div>
            </div>
            <Space>
              <Button
                icon={<AiFillCarryOut />}
                onClick={handleAutoFill}
              >
                Auto-Fill
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
              >
                Save All
              </Button>
            </Space>
          </Space>
        </div>

        {/* <Alert
          message="Some students are missing component records: Class Assessment (3) Monthly Exam 1 (3) Monthly Exam 2 (3)"
          type="info"
          style={{ marginBottom: '24px' }}
          icon={<span>⚠️</span>}
        /> */}

        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          pagination={false}
          style={{ marginBottom: '24px', height:"30vh", overflowY:"auto", }}
        />

        <Row style={{marginBottom:64}} gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Students
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  {totalStudents}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Class Average
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  {classAverage}%
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Pass Rate
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                  {passRate}%
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  Failing
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f5222d' }}>
                  {failingCount}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SemesterFinalResultManagement;
