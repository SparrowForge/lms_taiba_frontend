'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Input, InputNumber, Card, Button, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { useStudents } from '@/hooks/useStudents';

/* ===== TYPES ===== */
interface ExamConfig {
  id: string;
  name: string;
  percentage: number; // contribution of this exam
  maxMarks: number;
}

interface StudentExam {
  examId: string;
  marksObtained: number;
  weightedPercentage: number;
}

interface StudentRecord {
  key: string;
  id: number;
  studentName: string;
  registrationNo: string;
  exams: Record<string, StudentExam>;
  attendancePercentage: number;
}

/* ===== COMPONENT ===== */
const PublishResult: React.FC = () => {
  const {
    studentsWithSemesterResultFinalization,
    loadStudentsWithSemesterResultFinalization,
  } = useStudents();

  const [exams, setExams] = useState<ExamConfig[]>([]);
  const [studentMarks, setStudentMarks] = useState<
    Record<number, Record<string, number>>
  >({});

  /* ===== LOAD STUDENTS ===== */
  useEffect(() => {
    loadStudentsWithSemesterResultFinalization({
      batchId: 1,
      semesterId: 1,
      subjectId: 1,
    });
  }, [loadStudentsWithSemesterResultFinalization]);

  /* ===== INIT EXAMS + MARKS ===== */
  useEffect(() => {
    if (!studentsWithSemesterResultFinalization?.length) return;

    const examMap = new Map<string, ExamConfig>();
    const marksMap: Record<number, Record<string, number>> = {};

    studentsWithSemesterResultFinalization.forEach((row) => {
      marksMap[row.student.id] = {};

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
    });

    setExams(Array.from(examMap.values()));
    setStudentMarks(marksMap);
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

  /* ===== TABLE DATA ===== */
  const tableData: StudentRecord[] = useMemo(() => {
    return studentsWithSemesterResultFinalization.map((row) => {
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

      // Attendance calculation
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
        attendancePercentage,
      };
    });
  }, [studentsWithSemesterResultFinalization, exams, studentMarks]);

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
            style={{ width: '30%' }}
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
              {examData?.weightedPercentage} marks on contribution
            </span>
          </div>
        );
      },
    })),

    {
      title: 'Attendance %',
      width: 120,
      render: (_, r) => (
        <span className="text-blue-600 font-medium">
          {r.attendancePercentage}%
        </span>
      ),
    },
  ];

  /* ===== SUBMIT HANDLER ===== */
  const handleSubmit = () => {
    const requestData = {
      attendance: {
        percentage: tableData.length
          ? Number(
              (
                tableData.reduce(
                  (acc, s) => acc + s.attendancePercentage,
                  0
                ) / tableData.length
              ).toFixed(2)
            )
          : 0,
      },
      exams: exams.map((e) => ({
        id: e.id,
        percentage: e.percentage,
      })),
      class: {}, 
      assignment: [], 
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
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};

export default PublishResult;