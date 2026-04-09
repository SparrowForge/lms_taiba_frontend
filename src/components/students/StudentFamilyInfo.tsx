'use client';

import {
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Empty, Space, Tag } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useStudentFamilies } from '@/hooks/useStudentFamilies';
import StudentFamilyFormDrawer from '../studentFamilies/StudentFamilyFormDrawer';

const StudentFamilyInfo = () => {
  const { loadStudentFamilies, studentFamilies } = useStudentFamilies();
  const { id } = useParams();
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedStudentFamilyId, setSelectedStudentFamilyId] = useState<number | undefined>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadStudentFamilies({ page: 1, limit: 1, studentId: Number(id) });
  };

  useEffect(() => {
    if (id) {
      loadStudentFamilies({
        page: 1,
        limit: 1,
        studentId: Number(id),
      });
    }
  }, [loadStudentFamilies, id]);

  const family = studentFamilies?.[0];

  const handleCreateDrawer = () => {
    console.log('object');
    setSelectedStudentFamilyId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  return (
    <>
      {!family ? (
        <Card className="rounded-lg ">
          <Button
            type="primary"
            danger
            icon={<PlusOutlined />}
            onClick={handleCreateDrawer}
            className="flex items-center gap-2 justify-end"
          >
            Add Family Information
          </Button>
          <p className="text-gray-500 text-center">
            <Empty description="No family information available." />
          </p>
        </Card>
      ) : (
        <Card className="rounded-lg" title="Family Information" style={{ marginBottom: '80px' }}>
          {/* Father Info */}
          <div className="flex justify-between">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <UserOutlined />
                Father Information
              </h3>

              <Space direction="vertical" size="small">
                <span>
                  <strong>Name:</strong> {family.fatherName}
                </span>
                <span>
                  <HomeOutlined /> {family.fatherAddress}
                </span>
                <span>
                  <PhoneOutlined /> {family.fatherPhone}
                </span>
                <span>
                  <MailOutlined /> {family.fatherEmail}
                </span>
              </Space>
            </div>

            <Button
              type="primary"
              danger
              icon={<PlusOutlined />}
              onClick={handleCreateDrawer}
              className="flex items-center gap-2 justify-end"
            >
              Add Family Information
            </Button>
          </div>

          {/* Mother Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <UserOutlined />
              Mother Information
            </h3>

            <Space direction="vertical" size="small">
              <span>
                <strong>Name:</strong> {family.motherName}
              </span>
              <span>
                <PhoneOutlined /> {family.motherPhone}
              </span>
              <span>
                <MailOutlined /> {family.motherEmail}
              </span>
            </Space>
          </div>

          {/* Siblings Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TeamOutlined />
              Siblings
            </h3>

            <p className="mb-2">
              <strong>Total Siblings:</strong> {family.noOfSiblings}
            </p>

            <div className="flex flex-wrap gap-2">
              {family.siblingsIds?.length > 0 ? (
                family.siblingsIds.map((siblingId: number) => (
                  <Tag key={siblingId} color="blue">
                    Student ID: {siblingId}
                  </Tag>
                ))
              ) : (
                <span className="text-gray-500">No siblings listed</span>
              )}
            </div>
          </div>
        </Card>
      )}

      <StudentFamilyFormDrawer
        mode={drawerMode}
        studentFamilyId={selectedStudentFamilyId}
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        onSuccess={handleDrawerSuccess}
      />
    </>
  );
};

export default StudentFamilyInfo;
