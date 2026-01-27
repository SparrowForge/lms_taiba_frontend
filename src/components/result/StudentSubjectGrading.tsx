"use client"

import { Badge, Card, Empty } from "antd"
import { useEffect } from "react"
import { BiBookOpen } from "react-icons/bi"

import { useAuth } from "@/hooks/useAuth"

import { ISubjectExamResult } from "@/types/subjectResult"
import { useExamResults } from "@/hooks/useExamResults"




const gradeColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
}

export default function StudentSubjectGrading() {
  const { loadSubjectResults, subjectResults } = useExamResults()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.student?.id) {
      loadSubjectResults({ studentId: user?.student?.id })
    }
  }, [loadSubjectResults, user?.student?.id])

  if (!subjectResults || subjectResults.length === 0) {
    return (
      <Empty />
    )
  }

  const firstResult = subjectResults[0]

  const groupedBySemester = subjectResults.reduce(
    (acc: Record<string, ISubjectExamResult[]>, result) => {
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
    const totalGradePoints = subjectResults.reduce((sum, r) => sum + r.gradePoint, 0)
    return (totalGradePoints / subjectResults.length).toFixed(2)
  }

  const getOverallPercentage = () => {
    const totalPercentage = subjectResults.reduce((sum, r) => sum + r.percentage, 0)
    return (totalPercentage / subjectResults.length).toFixed(1)
  }

  return (
    <>
      {
        subjectResults.length < 0 ? <Empty /> :(
          <div className="">


     
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
            {subjectResults.length}
          </p>
        </Card>
      </div> *


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
        ) }
    </>
  )
}
