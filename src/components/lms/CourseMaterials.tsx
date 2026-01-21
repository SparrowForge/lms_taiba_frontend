import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  SnippetsOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {  Card, Empty, Select, Spin, Tag } from 'antd';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';
import { UserType } from '@/enums/user-type.enum';

import { useAuth } from '@/hooks/useAuth';
import { useCourseMaterials } from '@/hooks/useCourseMaterials';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourseMaterial } from '@/types/courseMaterial';

import CourseMaterialDetailsDrawer from '../courseMaterials/CourseMaterialDetailsDrawer';
import CourseMaterialFormDrawer from '../courseMaterials/CourseMaterialFormDrawer';

const materialTypes = ['pdf', 'lecture', 'video', 'slide', 'assignment', 'material'];

const CourseMaterials = () => {
  const { t } = useLocalization();
 
  const locale = useLocale();
  const router = useRouter();
  const {user} = useAuth()
  const searchParams = useSearchParams();
  const {id} = useParams()

  const semesterId = searchParams.get("semesterId");

  const { courseMaterials, listStatus, loadCourseMaterials } = useCourseMaterials();
  const [selectedCourse, setSelectedCourse] = useState<string>('allCourses');
  const [selectedType, setSelectedType] = useState<string>('allTypes');
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsCourseMaterialId, setSelectedDetailsCourseMaterialId] = useState<
    number | undefined
  >();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'edit' | 'create'>('edit');
  const [selectedCourseMaterialId, setSelectedCourseMaterialId] = useState<number | undefined>();

  // Fetch materials on mount
  useEffect(() => {
    if(user?.type === UserType.FACULTY){
      loadCourseMaterials({page:1, limit:99, facultyId:user?.faculty?.id, subjectId:Number(id)})
    }else if(user?.type === UserType.STUDENT){
      loadCourseMaterials({page:1, limit:99, courseId:user?.student?.courseId, batchId:user?.student?.batchId})
    }else if(user?.type === UserType.ADMIN){
      loadCourseMaterials({page:1, limit:99})
    }
  }, [id, loadCourseMaterials, semesterId, user?.faculty?.id, user?.student?.batchId, user?.student?.courseId, user?.type]);

  // Filter materials based on selected type and course
  const filteredMaterials = courseMaterials.filter((m) => {
    const matchType = selectedType === 'allTypes' || m.type.toLowerCase() === selectedType;
    const matchCourse =
      selectedCourse === 'allCourses' || m.course?.id.toString() === selectedCourse;
    return matchType && matchCourse;
  });

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadCourseMaterials({ page: 1, limit: 10 });
  };

  const handleViewDetails = (courseMaterialId: number) => {
    setSelectedDetailsCourseMaterialId(courseMaterialId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (courseMaterialId: number) => {
    setSelectedDetailsCourseMaterialId(undefined); // close details first
    setDetailsDrawerVisible(false);
    setSelectedCourseMaterialId(courseMaterialId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

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
      case 'document':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-100">
            <SnippetsOutlined style={{ fontSize: 22, color: '#06b6d4' }} />
          </div>
        );
      // case 'other':
      //   return (
      //     <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100">
      //       <BookOutlined style={{ fontSize: 22, color: '#ff4d4f' }}  />
      //     </div>
      //   );
      default:
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100">
            <BookOutlined style={{ fontSize: 22, color: '#ff4d4f' }} />
          </div>
        );
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
      case 'document':
        return 'cyan';
      default:
        return 'red';
    }
  };

  return (
    <Card style={{ marginBottom: '10px' }} className="rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{t(LOCALE_KEYS.COURSE_MATERIALS)}</h2>
        
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 w-full">
        {/* <Select
          defaultValue="allCourses"
          style={{ width: '100%' }}
          value={selectedCourse}
          onChange={(val) => setSelectedCourse(val)}
          options={[
            { value: 'allCourses', label: t(LOCALE_KEYS.ALL_COURSES) },
            ...courseMaterials
              .map((m) => m.course)
              .filter((c, i, arr) => c && arr.findIndex((x) => x?.id === c.id) === i)
              .map((c) => ({
                value: c!.id.toString(),
                label: c!.name,
              })),
          ]}
        /> */}

        <Select
          defaultValue="allTypes"
          style={{ width: '100%' }}
          value={selectedType}
          onChange={(val) => setSelectedType(val)}
          options={[
            { value: 'allTypes', label: t(LOCALE_KEYS.ALL_TYPES) },
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
        <Empty description={t(LOCALE_KEYS.NO_MATERIALS)} />
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
                      <p className="text-sm">
                        {t(LOCALE_KEYS.UPLOADED)} {new Date(m.createdAt).toLocaleDateString(locale)}
                      </p>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <EditOutlined
                      style={{ fontSize: 18, cursor: 'pointer' }}
                      onClick={() => handleDetailsEdit(m.id)}
                    />
                    <EyeOutlined
                      style={{ fontSize: 18, cursor: 'pointer' }}
                      onClick={() => handleViewDetails(m.id)}
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
      <CourseMaterialDetailsDrawer
        courseMaterialId={selectedDetailsCourseMaterialId}
        visible={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={handleDetailsEdit}
      />

      {drawerVisible && (
        <CourseMaterialFormDrawer
          mode={drawerMode}
          courseMaterialId={selectedCourseMaterialId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />
      )}
    </Card>
  );
};

export default CourseMaterials;
