"use client"

import { Collapse, Card, Button } from "antd"
import type { CollapseProps } from "antd"
import { BiBookOpen, BiDetail } from "react-icons/bi"
import { FaClipboardList } from "react-icons/fa"

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

export function SubjectCollapse({ data }: SubjectCollapseProps) {
  const items: CollapseProps["items"] = data.map((group, index) => {
    const batchName = group.subjects[0]?.batch?.name || "No Batch Assigned"
    const semesterName = group.subjects[0]?.semester.name || "Unknown Semester"
    const headerTitle = `${batchName} - ${semesterName}`

    return {
      key: `group-${index}`,
      label: headerTitle,
      children: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {group.subjects.map((assignment) => (
            <Card key={assignment.id} size="small" className="h-full hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{assignment.subject.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{assignment.subject.code}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit Hours:</span>
                    <span className="font-semibold">{assignment.subject.creditHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Theory:</span>
                    <span className="font-semibold">{assignment.subject.theoryHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Practical:</span>
                    <span className="font-semibold">{assignment.subject.practicalHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Hours:</span>
                    <span className="font-semibold">{assignment.hoursPerWeek}h</span>
                  </div>
                </div>

                <div className="border-t pt-2">
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Description:</span>
                  </p>
                  <p className="text-xs text-gray-700 line-clamp-2">{assignment.subject.description}</p>
                  <p className="text-xs text-gray-600">Role: {assignment.role}</p>
                </div>

                {assignment.subject.prerequisite && (
                  <div>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Prerequisite:</span> {assignment.subject.prerequisite}
                    </p>
                  </div>
                )}



                 <div className="border-t pt-3 flex gap-2">
                  <Button
                    type="primary"
                    size="small"
                    className="flex-1"
                    icon={<BiBookOpen size={14} />}
                    // onClick={() => handleAddMaterials(assignment.subject.id, assignment.subject.name)}
                  >
                    Materials
                  </Button>
                  <Button
                    size="small"
                    className="flex-1"
                    icon={<FaClipboardList size={14} />}
                    // onClick={() => handleAddAssignments(assignment.subject.id, assignment.subject.name)}
                  >
                    Assignments
                  </Button>
                  <Button
                    size="small"
                    className="flex-1"
                    icon={<BiDetail size={14} />}
                    // onClick={() => handleAddAssignments(assignment.subject.id, assignment.subject.name)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    }
  })

  return <Collapse items={items} accordion />
}
