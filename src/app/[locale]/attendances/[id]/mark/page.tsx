'use client';

import {
  Button,
  Card,
  Col,
  Input,
  Radio,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { AttendanceStatus, CaptureMethod, Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useAttendances } from '@/hooks/useAttendances';
import { useLocalization } from '@/hooks/useLocalization';
import { attendanceService } from '@/services/attendanceService';

const { Text } = Typography;

type StudentWithAttendance = {
  student: { id: number; firstName?: string; middleName?: string; lastName?: string; applicationNo?: string; registrationNo?: string; batchId?: number; [key: string]: unknown };
  attendanceRecord: { attendancePattern: string; captureMethodPattern: string } | null;
};

const MarkAttendancePage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const attendanceId = parseInt(resolvedParams.id);

  const router = useRouter();
  const { selectedAttendance, detailsStatus, loadAttendance } = useAttendances();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });

  const [searchText, setSearchText] = useState('');
  const [studentAttendanceData, setStudentAttendanceData] = useState<
    Map<number, { status: AttendanceStatus; captureMethod: CaptureMethod }>
  >(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentsWithAttendance, setStudentsWithAttendance] = useState<StudentWithAttendance[] | null>(null);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    loadAttendance(attendanceId);
  }, [loadAttendance, attendanceId]);

  useEffect(() => {
    setStudentAttendanceData(new Map());
  }, [attendanceId]);

  // Load: GET /attendance/student (page 1, limit 99)
  useEffect(() => {
    if (!selectedAttendance?.batchId || !selectedAttendance?.courseId) return;

    setStudentsWithAttendance(null);
    setStudentsLoading(true);

    const recordParams: {
      page: number;
      limit: number;
      courseId: number;
      batchId: number;
      facultyId: number;
      sectionId?: number;
      subjectId?: number;
      semesterId?: number;
    } = {
      page: 1,
      limit: 99,
      courseId: selectedAttendance.courseId,
      batchId: selectedAttendance.batchId,
      facultyId: selectedAttendance.facultyId,
    };
    if (selectedAttendance.sectionId != null) recordParams.sectionId = selectedAttendance.sectionId;
    if (selectedAttendance.subjectId != null) recordParams.subjectId = selectedAttendance.subjectId;
    if (selectedAttendance.semesterId != null) recordParams.semesterId = selectedAttendance.semesterId;

    attendanceService
      .getStudentAttendanceRecords(recordParams)
      .then((records) => {
        const merged: StudentWithAttendance[] = records.map((r) => ({
          student: r.student,
          attendanceRecord: { attendancePattern: r.attendancePattern, captureMethodPattern: r.captureMethodPattern },
        }));
        setStudentsWithAttendance(merged);
      })
      .catch((err) => {
        const msg = err instanceof AxiosError ? err?.response?.data?.message : null;
        toast.error(msg || 'Failed to load students');
        setStudentsWithAttendance([]);
      })
      .finally(() => setStudentsLoading(false));
  }, [
    selectedAttendance?.id,
    selectedAttendance?.batchId,
    selectedAttendance?.courseId,
    selectedAttendance?.sectionId,
    selectedAttendance?.subjectId,
    selectedAttendance?.facultyId,
    selectedAttendance?.semesterId,
  ]);

  const allStudentsWithAttendance: StudentWithAttendance[] = studentsWithAttendance ?? [];

  const relevantStudents = allStudentsWithAttendance.map((x) => x.student);

  // Pre-fill current session from attendanceRecord (attendancePattern index = classNo - 1)
  useEffect(() => {
    if (!selectedAttendance || !studentsWithAttendance?.length) return;
    const classNo = selectedAttendance.classNo;
    const patternIndex = classNo - 1; // Class 1 → index 0, Class 2 → index 1, ...
    const initial = new Map<number, { status: AttendanceStatus; captureMethod: CaptureMethod }>();
    const statusChars = ['p', 'a', 'l', 'x'] as const;
    const methodChars = ['q', 'r', 'b', 'm', 'a'] as const;

    for (const item of studentsWithAttendance) {
      const rec = item.attendanceRecord;
      if (!rec || rec.attendancePattern.length <= patternIndex) continue;
      const s = rec.attendancePattern[patternIndex];
      const m = rec.captureMethodPattern?.[patternIndex] ?? 'm';
      initial.set(item.student.id, {
        status: (statusChars.includes(s as (typeof statusChars)[number]) ? s : 'p') as AttendanceStatus,
        captureMethod: (methodChars.includes(m as (typeof methodChars)[number]) ? m : 'm') as CaptureMethod,
      });
    }
    setStudentAttendanceData(initial);
  }, [selectedAttendance?.id, selectedAttendance?.classNo, studentsWithAttendance]);

  const filteredTableRows = allStudentsWithAttendance.filter(
    (row) =>
      !searchText.trim() ||
      [row.student.firstName, row.student.middleName, row.student.lastName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (row.student.applicationNo ?? '').toLowerCase().includes(searchText.toLowerCase()) ||
      (row.student.registrationNo ?? '').toLowerCase().includes(searchText.toLowerCase()),
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

  // Full label for tooltips; maps attendancePattern chars: p→Present, a→Absent, l→Late, x→Leave
  const getStatusFullLabel = (char: string) => {
    switch (char) {
      case 'p':
        return 'Present';
      case 'a':
        return 'Absent';
      case 'l':
        return 'Late';
      case 'x':
        return 'Leave';
      default:
        return '—';
    }
  };

  // Full label for captureMethodPattern: m→Manual, b→Biometric, q→QR, r→RFID, a→Mobile App
  const getMethodFullLabel = (char: string) => {
    switch (char) {
      case 'm':
        return 'Manual';
      case 'b':
        return 'Biometric';
      case 'q':
        return 'QR';
      case 'r':
        return 'RFID';
      case 'a':
        return 'Mobile App';
      default:
        return 'Manual';
    }
  };

  const markAllPresent = () => {
    const newMap = new Map(studentAttendanceData);
    filteredTableRows.forEach((row) => {
      newMap.set(row.student.id, { status: AttendanceStatus.PRESENT, captureMethod: CaptureMethod.MANUAL });
    });
    setStudentAttendanceData(newMap);
  };

  const markAllAbsent = () => {
    const newMap = new Map(studentAttendanceData);
    filteredTableRows.forEach((row) => {
      newMap.set(row.student.id, { status: AttendanceStatus.ABSENT, captureMethod: CaptureMethod.MANUAL });
    });
    setStudentAttendanceData(newMap);
  };

  // Submit attendance for all students in the batch
  const handleSubmitAttendance = async () => {
    if (!selectedAttendance) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        attendanceId: selectedAttendance.id,
        classNo: selectedAttendance.classNo,
        students: relevantStudents.map((student) => {
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

      await attendanceService.markAttendance(submissionData);
      toast.success(
        `Attendance marked successfully for ${relevantStudents.length} student${relevantStudents.length === 1 ? '' : 's'}!`,
      );
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message
          : null;
      toast.error(message || 'Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4 sections: 1) Student, 2) All attendances from pattern, 3) Set attendance for selected class, 4) Set method for selected class
  const generateAttendanceColumns = (currentClassNo: number) => {
    return [
      // 1) Student name / other info
      {
        title: 'Student',
        key: 'name',
        fixed: 'left' as const,
        width: 180,
        render: (_: any, row: StudentWithAttendance) => (
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {[row.student.firstName, row.student.middleName, row.student.lastName].filter(Boolean).join(' ')}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{row.student.applicationNo ?? ''}</div>
            {row.student.registrationNo != null && (
              <div style={{ fontSize: '11px', color: '#999' }}>{row.student.registrationNo}</div>
            )}
          </div>
        ),
      },
      // 2) All attendances – show everything from attendancePattern (p→P, a→A, l→L, x→E)
      {
        title: 'All Attendances',
        key: 'all_attendances',
        width: 220,
        render: (_: any, row: StudentWithAttendance) => {
          const rec = row.attendanceRecord;
          const pattern = rec?.attendancePattern ?? '';
          const methodPattern = rec?.captureMethodPattern ?? '';
          if (!pattern)
            return <span style={{ color: '#999' }}>—</span>;
          return (
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {pattern.split('').map((char, i) => {
                const status = ['p', 'a', 'l', 'x'].includes(char) ? char : '-';
                const label = getStatusLabel(status);
                const fullLabel = getStatusFullLabel(char);
                const methodLabel = getMethodFullLabel(methodPattern[i] ?? 'm');
                return (
                  <Tooltip key={i} title={`${fullLabel} · ${methodLabel}`}>
                    <Tag color={getStatusColor(status)} style={{ margin: 0 }}>
                      {label}
                    </Tag>
                  </Tooltip>
                );
              })}
            </span>
          );
        },
      },
      // 3) Set attendance for the selected class
      {
        title: `Set Attendance (Class ${currentClassNo})`,
        key: 'set_attendance',
        width: 200,
        render: (_: any, row: StudentWithAttendance) => (
          <Radio.Group
            value={getStudentStatus(row.student.id)}
            onChange={(e) => updateStudentStatus(row.student.id, e.target.value as AttendanceStatus)}
            size="small"
          >
            <Radio.Button value={AttendanceStatus.PRESENT}>Present</Radio.Button>
            <Radio.Button value={AttendanceStatus.ABSENT}>Absent</Radio.Button>
            <Radio.Button value={AttendanceStatus.LATE}>Late</Radio.Button>
            <Radio.Button value={AttendanceStatus.LEAVE}>Leave</Radio.Button>
          </Radio.Group>
        ),
      },
      // 4) Set method for the selected class
      {
        title: `Set Method (Class ${currentClassNo})`,
        key: 'set_method',
        width: 200,
        render: (_: any, row: StudentWithAttendance) => (
          <Radio.Group
            value={getStudentMethod(row.student.id)}
            onChange={(e) => updateStudentMethod(row.student.id, e.target.value as CaptureMethod)}
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
      },
    ];
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
        {/* Flex column that fits viewport; table area gets remaining height and scrolls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 64px)',
            overflow: 'hidden',
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <PageHeader title={`Mark ${entityName}`} onBack={() => router.back()} />
          </div>

          {/* Attendance Info Card */}
          <Card
            title={`Mark Attendance for: ${selectedAttendance.course?.name} - ${selectedAttendance.subject?.name} - ${selectedAttendance.semester?.name} - ${selectedAttendance.batch?.name}`}
            style={{ margin: 12, flexShrink: 0 }}
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
                <Text>{relevantStudents.length}</Text>
              </Col>
            </Row>
          </Card>

          {/* Students Attendance Card: flex 1 so it takes remaining space; body is flex column, table wrapper scrolls */}
          <Card
            title="Students Attendance"
            style={{ margin: 12, flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 24 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <Row gutter={16} align="middle" style={{ flexShrink: 0 }}>
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
                    {filteredTableRows.length} / {relevantStudents.length} students
                  </Text>
                </Col>
              </Row>

              <Row justify="space-between" align="middle" style={{ flexShrink: 0, marginTop: 12, marginBottom: 12 }}>
                <Col>
                  <Space size="middle">
                    <Tooltip title="Set all students to Present for this class">
                      <Button
                        icon={<CheckCircleOutlined />}
                        size="middle"
                        onClick={markAllPresent}
                      >
                        Mark All Present
                      </Button>
                    </Tooltip>
                    <Tooltip title="Set all students to Absent for this class">
                      <Button
                        icon={<CloseCircleOutlined />}
                        size="middle"
                        onClick={markAllAbsent}
                      >
                        Mark All Absent
                      </Button>
                    </Tooltip>
                  </Space>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    size="middle"
                    onClick={handleSubmitAttendance}
                    loading={isSubmitting}
                    disabled={relevantStudents.length === 0}
                  >
                    Submit Attendance
                  </Button>
                </Col>
              </Row>

              {/* Scrollable Table Section – same pattern as EntityList: fixed height + scroll.y for pinned header */}

              <Table
                dataSource={filteredTableRows}
                columns={generateAttendanceColumns(selectedAttendance.classNo)}
                scroll={{

                  y: 'calc(100vh - 540px)',
                }}
                pagination={false}
                size="small"
                rowKey={(row) => row.student.id}
                loading={studentsLoading}
                locale={{
                  emptyText: searchText
                    ? 'No students found matching your search'
                    : studentsLoading
                      ? 'Loading students…'
                      : 'No students found',
                }}
              />

            </div>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MarkAttendancePage;
