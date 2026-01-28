"use client"

import {TrophyOutlined} from "@ant-design/icons"
import {
  Card,
  Tag,
  Space,
  Badge,
  Progress,
  Typography,
  Empty,
} from "antd"
import { useEffect, useMemo } from "react"

import { useAuth } from "@/hooks/useAuth"
import { useExamResults } from "@/hooks/useExamResults"



const { Text } = Typography





export default function StudentResultsDisplay() {
  const { loadSemesterResults, semesterResults } = useExamResults()
  const { user } = useAuth()
  useEffect(() => {
    if (user?.student?.id) {
      loadSemesterResults({ studentId: user?.student?.id })
    }
  }, [loadSemesterResults, user?.student?.id])
  /* ---------------- NORMALIZE DATA ---------------- */

  const gradeRecord = useMemo(() => {
    const record = Array.isArray(semesterResults) ? semesterResults[0] : semesterResults
    return record || null
  }, [semesterResults])

  const groupedResults = useMemo(() => {
    if (!Array.isArray(semesterResults) || semesterResults.length === 0) {
      return {}
    }

    return semesterResults.reduce((acc, grade) => {
      const { semester, course } = grade
      const semesterName = semester.name
      const subjectName = course.name

      if (!acc[semesterName]) {
        acc[semesterName] = {}
      }

      if (!acc[semesterName][subjectName]) {
        acc[semesterName][subjectName] = []
      }

      acc[semesterName][subjectName].push({
        examName: grade.course.code,
        marks: grade.totalPercentage,
        totalMarks: 100,
        grade: grade.grade,
        remarks: grade.remarks,
        status: grade.status,
      })

      return acc
    }, {})
  }, [semesterResults])

  if (!gradeRecord) {
    return <Empty description="No grading semesterResults available" />
  }

  const studentName = `${gradeRecord.student.firstName} ${gradeRecord.student.lastName}`
  const gradeColor = gradeRecord.grade === "A" ? "gold" : gradeRecord.grade === "B" ? "blue" : gradeRecord.grade === "C" ? "orange" : "red"

  /* ---------------- RENDER ---------------- */

  return (
    <div style={{ minHeight: "100vh", padding: 24 }}>
      {/* ---------- STUDENT INFO HEADER ---------- */}
      <Card
        style={{ marginBottom: 24 }}
        bordered
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong style={{ fontSize: 18 }}>
              {studentName}
            </Text>
            <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
              <div>
                <strong>Registration No:</strong> {gradeRecord.student.registrationNo}
              </div>
              <div>
                <strong>Application No:</strong> {gradeRecord.student.applicationNo}
              </div>
              <div>
                <strong>Card No:</strong> {gradeRecord.student.cardNo}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Course
              </Text>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                {gradeRecord.course.name}
              </div>
              <div style={{ fontSize: 12, color: "#999" }}>
                {gradeRecord.course.code}
              </div>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Semester
              </Text>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                {gradeRecord.semester.name}
              </div>
              <div style={{ fontSize: 12, color: "#999" }}>
                Term {gradeRecord.semester.termNo}
              </div>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Batch
              </Text>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                {gradeRecord.batch.name}
              </div>
              <div style={{ fontSize: 12, color: "#999" }}>
                {gradeRecord.batch.session}
              </div>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Section
              </Text>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                {gradeRecord.section.name}
              </div>
              <div style={{ fontSize: 12, color: "#999" }}>
                {gradeRecord.section.code}
              </div>
            </div>
          </div>
        </Space>
      </Card>

      {/* ---------- RESULTS CARD ---------- */}
      <Card
        title={
          <Space>
            <TrophyOutlined /> Overall Results
          </Space>
        }
        bordered
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
              Overall Percentage
            </Text>
            <Progress
              type="circle"
              percent={gradeRecord.totalPercentage}
              width={80}
            />
            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600 }}>
              {gradeRecord.totalPercentage}%
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
              GPA
            </Text>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              {gradeRecord.gpa.toFixed(2)}
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>Out of 4.0</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
              Grade
            </Text>
            <Tag color={gradeColor} style={{ padding: "6px 12px", fontSize: 16 }}>
              {gradeRecord.grade}
            </Tag>
          </div>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
              Status
            </Text>
            <Badge
              status={gradeRecord.status === "published" ? "success" : "processing"}
              text={
                <Text strong>
                  {gradeRecord.status === "published" ? "Published" : "Pending"}
                </Text>
              }
            />
            <div style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
              Published: {new Date(gradeRecord.publishedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {gradeRecord.remarks && (
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Remarks
            </Text>
            <Text type="secondary">{gradeRecord.remarks}</Text>
          </div>
        )}
      </Card>
    </div>
  )
}
