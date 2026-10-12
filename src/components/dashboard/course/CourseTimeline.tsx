"use client"

import { Button, Card, Empty, Timeline } from "antd"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import CourseMaterialFormDrawer from "@/components/courseMaterials/CourseMaterialFormDrawer"

import { useAttendances } from "@/hooks/useAttendances"


interface CourseMaterial {
  id: number
  title: string
  description?: string
  fileUrl?: string
  type?: string
  uploadedAt?: string
}

interface TimelineItem {
  id: number
  classNo: number
  date: string
  remarks: string
  subject: {
    name: string
    code: string
    courseMaterial: CourseMaterial[]
  }
}

export default function CourseTimeline() {

  const {attendances, loadAttendances} = useAttendances()
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCourseMaterialId, setSelectedCourseMaterialId] = useState<number | undefined>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [classNo, setClassNo] = useState<number | undefined>()
  const params = useParams()
  const searchParams = useSearchParams()
  const subjectId = params.id as string
  const semesterId = searchParams.get('semesterId') as string
  const batchId = searchParams.get('batchId') as string

  useEffect(()=>{
    if(subjectId && semesterId){
        loadAttendances({page:1, limit:99, subjectId: Number(subjectId), semesterId: Number(semesterId), batchId: batchId ? Number(batchId) : undefined})
    }
  },[loadAttendances, drawerVisible, semesterId, subjectId, batchId])

  const timelineData = [...(attendances as unknown as TimelineItem[])].reverse()


  const handleCreateDrawer = (classnumber:number) => {
    setClassNo(classnumber)
    setSelectedCourseMaterialId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
  };

  const handleEditDrawer = (courseMaterialId: number,classnumber:number) => {
    setClassNo(classnumber)
    setSelectedCourseMaterialId(courseMaterialId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };



  const items = timelineData?.map((item) => ({
    label: <div className="font-bold text-slate-900">Class {item.classNo }</div>,
    children: (
      <div className="space-y-3">
        <div className="text-sm text-slate-600 mt-3 flex justify-between flex-wrap gap-2">
          <h1><span className="font-semibold">Date:</span> {new Date(item.date).toLocaleDateString()}</h1>
           <Button
              onClick={()=>handleCreateDrawer(item.classNo)}
              type="primary"
              size="small"
              className="h-9 text-base font-medium mb-0"
              >
                Add Course Material
            </Button>
        </div>

        {item.subject.courseMaterial && item.subject.courseMaterial.length > 0 ? (
          <Card className="bg-white border border-slate-200">
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Course Materials</h3>
              <div className="space-y-2">
                {item.subject.courseMaterial.map((material) => (
                  <div key={material.id} className="p-2 bg-slate-50 rounded border border-slate-100">
                    <p className="text-sm font-medium text-slate-800">{material.title}</p>
                    {material.description && <p className="text-xs text-slate-600 mt-1">{material.description}</p>}
                    <Button
                      onClick={()=>handleEditDrawer(material.id,item.classNo)}
                      type="primary"
                      size="small"
                      className="h-9 text-base font-medium mb-0"
                      >
                        Edit Course Material
                    </Button>
                  </div>
                ))}
                
              </div>
            </div>
          </Card>
        ) : (
          <Card className="bg-slate-50 border border-slate-200">
            <div className="p-4">
              <p className="text-sm text-slate-500 italic">No course materials available for this class</p>
            </div>
          </Card>
        )}
      </div>
    ),
  }))

  return (
   <>
    <CourseMaterialFormDrawer
      mode={drawerMode}
      courseMaterialId={selectedCourseMaterialId}
      visible={drawerVisible}
      onCancel={() => setDrawerVisible(false)}
      onSuccess={handleDrawerSuccess}
      classNo={classNo}
    />
    <div className="bg-white rounded-lg border border-slate-200 p-3 md:p-6">
      <div className="max-h-[800px] overflow-y-auto overflow-x-hidden pr-2">
          <Timeline items={items} mode="left" />
          {
            timelineData.length === 0 && (
              <div className="text-center text-sm text-slate-500 italic mt-4 min-h-100 flex items-center justify-center">
                <Empty/>
              </div>
            )
          }
      </div>
    </div>
   </>
  )
}
