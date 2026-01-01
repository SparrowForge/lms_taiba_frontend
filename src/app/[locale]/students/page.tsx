'use client';

import {CheckOutlined, DollarOutlined} from '@ant-design/icons';
import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {STUDENT_STATUS_OPTIONS} from '@/constants/statusOptions';
import {Status} from '@/enums';
import {StudentStatus} from '@/enums/status';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import ApproveStudentDrawer from '@/components/students/ApproveStudentDrawer';
import AssignFeeStructureDrawer from '@/components/students/AssignFeeStructureDrawer';
import StudentDetailsDrawer from '@/components/students/StudentDetailsDrawer';
import StudentFormDrawer from '@/components/students/StudentFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useBatches} from '@/hooks/useBatches';
import {useCourses} from '@/hooks/useCourses';
import {useLocalization} from '@/hooks/useLocalization';
import {useStudents} from '@/hooks/useStudents';

import {IStudent} from '@/types/student';
import { useSections } from '@/hooks/useSections';

export default function StudentsPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsStudentId, setSelectedDetailsStudentId] = useState<number | undefined>();
  const [assignFeeDrawerVisible, setAssignFeeDrawerVisible] = useState(false);
  const [selectedAssignStudentId, setSelectedAssignStudentId] = useState<number | undefined>();
  const [approveDrawerVisible, setApproveDrawerVisible] = useState(false);
  const [selectedApproveStudent, setSelectedApproveStudent] = useState<number>();
   

  const { students, listStatus, pagination, loadStudents, removeStudent } =
    useStudents();
  const { batches, loadBatches, clearBatches } = useBatches();
  const { courses, loadCourses } = useCourses();
  const {loadSections, sections} = useSections()
  const searchParams = useSearchParams();

  //get skip & limit from url
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const courseId = searchParams.get('courseId');
  const batchId = searchParams.get('batchId');

  const loadWithParams = (
    searchParams: URLSearchParams,
    skip: string | null,
    limit: string | null,
  ) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    delete params.batchId;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    loadStudents({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadStudents]);

  // Load batch options for filter
  useEffect(() => {
    if (courseId) {
      loadBatches({ page: 1, limit: 99, courseId: parseInt(courseId) });
    } else {
      clearBatches();
    }
  }, [loadBatches, courseId, clearBatches]);

  // Load batch options for filter
  useEffect(() => {
    if (batchId) {
      loadSections({ page: 1, limit: 99, batchId: parseInt(batchId) });
    } 
  }, [loadSections, batchId]);

  useEffect(() => {
    loadCourses({ page: 1, limit: 99 });
  }, [loadCourses]);

  const handleEditDrawer = (studentId: number) => {
    setSelectedStudentId(studentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedStudentId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadStudents({ page: 1, limit: 10 });
  };

  const handleViewDetails = (studentId: number) => {
    setSelectedDetailsStudentId(studentId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (studentId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedStudentId(studentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleAssignFeeStructure = (studentId: number) => {
    setSelectedAssignStudentId(studentId);
    setAssignFeeDrawerVisible(true);
  };

  const handleAssignFeeSuccess = () => {
    setAssignFeeDrawerVisible(false);
    loadWithParams(searchParams, skip, limit);
  };

  const handleApproveStudent = (studentId: number) => {
    setSelectedApproveStudent(studentId);
    setApproveDrawerVisible(true);
  };

  const handleApproveStudentSuccess = () => {
    setApproveDrawerVisible(false);
    loadWithParams(searchParams, skip, limit);
  };



  const config: EntityConfig<IStudent> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/students',
    searchFields: ['name', 'applicationNo', 'cardNo', 'registrationNo'] as (keyof IStudent)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadStudents({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: students,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    filters: [
      {
        key: 'status',
        label: t(LOCALE_KEYS.STATUS),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...STUDENT_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
        ],
      },
      {
        key: 'courseId',
        label: t(LOCALE_KEYS.COURSE),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...courses.map((c) => ({ label: c.name, value: String(c.id) })),
        ],
      },
      {
        key: 'batchId',
        label: t(LOCALE_KEYS.BATCH),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...batches.map((b) => ({ label: b.name, value: String(b.id) })),
        ],
      },
      {
        key: 'sectionId',
        label: t(LOCALE_KEYS.SECTION),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...sections.map((b) => ({ label: b.name, value: String(b.id) })),
        ],
      },
    ],
    columns: [
      {
        title: t(LOCALE_KEYS.APPLICATION_NO, { defaultValue: 'Application No' }),
        dataIndex: 'applicationNo',
        key: 'applicationNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.NAME, { defaultValue: 'Name' }),
        key: 'name',
        render: (data: IStudent) => (
          <span>
            {data.firstName} {data.middleName} {data.lastName}
          </span>
        ),
      },
      {
        title: t(LOCALE_KEYS.CARD_NO, { defaultValue: 'Card No' }),
        dataIndex: 'cardNo',
        key: 'cardNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.REGISTRATION_NO, { defaultValue: 'Registration No' }),
        dataIndex: 'registrationNo',
        key: 'registrationNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.COURSE),
        dataIndex: ['course', 'name'],
        key: 'course',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.BATCH),
        dataIndex: ['batch', 'name'],
        key: 'batch',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.BRANCH),
        dataIndex: ['branch', 'name'],
        key: 'branch',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {translate('status_' + status)}
          </span>
        ),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (student: IStudent) => (
          <EntityActions
            onView={() => router.push(`/students/${student.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/students/${student.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeStudent(student.id)}
            id={student.id}
            extraActions={[
              student.status === StudentStatus.PENDING
                ? {
                    key: 'assignFeeStructure',
                    icon: <DollarOutlined />,
                    label: student.feeStructureId !== null ? t(LOCALE_KEYS.FEE_STRUCTURE) : t(LOCALE_KEYS.ASSIGN_FEE_STRUCTURE),
                    onClick: () => handleAssignFeeStructure(student.id),
                  }
                : null,
              student.feeStructureId !== null
                ? {
                    key: 'feePaymentCollections',
                    icon: <DollarOutlined />,
                    label: t(LOCALE_KEYS.FEE_PAYMENT_COLLECTIONS),
                    onClick: () =>
                      router.push(`/fee-payment-collections/create?studentId=${student.id}`),
                  }
                : null,
              student.status === StudentStatus.PENDING
                ? {
                    key: 'approve',
                    icon: <CheckOutlined />,
                    label: t(LOCALE_KEYS.APPROVE),
                    onClick: () => handleApproveStudent(student.id),
                  }
                : null,
            ]}
          />
        ),
      },
    ],
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <AsyncErrorBoundary
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
              : null
          }
          onRetry={() => loadStudents({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IStudent>} />
        </AsyncErrorBoundary>

        <StudentFormDrawer
          mode={drawerMode}
          studentId={selectedStudentId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <StudentDetailsDrawer
          studentId={selectedDetailsStudentId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />

        <AssignFeeStructureDrawer
          studentId={selectedAssignStudentId}
          visible={assignFeeDrawerVisible}
          onClose={() => setAssignFeeDrawerVisible(false)}
          onSuccess={handleAssignFeeSuccess}
        />

        <ApproveStudentDrawer
          studentId={selectedApproveStudent}
          visible={approveDrawerVisible}
          onClose={() => setApproveDrawerVisible(false)}
          onSuccess={handleApproveStudentSuccess}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
