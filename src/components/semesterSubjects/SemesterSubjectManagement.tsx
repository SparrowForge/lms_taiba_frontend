'use client';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import {
  CopyOutlined,
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import {
  Button,
  Select,
  Input,
  Alert,
  Card,
  Badge,
  Table,
  Row,
  Col,
  Tag,
} from 'antd';
import React, { useEffect } from 'react';

export default function CurriculumManagement({ handleCreateDrawer }) {
  const { courses, loadCourses } = useCourses()
  const { batches, loadBatches } = useBatches()
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

        {/* Filters */}
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

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
              Search
            </label>
            <Input
              placeholder="Search subjects..."
              prefix={<SearchOutlined />}
            />
          </div>
        </div>

        {/* Info Alert */}
        <Alert
          message="This curriculum is synced with the Programs module. Changes made here will automatically update the program template."
          type="info"
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: '24px' }}
          showIcon
        />

        {/* Curriculum Card */}
        <Card style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>
                Diploma in Civil Engineering
              </h2>
              <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>
                5 Semesters • 30 Months Duration
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>64</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Total Credit Hours
              </div>
            </div>
          </div>

          {/* Semester Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            {[1, 2, 3, 4, 5].map((sem) => (
              <Button
                key={sem}
                type={sem === 1 ? 'primary' : 'default'}
                style={{
                  borderRadius: '4px',
                  background: sem === 1 ? '#1890ff' : '#ccc',
                  color: sem === 1 ? 'white' : '#333',
                  border: 'none',
                }}
              >
                Semester {sem}
                <Badge
                  count="12 CH"
                  style={{
                    backgroundColor: sem === 1 ? '#0050b3' : '#999',
                    marginLeft: '4px',
                    fontSize: '10px',
                  }}
                />
              </Button>
            ))}
          </div>

          {/* Current Semester */}
          <Card
            style={{
              background: '#b3b3b3',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            <Row gutter={16}>
              <Col span={20}>
                <h3 style={{ margin: 0 }}>Semester 1 - Level 5</h3>
                <p style={{ margin: '4px 0 0 0' }}>
                  6 Subjects • 6 Mandatory
                </p>
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>12</div>
                <div style={{ fontSize: '12px' }}>Credit Hours</div>
              </Col>
            </Row>
          </Card>

          {/* Subjects Table */}
          <Table
            columns={[]}
            dataSource={[]}
            pagination={false}
            size="small"
          />
        </Card>

        {/* Prerequisite Chains */}
        <Card style={{ marginBottom: '24px' }}>
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
        </Card>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Tag color="red">Hard</Tag>
          <Tag>Must pass</Tag>
          <Tag>Soft</Tag>
          <Tag>Recommended</Tag>
          <Tag color="cyan">Co-requisite</Tag>
          <Tag>Same semester</Tag>
        </div>

      </div>
    </div>
  );
}
