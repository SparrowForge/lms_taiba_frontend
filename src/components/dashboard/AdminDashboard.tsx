'use client';

import {
  BookOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Spin, Statistic, Typography } from 'antd';

import { useAdminStats } from '@/hooks/useAdminStats';

import WelcomeSection from './newComponents/WelcomeSection';

const { Title } = Typography;

const AdminDashboard = () => {
  const { stats, isLoading, error, reloadStats } = useAdminStats();

  if (error) {
    return (
      <div className="p-6">
        <WelcomeSection />
        <Card className="mt-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load statistics</p>
            <Button type="primary" icon={<ReloadOutlined />} onClick={reloadStats}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Admin Dashboard</Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={reloadStats}
          loading={isLoading}
        >
          Refresh Stats
        </Button>
      </div>

      <WelcomeSection />

      {isLoading && !stats ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : stats ? (
        <>
          {/* Main Statistics */}
          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Students"
                  value={stats.students.total}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Active: {stats.students.active} | Inactive: {stats.students.inactive}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Courses"
                  value={stats.courses.total}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Active: {stats.courses.active} | Inactive: {stats.courses.inactive}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Subjects"
                  value={stats.subjects.total}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Active: {stats.subjects.active} | Inactive: {stats.subjects.inactive}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Faculty"
                  value={stats.faculty.total}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Active: {stats.faculty.active} | Inactive: {stats.faculty.inactive}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Additional Statistics */}
          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Batches"
                  value={stats.totalBatches}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Semesters"
                  value={stats.totalSemesters}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Sections"
                  value={stats.totalSections}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={stats.totalUsers}
                  valueStyle={{ color: '#f5222d' }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Active: {stats.activeUsers} | Inactive: {stats.inactiveUsers}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Departments and Branches */}
          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Departments"
                  value={stats.totalDepartments}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Branches"
                  value={stats.totalBranches}
                  valueStyle={{ color: '#2f54eb' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Academic Statistics */}
          <Card title="Academic Statistics" className="mt-6">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <Statistic title="Total Exams" value={stats.academic.totalExams} />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Exam Results"
                  value={stats.academic.totalExamResults}
                />
                <div className="mt-1 text-sm text-gray-500">
                  Published: {stats.academic.publishedExamResults}
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Exam Submissions"
                  value={stats.academic.totalExamSubmissions}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Subject Results"
                  value={stats.academic.totalSubjectResults}
                />
                <div className="mt-1 text-sm text-gray-500">
                  Published: {stats.academic.publishedSubjectResults}
                </div>
              </Col>
            </Row>
          </Card>

          {/* Metrics */}
          <Card title="Key Metrics" className="mt-6">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Students per Faculty"
                  value={stats.studentsPerFaculty}
                  precision={2}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Subjects per Course"
                  value={stats.subjectsPerCourse}
                  precision={2}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Students per Batch"
                  value={stats.studentsPerBatch}
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Active Student %"
                  value={stats.activeStudentPercentage}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
            </Row>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="mt-6">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <Title level={5}>Courses</Title>
                  <div className="text-sm text-gray-600">
                    This Month: {stats.recentActivity.courses.thisMonth}
                  </div>
                  <div className="text-sm text-gray-600">
                    This Year: {stats.recentActivity.courses.thisYear}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <Title level={5}>Subjects</Title>
                  <div className="text-sm text-gray-600">
                    This Month: {stats.recentActivity.subjects.thisMonth}
                  </div>
                  <div className="text-sm text-gray-600">
                    This Year: {stats.recentActivity.subjects.thisYear}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <Title level={5}>Students</Title>
                  <div className="text-sm text-gray-600">
                    This Month: {stats.recentActivity.students.thisMonth}
                  </div>
                  <div className="text-sm text-gray-600">
                    This Year: {stats.recentActivity.students.thisYear}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <Title level={5}>Faculty</Title>
                  <div className="text-sm text-gray-600">
                    This Month: {stats.recentActivity.faculty.thisMonth}
                  </div>
                  <div className="text-sm text-gray-600">
                    This Year: {stats.recentActivity.faculty.thisYear}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Student Status Breakdown */}
          <Card title="Student Status Breakdown" className="mt-6">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={4}>
                <Statistic title="Pending" value={stats.students.pending} />
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Statistic
                  title="Active"
                  value={stats.students.active}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Statistic
                  title="Inactive"
                  value={stats.students.inactive}
                  valueStyle={{ color: '#999' }}
                />
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Statistic title="Graduated" value={stats.students.graduated} />
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Statistic title="Dropped" value={stats.students.dropped} />
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Statistic title="Suspended" value={stats.students.suspended} />
              </Col>
            </Row>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
