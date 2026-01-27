"use client"

import { Collapse, Tabs, Card, Button, Tooltip } from "antd"
import { useRouter } from "next/navigation"
import { BiBookOpen, BiDetail } from "react-icons/bi"
import { FaClipboardList } from "react-icons/fa"
import { toast } from "react-toastify"

import { LOCALE_KEYS } from "@/constants/localizationKeys"
import { Status } from "@/enums"

import { useExamResults } from "@/hooks/useExamResults"
import { useLocalization } from "@/hooks/useLocalization"

import { getErrorMessage } from "@/types/errors"

import type { CollapseProps, TabsProps } from "antd"

/* ================= TYPES ================= */

interface Subject {
  id: number
  name: string
  code: string
  creditHours: number
  theoryHours: number
  practicalHours: number
  description: string
  prerequisite: string | null
}

interface Faculty {
  id: number
  fullName: string
  email: string
  employeeCode: string
}

interface Semester {
  id: number
  name: string
  startDate: string
  endDate: string
}

interface Batch {
  id: number
  name: string
  academicYear: number
  session: string
}

interface SubjectAssignmentDetail {
  id: number
  facultyId: number
  subjectId: number
  semesterId: number
  batchId: number | null
  hoursPerWeek: number
  role: string
  faculty: Faculty
  subject: Subject
  semester: Semester
  batch: Batch | null
}

interface GroupedData {
  semesterId: number
  batchId: number | null
  subjects: SubjectAssignmentDetail[]
}

interface SubjectCollapseProps {
  data: GroupedData[]
}

/* ================= COMPONENT ================= */

export function SubjectCollapse({ data }: SubjectCollapseProps) {
  const router = useRouter()
  const { t } = useLocalization()
  const entityName = t(LOCALE_KEYS.RESULT, { defaultValue: "Result" })
  const { publishSubjectResults, actionStatus, publishSemesterResults } = useExamResults()


  /* ---------- Navigation Handlers ---------- */

  const handleAddMaterials = (
    subjectId: number,
    semesterId: number,
    batchId: number | null
  ) => {
    router.push(
      `/dashboard/course/${subjectId}/timeline?semesterId=${semesterId}&batchId=${batchId}`
    )
  }

  const handleAddAssignments = (
    subjectId: number,
    semesterId: number,
    batchId: number | null
  ) => {
    router.push(
      `/dashboard/course/${subjectId}?semesterId=${semesterId}&batchId=${batchId}&tab=assignments`
    )
  }

  const handleAddExam = (
    subjectId: number,
    semesterId: number,
    batchId: number | null
  ) => {
    router.push(
      `/exams/create?subjectId=${subjectId}&semesterId=${semesterId}&batchId=${batchId}`
    )
  }

  const handleSubjectDetails = (
    subjectId: number,
    semesterId: number,
    batchId: number | null
  ) => {
    router.push(
      `/dashboard/course/${subjectId}?semesterId=${semesterId}&batchId=${batchId}`
    )
  }

  const handlePublishSubjectResult = async (
    subjectId: number,
    semesterId: number
  ) => {
    try {
      await publishSubjectResults({ subjectId, semesterId })
      toast.success(t(LOCALE_KEYS.PUBLISH_NAME, { name: entityName }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    }
  }

    const handlePublishSemesterResult = async (
    semesterId: number
  ) => {
    try {
      await publishSemesterResults({ semesterId })
      toast.success(t(LOCALE_KEYS.PUBLISH_NAME, { name: entityName }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    }
  }

  /* ================= DATA GROUPING ================= */

  const groupedByBatch = data.reduce<any[]>((acc, group) => {
    const first = group.subjects[0]
    if (!first) return acc

    const batchId = first.batch?.id ?? null
    const batchName = first.batch?.name ?? "No Batch Assigned"
    const semesterId = first.semester.id
    const semesterName = first.semester.name

    let batch = acc.find(b => b.batchId === batchId)
    if (!batch) {
      batch = { batchId, batchName, semesters: [] }
      acc.push(batch)
    }

    let semester = batch.semesters.find(
      (s: any) => s.semesterId === semesterId
    )
    if (!semester) {
      semester = { semesterId, semesterName, subjects: [] }
      batch.semesters.push(semester)
    }

    semester.subjects.push(...group.subjects)
    return acc
  }, [])


const isSemesterEnded = (endDate: string) => {
  const today = new Date()
  const semesterEnd = new Date(endDate)
  return today > semesterEnd
}


  const collapseItems: CollapseProps["items"] = groupedByBatch.map(
    (batch, batchIndex) => ({
      key: `batch-${batchIndex}`,
      label: batch.batchName,
      children: (
        <Tabs
          
          items={batch.semesters.map(
            (semester: any): TabsProps["items"][number] => ({
              key: String(semester.semesterId),
              
              label: semester.semesterName,
              children: (
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {semester.subjects.map(
                    (item: SubjectAssignmentDetail) => (
                      <Card
                        key={item.id}
                        className="h-full hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-sm">
                              {item.subject.name}
                            </h3>
                            <Button
                              size="small"
                              type="primary"
                              icon={<BiDetail />}
                              onClick={() =>
                                handleSubjectDetails(
                                  item.subject.id,
                                  item.semesterId,
                                  item.batchId
                                )
                              }
                            >
                              Details
                            </Button>
                          </div>

                          <p className="text-xs text-gray-500">
                            {item.subject.code}
                          </p>

                          <div className="text-xs space-y-1">
                            <div>Credit: {item.subject.creditHours}</div>
                            <div>Theory: {item.subject.theoryHours}h</div>
                            <div>
                              Practical: {item.subject.practicalHours}h
                            </div>
                            <div>Weekly: {item.hoursPerWeek}h</div>
                          </div>

                          <div
                            className="text-xs"
                            dangerouslySetInnerHTML={{
                              __html: item.subject.description,
                            }}
                          />

                          <p className="text-xs text-gray-600">
                            Role: {item.role}
                          </p>

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="small"
                              icon={<BiBookOpen />}
                              onClick={() =>
                                handleAddMaterials(
                                  item.subject.id,
                                  item.semesterId,
                                  item.batchId
                                )
                              }
                            >
                              Materials
                            </Button>

                            <Button
                              size="small"
                              icon={<FaClipboardList />}
                              onClick={() =>
                                handleAddAssignments(
                                  item.subject.id,
                                  item.semesterId,
                                  item.batchId
                                )
                              }
                            >
                              Assignments
                            </Button>

                            <Button
                              size="small"
                              icon={<BiDetail />}
                              onClick={() =>
                                handleAddExam(
                                  item.subject.id,
                                  item.semesterId,
                                  item.batchId
                                )
                              }
                            >
                              Exam
                            </Button>

                            <Button
                              size="small"
                              icon={<BiDetail />}
                              loading={actionStatus.status === Status.LOADING}
                              onClick={() =>
                                handlePublishSubjectResult(
                                  item.subject.id,
                                  item.semesterId
                                )
                              }
                            >
                              Publish Result 
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  )}

                  
                </div>
                <div className="flex justify-end">
                  <Tooltip title={isSemesterEnded(semester.endDate) ? "" : "Semester not ended yet"}>
<Button
      
                              type="primary"
                              size="small"
                              icon={<BiDetail />}
                              loading={actionStatus.status === Status.LOADING}
                              onClick={() =>
                                handlePublishSemesterResult(
                                 semester.id
                                )
                              }
                              disabled={!isSemesterEnded(semester.endDate)}
                              style={{marginTop: "16px"}}
                            >
                              Publish Semester Result {semester.id}
                            </Button>
                  </Tooltip>
                </div>
                </>
              ),
            })
          )}
        />
      ),
    })
  )

  return <Collapse items={collapseItems} accordion />
}
