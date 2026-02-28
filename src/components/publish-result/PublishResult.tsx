'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Input, InputNumber, Card, Button, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { useStudents } from '@/hooks/useStudents';
import { useSearchParams } from 'next/navigation';

/* ===== TYPES ===== */
interface ExamConfig {
  id: string;
  name: string;
  percentage: number; // contribution of this exam
  maxMarks: number;
}

interface AssignmentConfig {
  id: number;
  title: string;
  percentage: number; // contribution of this assignment
  totalMarks: number;
}

interface StudentExam {
  examId: string;
  marksObtained: number;
  weightedPercentage: number;
}

interface StudentAssignment {
  assignmentId: number;
  marksObtained: number;
  weightedPercentage: number;
  title: string;
}

interface StudentRecord {
  key: string;
  id: number;
  studentName: string;
  registrationNo: string;
  exams: Record<string, StudentExam>;
  assignments: Record<number, StudentAssignment>;
  attendancePercentage: number;
}

/* ===== COMPONENT ===== */
const PublishResult: React.FC = () => {
  const {
    studentsWithSemesterResultFinalization,
    loadStudentsWithSemesterResultFinalization,
  } = useStudents();

  const [exams, setExams] = useState<ExamConfig[]>([]);
  const [assignments, setAssignments] = useState<AssignmentConfig[]>([]);
  const [studentMarks, setStudentMarks] = useState<
    Record<number, Record<string, number>>
  >({});
  const [studentAssignments, setStudentAssignments] = useState<
    Record<number, Record<number, number>>
  >({}); // studentId -> assignmentId -> marksObtained

  const searchParams = useSearchParams();
  const batchId = Number(searchParams.get('batchId'));
  const subjectId = Number(searchParams.get('subjectId'));
  const semesterId = Number(searchParams.get('semesterId'));

  /* ===== LOAD STUDENTS ===== */
  useEffect(() => {
    if (batchId && semesterId && subjectId) {
      loadStudentsWithSemesterResultFinalization({
        batchId,
        semesterId,
        subjectId,
      });
    }
  }, [batchId, semesterId, subjectId, loadStudentsWithSemesterResultFinalization]);

  /* ===== INIT EXAMS, MARKS, ASSIGNMENTS ===== */
  useEffect(() => {
    if (!studentsWithSemesterResultFinalization?.length) return;

    const examMap = new Map<string, ExamConfig>();
    const assignmentMapConfig = new Map<number, AssignmentConfig>();
    const marksMap: Record<number, Record<string, number>> = {};
    const assignmentMarksMap: Record<number, Record<number, number>> = {};

    studentsWithSemesterResultFinalization.forEach((row) => {
      marksMap[row.student.id] = {};
      assignmentMarksMap[row.student.id] = {};

      // Exams
      row.examResults?.forEach((res) => {
        const examId = String(res.exam.id);
        if (!examMap.has(examId)) {
          examMap.set(examId, {
            id: examId,
            name: res.exam.name,
            percentage: 0,
            maxMarks: res.exam.marks,
          });
        }
        marksMap[row.student.id][examId] = res.marksObtained ?? 0;
      });

      // Assignments
      row.assignmentSubmissions?.forEach((a) => {
        if (!assignmentMapConfig.has(a.assignmentId)) {
          assignmentMapConfig.set(a.assignmentId, {
            id: a.assignmentId,
            title: a.assignment.title,
            percentage: 0, // initial percentage
            totalMarks: a.assignment.totalMarks,
          });
        }
        assignmentMarksMap[row.student.id][a.assignmentId] = a.marksObtained ?? 0;
      });
    });

    setExams(Array.from(examMap.values()));
    setAssignments(Array.from(assignmentMapConfig.values()));
    setStudentMarks(marksMap);
    setStudentAssignments(assignmentMarksMap);
  }, [studentsWithSemesterResultFinalization]);

  /* ===== UPDATE HANDLERS ===== */
  const updateStudentMarks = (
    studentId: number,
    examId: string,
    marks: number
  ) => {
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [examId]: marks,
      },
    }));
  };

  const updateExamPercentage = (examId: string, percentage: number) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, percentage } : e))
    );
  };

  const updateStudentAssignment = (
    studentId: number,
    assignmentId: number,
    marks: number
  ) => {
    setStudentAssignments((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [assignmentId]: marks,
      },
    }));
  };

  const updateAssignmentPercentage = (assignmentId: number, percentage: number) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, percentage } : a))
    );
  };

  /* ===== TABLE DATA ===== */
  const tableData: StudentRecord[] = useMemo(() => {
    return studentsWithSemesterResultFinalization.map((row) => {
      // Exams
      const examsObj: Record<string, StudentExam> = {};
      exams.forEach((exam) => {
        const marks = studentMarks[row.student.id]?.[exam.id] ?? 0;
        const weightedPercentage = (marks * exam.percentage) / 100;
        examsObj[exam.id] = {
          examId: exam.id,
          marksObtained: marks,
          weightedPercentage: Number(weightedPercentage.toFixed(2)),
        };
      });

      // Assignments
      const assignmentsObj: Record<number, StudentAssignment> = {};
      assignments.forEach((a) => {
        const marks = studentAssignments[row.student.id]?.[a.id] ?? 0;
        const weightedPercentage = (marks * a.percentage) / 100;
        assignmentsObj[a.id] = {
          assignmentId: a.id,
          marksObtained: marks,
          weightedPercentage: Number(weightedPercentage.toFixed(2)),
          title: a.title,
        };
      });

      // Attendance
      const patterns = row.attendance ?? [];
      const allChars = patterns
        .map((att) => att.attendancePattern)
        .flatMap((p) => p.split(''));
      const presentCount = allChars.filter((c) => c === 'p').length;
      const attendancePercentage = allChars.length
        ? Number(((presentCount / allChars.length) * 100).toFixed(2))
        : 0;

      return {
        key: String(row.student.id),
        id: row.student.id,
        studentName: `${row.student.firstName} ${row.student.lastName}`,
        registrationNo: row.student.registrationNo,
        exams: examsObj,
        assignments: assignmentsObj,
        attendancePercentage,
      };
    });
  }, [studentsWithSemesterResultFinalization, exams, studentMarks, assignments, studentAssignments]);

  /* ===== COLUMNS ===== */
  const columns: TableColumnsType<StudentRecord> = [
    {
      title: 'Student',
      fixed: 'left',
      width: 220,
      render: (_, r) => (
        <>
          <div className="font-semibold">{r.studentName}</div>
          <div className="text-xs text-gray-500">{r.registrationNo}</div>
        </>
      ),
    },

    // Exams Columns
    ...exams.map((exam) => ({
      title: (
        <div>
          <Input
            value={exam.name}
            bordered={false}
            className="font-semibold"
          />
          <InputNumber
            min={0}
            max={100}
            value={exam.percentage}
            addonAfter="%"
            size="small"
            onChange={(v) => updateExamPercentage(exam.id, v ?? 0)}
            style={{ width: '50%' }}
          />
        </div>
      ),
      width: 170,
      render: (_, r) => {
        const examData = r.exams[exam.id];
        return (
          <div className="flex flex-col gap-1">
            <InputNumber
              min={0}
              max={exam.maxMarks}
              value={examData?.marksObtained}
              onChange={(v) =>
                updateStudentMarks(r.id, exam.id, v ?? 0)
              }
              className="w-full"
            />
            <span className="text-xs text-blue-600 font-medium">
              {examData?.weightedPercentage} marks
            </span>
          </div>
        );
      },
    })),

    // Assignments Columns
    ...assignments.map((a) => ({
      title: (
        <div>
          <Input
            value={a.title}
            bordered={false}
            className="font-semibold"
          />
          <InputNumber
            min={0}
            max={100}
            value={a.percentage}
            addonAfter="%"
            size="small"
            onChange={(v) => updateAssignmentPercentage(a.id, v ?? 0)}
            style={{ width: '50%' }}
          />
        </div>
      ),
      width: 170,
      render: (_, r) => {
        const aData = r.assignments[a.id];
        return (
          <div className="flex flex-col gap-1">
            <InputNumber
              min={0}
              max={a.totalMarks}
              value={aData?.marksObtained}
              onChange={(v) =>
                updateStudentAssignment(r.id, a.id, v ?? 0)
              }
              className="w-full"
            />
            <span className="text-xs text-blue-600 font-medium">
              {aData?.weightedPercentage} marks
            </span>
          </div>
        );
      },
    })),

    // Attendance Column
    {
      title: 'Attendance %',
      width: 120,
      render: (_, r) => (
        <span className="text-blue-600 font-medium">{r.attendancePercentage}%</span>
      ),
    },
  ];

  /* ===== SUBMIT ===== */
  const handleSubmit = () => {
    const requestData = {
      attendance: {
        percentage: tableData.length
          ? Number(
              (
                tableData.reduce((acc, s) => acc + s.attendancePercentage, 0) /
                tableData.length
              ).toFixed(2)
            )
          : 0,
      },
      exams: exams.map((e) => ({ id: e.id, percentage: e.percentage })),
      assignments: tableData.map((s) => ({
        studentId: s.id,
        marks: Object.values(s.assignments).map((a) => ({
          assignmentId: a.assignmentId,
          marksObtained: a.marksObtained,
          weightedPercentage: a.weightedPercentage,
        })),
      })),
      class: {},
    };

    console.log('Submit request:', requestData);
    message.success('Data prepared for submission! Check console.');
  };

  /* ===== RENDER ===== */
  return (
    <Card className="shadow-lg">
      <div className="mb-4 flex justify-end">
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      <Table
        bordered
        columns={columns}
        dataSource={tableData}
        pagination={false}
      />
    </Card>
  );
};

export default PublishResult;