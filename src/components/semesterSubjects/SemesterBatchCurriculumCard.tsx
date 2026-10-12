'use client'

import { Card, Button, Badge, Row, Col, Table, Empty } from 'antd'
import { useState, useMemo, useEffect } from 'react'

import { IBatch } from '@/types/batch'

interface SemesterBatchCurriculumCardProps {
  selectedBatch: IBatch
}

export default function SemesterBatchCurriculumCard({ selectedBatch }:  SemesterBatchCurriculumCardProps) {


  const semesters = selectedBatch?.semesters || []
  const course = selectedBatch?.course

  const [activeSemesterId, setActiveSemesterId] = useState<number | null>(null)

  useEffect(() => {
    if (semesters.length) {
      setActiveSemesterId(semesters[0].id)
    }
  }, [semesters])

  const activeSemester = useMemo(
    () => semesters.find((s: any) => s.id === activeSemesterId),
    [activeSemesterId, semesters]
  )

  if (!selectedBatch || !course) {
    return <Card><Empty description="No batch selected" /></Card>
  }

  const totalCreditHours = semesters.reduce(
    (sum: number, s: any) => sum + (s.creditHours || 0),
    0
  )

  const subjectColumns = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Subject Name', dataIndex: 'name', key: 'name' },
    { title: 'Credit Hours', dataIndex: 'creditHours', key: 'creditHours' },
    { title: 'Theory', dataIndex: 'theoryHours', key: 'theoryHours' },
    { title: 'Practical', dataIndex: 'practicalHours', key: 'practicalHours' },
  ]

  return (
    <Card style={{ marginBottom: 24 }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="m-0 text-lg">{course.name}</h2>
          <p className="text-xs text-gray-500 mt-1">
            {semesters.length} Semesters • {course.durationInMonths} Months
          </p>
          <p className="text-xs text-gray-400">
            Session: {selectedBatch.session}
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold">{totalCreditHours}</div>
          <div className="text-xs text-gray-500">Total Credit Hours</div>
        </div>
      </div>

      {/* Semester Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {semesters.map((sem: any) => {
          const active = sem.id === activeSemesterId

          return (
            <Button
              key={sem.id}
              type={active ? 'primary' : 'default'}
              onClick={() => setActiveSemesterId(sem.id)}
            >
              Semester {sem.termNo}
              <Badge
                count={`${sem.creditHours} CH`}
                style={{
                  backgroundColor: active ? '#0050b3' : '#999',
                  marginLeft: 6,
                  fontSize: 10,
                }}
              />
            </Button>
          )
        })}
      </div>

      {/* Active Semester Card */}
      {activeSemester && (
        <Card className="mb-6" style={{ background: '#0050b3', color: '#fff' }}>
          <Row>
            <Col xs={24} md={20}>
              <h3 className="m-0">
                Semester {activeSemester.termNo} – {activeSemester.name}
              </h3>
              <p className="m-0 mt-1 text-sm">
                {activeSemester.subjects.length} Subjects
              </p>
            </Col>

            <Col xs={12} sm={8} md={4} className="text-right">
              <div className="text-3xl font-bold">
                {activeSemester.creditHours}
              </div>
              <div className="text-xs">Credit Hours</div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Subjects Table */}
      <Table
        columns={subjectColumns}
        dataSource={activeSemester?.subjects || []}
        rowKey="id"
        pagination={false}
        size="small"
        locale={{
          emptyText: 'No subjects assigned to this semester',
        }}
      />
    </Card>
  )
}
