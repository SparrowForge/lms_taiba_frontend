'use client';

import React, { useState, useMemo } from 'react';
import {
  Layout,
  Select,
  Table,
  Button,
  Input,
  Tag,
  Card,
  Row,
  Col,
  Badge,
  Space,
  Alert,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  CopyOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';

interface Subject {
  key: string;
  code: string;
  name: string;
  credits: number;
  theory: number;
  practical: number;
  prerequisite: string;
  type: 'Mandatory' | 'Elective';
}

interface Semester {
  id: number;
  name: string;
  credits: number;
  subjects: number;
}

interface PrerequisiteChain {
  id: string;
  track: string;
  subjects: Array<{
    semester: string;
    code: string;
  }>;
}

const mockSemesters: Semester[] = [
  { id: 1, name: 'Semester 1', credits: 17, subjects: 5 },
  { id: 2, name: 'Semester 2', credits: 14, subjects: 4 },
  { id: 3, name: 'Semester 3', credits: 13, subjects: 4 },
  { id: 4, name: 'Semester 4', credits: 11, subjects: 3 },
  { id: 5, name: 'Semester 5', credits: 9, subjects: 3 },
];

const mockSubjects: Subject[] = [
  {
    key: '1',
    code: 'CE302',
    name: 'Construction Management',
    credits: 3,
    theory: 3,
    practical: 0,
    prerequisite: 'None',
    type: 'Mandatory',
  },
  {
    key: '2',
    code: 'CE402',
    name: 'Graduation Project II',
    credits: 4,
    theory: 0,
    practical: 8,
    prerequisite: 'CE401',
    type: 'Mandatory',
  },
  {
    key: '3',
    code: 'CE403',
    name: 'Professional Practice',
    credits: 2,
    theory: 2,
    practical: 0,
    prerequisite: 'None',
    type: 'Mandatory',
  },
];

const mockPrerequisiteChains: PrerequisiteChain[] = [
  {
    id: '1',
    track: 'Mathematics Track',
    subjects: [
      { semester: 'Sem 1', code: 'MATH101' },
      { semester: 'Sem 2', code: 'MATH102' },
      { semester: 'Sem 3', code: 'MATH201' },
    ],
  },
  {
    id: '2',
    track: 'Structural Engineering Track',
    subjects: [
      { semester: 'Sem 2', code: 'MATH102' },
      { semester: 'Sem 3', code: 'CE201' },
      { semester: 'Sem 4', code: 'CE304' },
      { semester: 'Sem 4', code: 'CE305' },
    ],
  },
];

export default function SemesterSubjectManagement() {
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [searchText, setSearchText] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('dce');

  const filteredSubjects = useMemo(() => {
    return mockSubjects.filter(
      (subject) =>
        subject.code.toLowerCase().includes(searchText.toLowerCase()) ||
        subject.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const currentSemester = mockSemesters.find((s) => s.id === selectedSemester);

  const columns: TableColumnsType<Subject> = [
    {
      title: '',
      key: 'drag',
      width: 40,
      render: () => <span>≡</span>,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Subject Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 100,
      render: (credits) => (
        <Badge count={credits} style={{ backgroundColor: '#4a4a4a' }} />
      ),
    },
    {
      title: 'Theory/Practical',
      key: 'tp',
      width: 150,
      render: (_, record) => `${record.theory}T + ${record.practical}P`,
    },
    {
      title: 'Prerequisite',
      key: 'prerequisite',
      width: 150,
      render: (_, record) => {
        if (record.prerequisite === 'None') {
          return <Tag>None</Tag>;
        }
        if (record.prerequisite.includes('CE401')) {
          return (
            <Space size={6}>
              <Tag color="error">{record.prerequisite}</Tag>
              <Tag color="default">Required</Tag>
            </Space>
          );
        }
        return <Tag>{record.prerequisite}</Tag>;
      },
    },
    {
      title: 'Type',
      key: 'type',
      width: 120,
      render: (_, record) => (
        <Tag color="orange">{record.type}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: () => (
        <Space size="small">
          <EditOutlined style={{ cursor: 'pointer', fontSize: 16 }} />
          <DeleteOutlined style={{ cursor: 'pointer', fontSize: 16 }} />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Layout.Content style={{ padding: '24px' }}>
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
              <Button icon={<CopyOutlined />}>Duplicate</Button>
              <Button icon={<DownloadOutlined />}>Export</Button>
              <Button type="primary" danger icon={<PlusOutlined />}>
                Add Subject
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
              value={selectedProgram}
              onChange={setSelectedProgram}
              options={[
                {
                  label: 'Diploma in Civil Engineering',
                  value: 'dce',
                },
              ]}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
              Batch Context
            </label>
            <Select
              value="default"
              options={[{ label: 'Program Template (Default)', value: 'default' }]}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
              Search
            </label>
            <Input
              placeholder="Search subjects..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
            {mockSemesters.map((sem) => (
              <Button
                key={sem.id}
                type={selectedSemester === sem.id ? 'primary' : 'default'}
                style={{
                  borderRadius: '4px',
                  background:
                    selectedSemester === sem.id ? '#1890ff' : '#ccc',
                  color:
                    selectedSemester === sem.id ? 'white' : '#333',
                  border: 'none',
                  padding: '8px 16px',
                }}
                onClick={() => setSelectedSemester(sem.id)}
              >
                {sem.name}
                <Badge
                  count={`${sem.credits} CH`}
                  style={{
                    backgroundColor:
                      selectedSemester === sem.id ? '#0050b3' : '#999',
                    marginLeft: '4px',
                    padding: '0 4px',
                    borderRadius: '2px',
                    fontSize: '10px',
                  }}
                />
              </Button>
            ))}
          </div>

          {/* Current Semester Card */}
          {currentSemester && (
            <Card
              style={{
                background: '#b3b3b3',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              <Row gutter={16}>
                <Col span={20}>
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {currentSemester.name} - Level 5
                    </h3>
                    <p style={{ margin: '4px 0 0 0' }}>
                      {currentSemester.subjects} Subjects •
                      {currentSemester.subjects} Mandatory
                    </p>
                  </div>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                    {currentSemester.credits}
                  </div>
                  <div style={{ fontSize: '12px' }}>Credit Hours</div>
                </Col>
              </Row>
            </Card>
          )}

          {/* Subjects Table */}
          <Table
            columns={columns}
            dataSource={filteredSubjects}
            pagination={false}
            size="small"
            style={{ marginBottom: '24px' }}
          />
        </Card>

        {/* Prerequisite Chains */}
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>
              Prerequisite Chains
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>
              Visual representation of subject dependencies
            </p>
          </div>

          {mockPrerequisiteChains.map((chain) => (
            <Card key={chain.id} style={{ marginBottom: '12px' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>{chain.track}</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {chain.subjects.map((subject, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      style={{
                        padding: '8px 12px',
                        background: '#f0f0f0',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{subject.semester}</div>
                      <div style={{ color: '#666' }}>{subject.code}</div>
                    </div>
                    {idx < chain.subjects.length - 1 && (
                      <ArrowRightOutlined style={{ alignSelf: 'center' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </Card>
          ))}
        </Card>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <Tag color="red" style={{ cursor: 'default' }}>
            Hard
          </Tag>
          <Tag style={{ cursor: 'default' }}>Must pass</Tag>
          <Tag color="default" style={{ cursor: 'default' }}>
            Soft
          </Tag>
          <Tag color="default" style={{ cursor: 'default' }}>
            Recommended
          </Tag>
          <Tag color="cyan" style={{ cursor: 'default' }}>
            Co-requisite
          </Tag>
          <Tag color="default" style={{ cursor: 'default' }}>
            Same semester
          </Tag>
        </div>

        {/* Validation Section */}
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <InfoCircleOutlined
                style={{ fontSize: '18px', color: '#ff7a45' }}
              />
              <h2 style={{ margin: 0, fontSize: '18px' }}>
                Curriculum Validation
              </h2>
            </div>
          </div>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ background: '#e8e8e8' }}>
                <h4 style={{ margin: 0 }}>Total Subjects</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>20</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ background: '#e8e8e8' }}>
                <h4 style={{ margin: 0 }}>Subjects with Prerequisites</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>8</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ background: '#e8e8e8' }}>
                <h4 style={{ margin: 0 }}>Validation Status</h4>
                <div style={{ color: '#ff7a45', fontSize: '14px' }}>
                  <InfoCircleOutlined /> All constraints satisfied
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </Layout.Content>
    </Layout>
  );
}
