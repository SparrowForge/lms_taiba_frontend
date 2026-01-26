"use client"

import { UserOutlined } from "@ant-design/icons"
import { Badge, Card } from "antd"
import { BiAward, BiBookOpen } from "react-icons/bi"



interface ExamResult {
  id: number
  studentId: number
  semesterId: number
  subjectId: number
  courseId: number
  batchId: number
  sectionId: number
  totalMarks: number
  percentage: number
  grade: string
  gradePoint: number
  status: string
  remarks: string | null
  publishedAt: string
  student: {
    id: number
    firstName: string
    lastName: string
    applicationNo: string
    cardNo: string
  }
  semester: {
    id: number
    name: string
    termNo: number
    startDate: string
    endDate: string
  }
  subject: {
    id: number
    name: string
    code: string
    creditHours: number
  }
  course: {
    id: number
    name: string
    code: string
  }
  batch: {
    id: number
    name: string
    code: string
    academicYear: number
  }
  section: {
    id: number
    name: string
    code: string
  }
}



const results = [
  {
    id: 1,
    studentId: 19,
    semesterId: 19,
    subjectId: 28,
    courseId: 11,
    batchId: 10,
    sectionId: 4,
    totalMarks: 88,
    percentage: 88,
    grade: "A",
    gradePoint: 3.7,
    status: "published",
    remarks: null,
    publishedAt: "2026-01-26T09:05:56.921Z",
    createdAt: "2026-01-26T09:05:56.923Z",
    updatedAt: "2026-01-26T09:05:56.923Z",
    deletedAt: null,
    student: {
      id: 19,
      userId: 18,
      applicationNo: "APP-AI-AN-001",
      firstName: "Ahnaf",
      middleName: null,
      lastName: "Nabil",
      cardNo: "CARD-AI-AN-001",
      registrationNo: "REG-AI-AN-001",
      admissionDate: "2026-01-19",
      courseId: 11,
      batchId: 10,
      sectionId: 4,
      branchId: 6,
      feeStructureId: 12,
      referenceNo: "N/A",
      fileIds: [],
      admissionSource: "online_registration",
      status: "active",
      createdAt: "2026-01-20T15:37:23.093Z",
      updatedAt: "2026-01-20T15:46:37.172Z",
      deletedAt: null,
    },
    semester: {
      id: 19,
      batchId: 10,
      name: "Level 1 2026",
      code: null,
      termNo: 1,
      startDate: "2025-12-31",
      endDate: "2026-03-31",
      status: "active",
      isBreak: false,
      remarks: "",
      createdAt: "2026-01-20T15:22:04.128Z",
      updatedAt: "2026-01-20T15:22:04.128Z",
      deletedAt: null,
    },
    subject: {
      id: 28,
      courseId: 11,
      name: "Python Basics",
      code: "PB-001",
      creditHours: 3,
      theoryHours: 2,
      practicalHours: 1,
      description: "<p><span style=\"white-space: pre-wrap;\">Description</span></p>",
      prerequisite: null,
      status: "active",
      remarks: null,
      createdAt: "2026-01-20T15:20:38.531Z",
      updatedAt: "2026-01-20T15:20:38.531Z",
      deletedAt: null,
    },
    course: {
      id: 11,
      departmentId: 9,
      name: "Artificial Intelligence",
      code: "AI-001",
      courseTypeId: 6,
      scheduleTypeId: 3,
      durationInSemesters: 4,
      description: "Description",
      status: "active",
      remarks: null,
      createdAt: "2026-01-20T15:18:31.933Z",
      updatedAt: "2026-01-20T15:18:31.933Z",
      deletedAt: null,
    },
    batch: {
      id: 10,
      courseId: 11,
      name: "Spring-2026-AI",
      code: "SP-26-AI",
      academicYear: 2025,
      session: "2025-2026",
      intakeCapacity: 50,
      startDate: "2025-12-31",
      endDate: "2026-12-31",
      status: "active",
      remarks: "Remraks",
      createdAt: "2026-01-20T15:22:04.128Z",
      updatedAt: "2026-01-20T15:22:04.128Z",
      deletedAt: null,
    },
    section: {
      id: 4,
      batchId: 10,
      name: "Neptune",
      code: "NEP-001",
      status: "active",
      remarks: "remarks",
      createdAt: "2026-01-20T15:23:05.886Z",
      updatedAt: "2026-01-20T15:23:05.886Z",
      deletedAt: null,
    },
  },
]

const gradeColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
}

export default function StudentSubjectGrading() {
  if (!results || results.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No exam results available</p>
      </div>
    )
  }

  const firstResult = results[0]
  const student = firstResult.student
  const groupedBySemester = results.reduce(
    (acc: Record<string, ExamResult[]>, result) => {
      const semesterName = result.semester.name
      if (!acc[semesterName]) {
        acc[semesterName] = []
      }
      acc[semesterName].push(result)
      return acc
    },
    {}
  )

  const getGradeColor = (grade: string) => {
    return gradeColors[grade] || "bg-gray-100 text-gray-800"
  }

  const getOverallGPA = () => {
    const totalGradePoints = results.reduce((sum, r) => sum + r.gradePoint, 0)
    return (totalGradePoints / results.length).toFixed(2)
  }

  const getOverallPercentage = () => {
    const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0)
    return (totalPercentage / results.length).toFixed(1)
  }

  return (
    <div className="">
 
       {/* <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UserOutlined className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-sm text-gray-600">{student.applicationNo}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-2">
              <div>
                <p className="text-xs text-gray-600">Course</p>
                <p className="font-semibold text-gray-800">
                  {firstResult.course.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Batch</p>
                <p className="font-semibold text-gray-800">{firstResult.batch.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Section</p>
                <p className="font-semibold text-gray-800">{firstResult.section.name}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <BiAward className="mb-2 h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </Card>  */}

      {/* Overall Performance Card */}
       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Overall GPA</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {getOverallGPA()}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Average Percentage</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {getOverallPercentage()}%
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Exams</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {results.length}
          </p>
        </Card>
      </div> *

      {/* Semester Tabs */}
       <div className="space-y-4">
        {Object.entries(groupedBySemester).map(([semesterName, semesterResults]) => (
          <Card key={semesterName} className="overflow-hidden">
            <div className="border-b bg-gray-50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <BiBookOpen className="h-5 w-5" />
                {semesterName}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {semesterResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {result.subject.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Code: {result.subject.code} • Credits: {result.subject.creditHours}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Marks</p>
                        <p className="text-lg font-bold text-gray-800">
                          {result.totalMarks}/100
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Percentage</p>
                        <p className="text-lg font-bold text-blue-600">
                          {result.percentage}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">GPA</p>
                        <p className="text-lg font-bold text-purple-600">
                          {result.gradePoint.toFixed(1)}
                        </p>
                      </div>
                      <Badge className={`text-lg font-bold ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div> 
    </div>
  )
}
