'use client';

import {
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Select,
  Input,
} from 'antd';
import React, { useEffect } from 'react';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';

import SemesterBatchCurriculumCard from './SemesterBatchCurriculumCard';

export default function CurriculumManagement({ handleCreateDrawer }) {
  const { courses, loadCourses } = useCourses()
  const { batches, loadBatches, selectedBatch, loadBatch } = useBatches()
  const [batchSelected, setBatchSelected] = React.useState(null)
  const [courseSelected, setCourseSelected] = React.useState(null)

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 })
  }, [loadCourses])

  useEffect(() => {
    if (courseSelected) {
      loadBatches({ page: 1, limit: 100, courseId: courseSelected })
    }
  }, [courseSelected, loadBatches])

  useEffect(() => {
    if (batchSelected) {
      loadBatch(batchSelected)
    }
  }, [batchSelected, loadBatch])



  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        background: '#f5f5f5',
      }}

    >
      <div style={{ padding: '24px', marginBottom: "100px" }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px',
            }}
          >
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
                Curriculum Management
              </h1>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Map subjects to program semesters with prerequisite validation
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {/* <Button icon={<CopyOutlined />}>Duplicate</Button>
              <Button icon={<DownloadOutlined />}>Export</Button> */}
              <Button onClick={() => handleCreateDrawer()} type="primary" icon={<PlusOutlined />}>
                Add Semester Subject
              </Button>
            </div>
          </div>
        </div>


        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginBottom: '24px',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
              Program
            </label>
            <Select
              placeholder="Select Program"
              value={courseSelected}
              onChange={value => setCourseSelected(value)}
              options={courses.map(course => ({ label: course.name, value: course.id }))}
              style={{ width: '100%' }} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
              Batch Context
            </label>
            <Select
              placeholder="Select Batch Context"
              value={batchSelected}
              onChange={value => setBatchSelected(value)}
              options={batches.map(batch => ({ label: batch.name, value: batch.id }))}
              style={{ width: '100%' }} />
          </div>

          {/* <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
              Search
            </label>
            <Input
              placeholder="Search subjects..."
              prefix={<SearchOutlined />}
            />
          </div> */}
        </div>

        <SemesterBatchCurriculumCard selectedBatch={selectedBatch} />

        {/* Prerequisite Chains */}
        {/* <Card style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px' }}>Prerequisite Chains</h2>

          <Card style={{ marginTop: '12px' }}>
            <h4>Civil Core</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['SEM 1', 'SEM 2', 'SEM 3'].map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    style={{
                      padding: '8px 12px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {s}
                  </div>
                  {i < 2 && <ArrowRightOutlined />}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </Card> */}

        {/* Legend */}
        {/* <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Tag color="red">Hard</Tag>
          <Tag>Must pass</Tag>
          <Tag>Soft</Tag>
          <Tag>Recommended</Tag>
          <Tag color="cyan">Co-requisite</Tag>
          <Tag>Same semester</Tag>
        </div> */}

      </div>
    </div>
  );
}
