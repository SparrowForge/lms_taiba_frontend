"use client"

import { Button, Card, Timeline } from "antd"

import { useAttendances } from "@/hooks/useAttendances"
import { useEffect, useState } from "react"
import CourseMaterialFormDrawer from "@/components/courseMaterials/CourseMaterialFormDrawer"

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
  useEffect(()=>{
    loadAttendances({page:1, limit:99, semesterId:1, subjectId:1})
  },[loadAttendances, drawerVisible])
  const timelineData = attendances as TimelineItem[]

  
  const handleEditDrawer = (courseMaterialId: number) => {
    setSelectedCourseMaterialId(courseMaterialId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedCourseMaterialId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
  };

  const items = timelineData.map((item) => ({
    label: <div className="font-bold text-slate-900">Class {item.classNo}</div>,
    children: (
      <div className="space-y-3">
        <div className="text-sm text-slate-600">
          <span className="font-semibold">Date:</span> {new Date(item.date).toLocaleDateString()}
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
                  </div>
                ))}
              <Button
                onClick={()=>setDrawerVisible(true)}
                type="primary"
                size="small"
                className="h-9 text-base font-medium mb-0"
              >
                Add Course Material
              </Button>
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
    />
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="max-h-[800px] overflow-y-auto overflow-x-hidden pr-2">
          <Timeline items={items} mode="left" />
      </div>
    </div>
   </>
  )
}
