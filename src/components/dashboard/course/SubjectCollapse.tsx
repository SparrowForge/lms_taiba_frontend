"use client"

import { Collapse, Card, Button } from "antd"
import type { CollapseProps } from "antd"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const handleAddMaterials =(subjectId:number, semesterId:number, batchId:number) =>{
      router.push(`/dashboard/course/${subjectId}/timeline?semesterId=${semesterId}&batchId=${batchId}`)
  }
  const handleAddAssignments =(subjectId:number, semesterId:number, batchId:number) =>{
      router.push(`/dashboard/course/${subjectId}?semesterId=${semesterId}&tab=assignments&batchId=${batchId}`)
  }

  const items: CollapseProps["items"] = data.map((group, index) => {
  const batchName = group.subjects[0]?.batch?.name || "No Batch Assigned"
  const semesterName = group.subjects[0]?.semester.name || "Unknown Semester"
  const headerTitle = `${batchName} - ${semesterName}`
    
 
    return {
      key: `group-${index}`,
      label: headerTitle,
      children: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {group.subjects.map((item) => (
            <Card key={item.id} size="small" className="h-full hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{item.subject.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.subject.code}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit Hours:</span>
                    <span className="font-semibold">{item.subject.creditHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Theory:</span>
                    <span className="font-semibold">{item.subject.theoryHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Practical:</span>
                    <span className="font-semibold">{item.subject.practicalHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Hours:</span>
                    <span className="font-semibold">{item.hoursPerWeek}h</span>
                  </div>
                </div>

                <div className="border-t pt-2">
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Description:</span>
                  </p>
                  <p className="text-xs text-gray-700 line-clamp-2">{item.subject.description}</p>
                  <p className="text-xs text-gray-600">Role: {item.role}</p>
                </div>

                {item.subject.prerequisite && (
                  <div>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Prerequisite:</span> {item.subject.prerequisite}
                    </p>
                  </div>
                )}



                 <div className="border-t pt-3 flex gap-2">
                  <Button
                    type="primary"
                    size="small"
                    className="flex-1"
                    icon={<BiBookOpen size={14} />}
                    onClick={() => handleAddMaterials(item.subject.id, item.semesterId, item?.batch?.id)}
                  >
                    Materials
                  </Button>
                  <Button
                    size="small"
                    className="flex-1"
                    icon={<FaClipboardList size={14} />}
                    onClick={() => handleAddAssignments(item.subject.id, item.semesterId, item.batchId)}
                  >
                    Assignments
                  </Button>
                  <Button
                    size="small"
                    className="flex-1"
                    icon={<BiDetail size={14} />}
                    // onClick={() => handleAddAssignments(item.subject.id, item.subject.name)}
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
