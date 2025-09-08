'use client';

import {
  Button,
  Card,
  Col,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { AttendanceStatus, CaptureMethod, Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useAttendances } from '@/hooks/useAttendances';
import { useBatches } from '@/hooks/useBatches';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

const { Text } = Typography;
const { Option } = Select;

const MarkAttendancePage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const attendanceId = parseInt(resolvedParams.id);

  const router = useRouter();
  const { selectedAttendance, detailsStatus, loadAttendance } = useAttendances();
  const { students, loadStudents } = useStudents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });

  // State for student attendance marking
  const [searchText, setSearchText] = useState('');
  const [studentAttendanceData, setStudentAttendanceData] = useState<
    Map<
      number,
      {
        status: AttendanceStatus;
        captureMethod: CaptureMethod;
      }
    >
  >(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAttendance(attendanceId);
  }, [loadAttendance, attendanceId]);

  useEffect(() => {
    if (selectedAttendance) {
      loadStudents({ page: 1, limit: 100, batchId: selectedAttendance.batchId });
    }
  }, [selectedAttendance]);

  // Filter students based on attendance batch and search text
  const relevantStudents = students.filter(
    (student) => student.batchId === selectedAttendance?.batchId,
  );

  const filteredStudents = relevantStudents.filter(
    (student) =>
      !searchText.trim() ||
      student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.applicationNo.toLowerCase().includes(searchText.toLowerCase()) ||
      student.registrationNo?.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Helper functions
  const getStudentStatus = (studentId: number) => {
    return studentAttendanceData.get(studentId)?.status || AttendanceStatus.PRESENT;
  };

  const getStudentMethod = (studentId: number) => {
    return studentAttendanceData.get(studentId)?.captureMethod || CaptureMethod.MANUAL;
  };

  const updateStudentStatus = (studentId: number, status: AttendanceStatus) => {
    setStudentAttendanceData((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(studentId) || {
        status: AttendanceStatus.PRESENT,
        captureMethod: CaptureMethod.MANUAL,
      };
      newMap.set(studentId, { ...current, status });
      return newMap;
    });
  };

  const updateStudentMethod = (studentId: number, captureMethod: CaptureMethod) => {
    setStudentAttendanceData((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(studentId) || {
        status: AttendanceStatus.PRESENT,
        captureMethod: CaptureMethod.MANUAL,
      };
      newMap.set(studentId, { ...current, captureMethod });
      return newMap;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'green';
      case AttendanceStatus.ABSENT:
        return 'red';
      case AttendanceStatus.LATE:
        return 'orange';
      case AttendanceStatus.LEAVE:
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'P';
      case AttendanceStatus.ABSENT:
        return 'A';
      case AttendanceStatus.LATE:
        return 'L';
      case AttendanceStatus.LEAVE:
        return 'E';
      default:
        return '-';
    }
  };

  // Bulk actions
  const markAllPresent = () => {
    const newMap = new Map();
    filteredStudents.forEach((student) => {
      newMap.set(student.id, {
        status: AttendanceStatus.PRESENT,
        captureMethod: CaptureMethod.MANUAL,
      });
    });
    setStudentAttendanceData(newMap);
  };

  const markAllAbsent = () => {
    const newMap = new Map();
    filteredStudents.forEach((student) => {
      newMap.set(student.id, {
        status: AttendanceStatus.ABSENT,
        captureMethod: CaptureMethod.MANUAL,
      });
    });
    setStudentAttendanceData(newMap);
  };

  // Submit attendance
  const handleSubmitAttendance = async () => {
    if (!selectedAttendance) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        attendanceId: selectedAttendance.id,
        classNo: selectedAttendance.classNo,
        students: filteredStudents.map((student) => {
          const data = studentAttendanceData.get(student.id) || {
            status: AttendanceStatus.PRESENT,
            captureMethod: CaptureMethod.MANUAL,
          };
          return {
            studentId: student.id,
            status: data.status,
            captureMethod: data.captureMethod,
          };
        }),
      };

      // TODO: Replace with actual API call
      console.log('Submitting attendance:', submissionData);

      toast.success('Attendance marked successfully!');
      //router.back();
    } catch (error) {
      toast.error('Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate dynamic columns for attendance history
  const generateAttendanceColumns = (currentClassNo: number) => {
    const columns: any[] = [
      {
        title: 'Student Name',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left' as const,
        width: 150,
        render: (text: string, record: any) => (
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.applicationNo}</div>
          </div>
        ),
      },
    ];

    // Add previous class columns (scrollable)
    for (let classNo = 1; classNo < currentClassNo; classNo++) {
      columns.push({
        title: `Class ${classNo}`,
        key: `class_${classNo}`,
        width: 80,
        render: (_: any, record: any) => {
          // Mock previous attendance data
          const mockStatuses = [
            AttendanceStatus.PRESENT,
            AttendanceStatus.ABSENT,
            AttendanceStatus.LATE,
            AttendanceStatus.LEAVE,
          ];
          const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
          return <Tag color={getStatusColor(randomStatus)}>{getStatusLabel(randomStatus)}</Tag>;
        },
      });
    }

    // Add current class column (fixed right)
    columns.push({
      title: `Class ${currentClassNo} (Today)`,
      key: `class_${currentClassNo}`,
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Radio.Group
          value={getStudentStatus(record.id)}
          onChange={(e) => updateStudentStatus(record.id, e.target.value)}
          size="small"
        >
          <Radio.Button value={AttendanceStatus.PRESENT}>Present</Radio.Button>
          <Radio.Button value={AttendanceStatus.ABSENT}>Absent</Radio.Button>
          <Radio.Button value={AttendanceStatus.LATE}>Late</Radio.Button>
          <Radio.Button value={AttendanceStatus.LEAVE}>Leave</Radio.Button>
        </Radio.Group>
      ),
    });

    // Add method column (fixed right)
    columns.push({
      title: 'Method',
      key: 'method',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Radio.Group
          value={getStudentMethod(record.id)}
          onChange={(e) => updateStudentMethod(record.id, e.target.value)}
          size="small"
        >
          <Tooltip title="Manual">
            <Radio.Button value={CaptureMethod.MANUAL}>M</Radio.Button>
          </Tooltip>
          <Tooltip title="Biometric">
            <Radio.Button value={CaptureMethod.BIOMETRIC}>B</Radio.Button>
          </Tooltip>
          <Tooltip title="QR Code">
            <Radio.Button value={CaptureMethod.QR}>Q</Radio.Button>
          </Tooltip>
          <Tooltip title="RFID">
            <Radio.Button value={CaptureMethod.RFID}>F</Radio.Button>
          </Tooltip>
          <Tooltip title="Mobile App">
            <Radio.Button value={CaptureMethod.MOBILE_APP}>A</Radio.Button>
          </Tooltip>
        </Radio.Group>
      ),
    });

    return columns;
  };

  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div>Loading attendance...</div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedAttendance) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div>Attendance not found</div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={`Mark ${entityName}`} onBack={() => router.back()} />

        {/* Attendance Info Card */}
        <Card
          title={`Mark Attendance for: ${selectedAttendance.course?.name} - ${selectedAttendance.subject?.name} - ${selectedAttendance.semester?.name} - ${selectedAttendance.batch?.name}`}
          style={{ margin: 12 }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Text strong>Date: </Text>
              <Text>{selectedAttendance.date}</Text>
            </Col>
            <Col span={6}>
              <Text strong>Class No: </Text>
              <Text>{selectedAttendance.classNo}</Text>
            </Col>
            <Col span={6}>
              <Text strong>Faculty: </Text>
              <Text>{selectedAttendance.faculty?.fullName}</Text>
            </Col>
            <Col span={6}>
              <Text strong>Total Students: </Text>
              <Text>{filteredStudents.length}</Text>
            </Col>
          </Row>
        </Card>

        {/* Students Attendance Card */}
        <Card title="Students Attendance" style={{ margin: 12 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* Search and Bulk Actions */}
            <Row gutter={16} align="middle">
              <Col flex="auto">
                <Input.Search
                  placeholder="Search students by name, application no, or registration no..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: '100%' }}
                  allowClear
                  enterButton
                />
              </Col>
              <Col>
                <Text type="secondary">
                  {filteredStudents.length} / {relevantStudents.length} students
                </Text>
              </Col>
            </Row>

            {/* Bulk Actions */}
            <Row gutter={8}>
              <Col>
                <Button size="small" onClick={markAllPresent}>
                  Mark All Present
                </Button>
              </Col>
              <Col>
                <Button size="small" onClick={markAllAbsent}>
                  Mark All Absent
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleSubmitAttendance}
                  loading={isSubmitting}
                  disabled={filteredStudents.length === 0}
                >
                  Submit Attendance
                </Button>
              </Col>
            </Row>

            {/* Attendance Table */}
            <Table
              dataSource={filteredStudents}
              columns={generateAttendanceColumns(selectedAttendance.classNo)}
              scroll={{
                x: Math.max(800, (selectedAttendance.classNo - 1) * 80 + 400), // Dynamic width based on class count
                y: 500, // Fixed height for vertical scroll
              }}
              pagination={false}
              size="small"
              rowKey="id"
              locale={{
                emptyText: searchText
                  ? 'No students found matching your search'
                  : 'No students found',
              }}
            />
          </Space>
        </Card>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MarkAttendancePage;
