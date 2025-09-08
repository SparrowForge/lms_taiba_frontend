import {
  FilePdfOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  FundProjectionScreenOutlined,
  SnippetsOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { Button, Select, Tag, Card, Spin, Empty } from 'antd';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { Status } from '@/enums';

import { useCourseMaterials } from '@/hooks/useCourseMaterials';

import { ICourseMaterial } from '@/types/courseMaterial';

const materialTypes = ['pdf', 'lecture', 'video', 'slide', 'assignment', 'material'];

const CourseMaterials = () => {
  const locale = useLocale();
  const router = useRouter();
  const { courseMaterials, listStatus, loadCourseMaterials } = useCourseMaterials();
  const [selectedCourse, setSelectedCourse] = useState<string>('allCourses');
  const [selectedType, setSelectedType] = useState<string>('allTypes');

  // Fetch materials on mount
  useEffect(() => {
    loadCourseMaterials();
  }, [loadCourseMaterials]);

  // Filter materials based on selected type and course
  const filteredMaterials = courseMaterials.filter((m) => {
    const matchType = selectedType === 'allTypes' || m.type.toLowerCase() === selectedType;
    const matchCourse =
      selectedCourse === 'allCourses' || m.course?.id.toString() === selectedCourse;
    return matchType && matchCourse;
  });

  // Icon and tag helpers
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
            <FilePdfOutlined style={{ fontSize: 22, color: '#1677ff' }} />
          </div>
        );
      case 'lecture':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100">
            <BookOutlined style={{ fontSize: 22, color: '#5c6ac4' }} />
          </div>
        );
      case 'video':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100">
            <VideoCameraOutlined style={{ fontSize: 22, color: '#ff4d4f' }} />
          </div>
        );
      case 'slide':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-orange-100">
            <FundProjectionScreenOutlined style={{ fontSize: 22, color: '#fa8c16' }} />
          </div>
        );
      case 'assignment':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100">
            <FileTextOutlined style={{ fontSize: 22, color: '#52c41a' }} />
          </div>
        );
      case 'material':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-100">
            <SnippetsOutlined style={{ fontSize: 22, color: '#9254de' }} />
          </div>
        );
      default:
        return null;
    }
  };

  const getTagColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'blue';
      case 'lecture':
        return 'indigo';
      case 'video':
        return 'red';
      case 'slide':
        return 'orange';
      case 'assignment':
        return 'green';
      case 'material':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <Card style={{ marginBottom: '10px' }} className="rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {locale === 'ar' ? 'المواد الدراسية' : 'Course Materials'}
        </h2>
        <Button type="primary" onClick={() => router.push('/course-materials/create')}>
          <PlusOutlined />
          {locale === 'ar' ? 'رفع جديد' : 'Upload New'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 w-full">
        <Select
          defaultValue="allCourses"
          style={{ width: '100%' }}
          value={selectedCourse}
          onChange={(val) => setSelectedCourse(val)}
          options={[
            { value: 'allCourses', label: locale === 'ar' ? 'جميع الدورات' : 'All Courses' },
            ...courseMaterials
              .map((m) => m.course)
              .filter((c, i, arr) => c && arr.findIndex((x) => x?.id === c.id) === i) // unique courses
              .map((c) => ({
                value: c!.id.toString(),
                label: c!.name,
              })),
          ]}
        />

        <Select
          defaultValue="allTypes"
          style={{ width: '100%' }}
          value={selectedType}
          onChange={(val) => setSelectedType(val)}
          options={[
            { value: 'allTypes', label: locale === 'ar' ? 'جميع الأنواع' : 'All Types' },
            ...materialTypes.map((t) => ({
              value: t,
              label: t.charAt(0).toUpperCase() + t.slice(1),
            })),
          ]}
        />
      </div>

      {/* Loading / Empty states */}
      {listStatus.status === Status.LOADING && (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      )}
      {listStatus.status === Status.SUCCESS && filteredMaterials.length === 0 && (
        <Empty description={locale === 'ar' ? 'لا توجد مواد' : 'No Materials'} />
      )}

      {/* Materials List */}
      {listStatus.status === Status.SUCCESS && filteredMaterials.length > 0 && (
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
          {filteredMaterials.map((m: ICourseMaterial) => (
            <Card key={m.id} className="shadow-sm" bodyStyle={{ padding: '12px 16px' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(m.type)}
                  <div>
                    <h3 className="font-medium text-lg">{m.title}</h3>
                    <p className="text-xs text-gray-500">{m.description}</p>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                  <div className="flex flex-col justify-center mt-4">
                    <h1>
                      <Tag color={getTagColor(m.type)} style={{ border: '0' }}>
                        {m.type}
                      </Tag>
                    </h1>
                    <p>
                      {locale === 'ar' ? 'تم الرفع:' : 'Uploaded:'}{' '}
                      {new Date(m.createdAt).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <EditOutlined
                      style={{ fontSize: 18, cursor: 'pointer' }}
                      onClick={() => router.push(`/course-materials/${m.id}/edit`)}
                    />
                    <EyeOutlined
                      style={{ fontSize: 18, cursor: 'pointer' }}
                      onClick={() => router.push(`/course-materials/${m.id}`)}
                    />
                    <DeleteOutlined
                      style={{ fontSize: 18, cursor: 'pointer' }}
                      onClick={() => router.push('/course-materials')}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CourseMaterials;
