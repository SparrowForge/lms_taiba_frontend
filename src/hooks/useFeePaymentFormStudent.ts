'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useStudents } from '@/hooks/useStudents';

import { STUDENT_SELECTOR_LIMIT } from '@/components/feePaymentCollections/FeePaymentCollectionFormBulk/constants';

import type { IStudentWithFeeInfo } from '@/types/student';

export function useFeePaymentFormStudent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const studentId = searchParams.get('studentId');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const { courses, loadCourses } = useCourses();
  const { batches, loadBatches } = useBatches();
  const {
    students,
    loadStudents,
    loadStudentWithFeeInfo,
    studentWithFeeInfo,
    detailsStatus,
    listStatus,
  } = useStudents();

  const noStudentInParam =
    !studentId ||
    (studentId &&
      detailsStatus.status !== Status.LOADING &&
      !studentWithFeeInfo?.student);

  useEffect(() => {
    if (noStudentInParam) {
      loadCourses({ page: 1, limit: STUDENT_SELECTOR_LIMIT });
    }
  }, [noStudentInParam, loadCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      loadBatches({ page: 1, limit: STUDENT_SELECTOR_LIMIT, courseId: selectedCourseId });
      setSelectedBatchId(null);
      setSelectedStudentId(null);
    }
  }, [selectedCourseId, loadBatches]);

  useEffect(() => {
    if (selectedBatchId) {
      loadStudents({ page: 1, limit: STUDENT_SELECTOR_LIMIT, batchId: selectedBatchId });
      setSelectedStudentId(null);
    }
  }, [selectedBatchId, loadStudents]);

  const handleApplyStudent = () => {
    if (!selectedStudentId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('studentId', String(selectedStudentId));
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (studentId) {
      loadStudentWithFeeInfo(parseInt(studentId));
    }
  }, [studentId, loadStudentWithFeeInfo]);

  return {
    studentId,
    studentWithFeeInfo: studentWithFeeInfo as IStudentWithFeeInfo | null,
    noStudentInParam,
    detailsStatus,
    listStatus,
    courses,
    batches,
    students,
    selectedCourseId,
    setSelectedCourseId,
    selectedBatchId,
    setSelectedBatchId,
    selectedStudentId,
    setSelectedStudentId,
    handleApplyStudent,
  };
}
