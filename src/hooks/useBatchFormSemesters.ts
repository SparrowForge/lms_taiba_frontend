import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { SemesterStatus } from '@/enums';

import type { ICourse } from '@/types/course';

import type { ISemesterFormData } from '@/components/batches/BatchForm/types';

function distributeCreditHours(total: number, count: number): number[] {
  if (count <= 0 || total < 0) return [];
  const base = Math.floor(total / count);
  const remainder = total % count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}

function generateSemesterNameWithTerm(termNo: number, startDate: dayjs.Dayjs) {
  return `Level ${termNo} ${startDate.year()}`;
}

export function useBatchFormSemesters(
  form: FormInstance,
  options: { courses: ICourse[] },
) {
  const { courses } = options;
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [semesters, setSemesters] = useState<ISemesterFormData[]>([]);
  const [showSemesterSection, setShowSemesterSection] = useState(false);

  const getCourseDurationMonths = useCallback((course: ICourse) => {
    return course.durationInMonths ?? (course.durationInSemesters ?? 1) * 6;
  }, []);

  const recalculateSemesterDates = useCallback(
    (semesterList: ISemesterFormData[], _changedIndex: number) => {
      const batchStartDate = form.getFieldValue('startDate');
      if (!batchStartDate) return;

      const batchStart = dayjs(batchStartDate);
      let currentDate = batchStart;

      for (let i = 0; i < semesterList.length; i++) {
        const semester = semesterList[i];
        semester.startDate = currentDate.toISOString();
        const endDate = currentDate.add(semester.duration, 'month');
        semester.endDate = endDate.toISOString();
        semester.name = generateSemesterNameWithTerm(semester.termNo, currentDate);
        currentDate = endDate;
      }
    },
    [form],
  );

  const redistributeCreditHours = useCallback(
    (
      list: ISemesterFormData[],
      changedIndex: number,
      newValue: number,
      totalFromCourse?: number,
    ) => {
      if (totalFromCourse == null || totalFromCourse <= 0 || list.length <= 1) return;
      const remaining = Math.max(0, totalFromCourse - newValue);
      const otherIndices = list.map((_, i) => i).filter((i) => i !== changedIndex);
      const distributed = distributeCreditHours(remaining, otherIndices.length);
      otherIndices.forEach((i, j) => {
        list[i].creditHours = distributed[j];
      });
    },
    [],
  );

  const generateSemesters = useCallback(
    (duration: number, totalCreditHours?: number) => {
      const newSemesters: ISemesterFormData[] = [];
      const batchStartDate = form.getFieldValue('startDate');
      const creditPerSemester =
        totalCreditHours != null && totalCreditHours > 0 && duration > 0
          ? distributeCreditHours(totalCreditHours, duration)
          : [];
      const defaultSemesterDuration = 3;

      for (let i = 1; i <= duration; i++) {
        let semesterStartDate = '';
        let semesterEndDate = '';
        let semesterName = '';

        if (batchStartDate) {
          const batchStart = dayjs(batchStartDate);
          let semesterStart = batchStart;
          if (i > 1) {
            for (let j = 1; j < i; j++) {
              const prev = newSemesters[j - 1]?.duration ?? defaultSemesterDuration;
              semesterStart = semesterStart.add(prev, 'month');
            }
          }
          const semesterEnd = semesterStart.add(defaultSemesterDuration, 'month');
          semesterStartDate = semesterStart.toISOString();
          semesterEndDate = semesterEnd.toISOString();
          semesterName = generateSemesterNameWithTerm(i, semesterStart);
        } else {
          semesterName = `Semester ${i}`;
        }

        newSemesters.push({
          batchId: 0,
          name: semesterName,
          termNo: i,
          startDate: semesterStartDate,
          endDate: semesterEndDate,
          duration: defaultSemesterDuration,
          status: SemesterStatus.ACTIVE,
          remarks: '',
          isBreak: false,
          creditHours: creditPerSemester[i - 1],
        });
      }
      setSemesters(newSemesters);
    },
    [form],
  );

  const updateSemester = useCallback(
    (index: number, field: keyof ISemesterFormData, value: unknown) => {
      setSemesters((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'duration' && typeof value === 'number' && value > 0) {
          recalculateSemesterDates(updated, index);
        }
        if (field === 'creditHours' && typeof value === 'number' && selectedCourse?.totalCreditHours) {
          redistributeCreditHours(updated, index, value, selectedCourse.totalCreditHours);
        }
        return updated;
      });
    },
    [recalculateSemesterDates, redistributeCreditHours, selectedCourse?.totalCreditHours],
  );

  const handleBatchDateChange = useCallback(() => {
    if (!selectedCourse) return;
    setSemesters((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.map((s) => ({ ...s }));
      recalculateSemesterDates(next, 0);
      return next;
    });
  }, [selectedCourse, recalculateSemesterDates]);

  const handleStartDateChange = useCallback(
    (date: unknown) => {
      const duration = form.getFieldValue('duration');
      if (duration && duration > 0 && date) {
        form.setFieldsValue({ endDate: dayjs(date as string).add(duration, 'month') });
      }
      handleBatchDateChange();
    },
    [form, handleBatchDateChange],
  );

  const handleCourseChange = useCallback(
    (courseId: number) => {
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        setSelectedCourse(course);
        const durationMonths = getCourseDurationMonths(course);
        form.setFieldsValue({ duration: durationMonths });
        const startDate = form.getFieldValue('startDate');
        if (startDate && durationMonths > 0) {
          form.setFieldsValue({ endDate: dayjs(startDate).add(durationMonths, 'month') });
        }
        generateSemesters(
          course.durationInSemesters ?? 1,
          course.totalCreditHours ?? undefined,
        );
        setShowSemesterSection(true);
      } else {
        setSelectedCourse(null);
        setSemesters([]);
        setShowSemesterSection(false);
        form.setFieldsValue({ duration: undefined });
      }
    },
    [courses, form, getCourseDurationMonths, generateSemesters],
  );

  const resetSemesters = useCallback(() => {
    setSelectedCourse(null);
    setSemesters([]);
    setShowSemesterSection(false);
  }, []);

  return {
    selectedCourse,
    semesters,
    setSemesters,
    showSemesterSection,
    getCourseDurationMonths,
    handleCourseChange,
    generateSemesters,
    updateSemester,
    handleBatchDateChange,
    handleStartDateChange,
    resetSemesters,
  };
}
