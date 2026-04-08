'use client';

import { Card, Divider, Typography } from 'antd';
import React from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import type { ICourse } from '@/types/course';

import type { ISemesterFormData } from './types';
import SemesterCard from './SemesterCard';

const { Text } = Typography;

interface BatchSemestersCardProps {
  semesters: ISemesterFormData[];
  selectedCourse: ICourse | null;
  getCourseDurationMonths: (course: ICourse) => number;
  onUpdateSemester: (index: number, field: keyof ISemesterFormData, value: unknown) => void;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

export default function BatchSemestersCard({
  semesters,
  selectedCourse,
  getCourseDurationMonths,
  onUpdateSemester,
  t,
}: BatchSemestersCardProps) {
  return (
    <Card title={`Semesters (${semesters.length})`} style={{ width: '100%' }}>
      {selectedCourse && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Course: {selectedCourse.name}</Text>
          <br />
          <Text type="secondary">
            Duration: {getCourseDurationMonths(selectedCourse)} months
            {selectedCourse.durationInSemesters != null && (
              <> ({selectedCourse.durationInSemesters} semesters)</>
            )}
          </Text>
          {selectedCourse.totalCreditHours != null && selectedCourse.totalCreditHours > 0 && (
            <>
              <br />
              <Text type="secondary">
                {t(LOCALE_KEYS.CREDIT_HOURS)} (total): {selectedCourse.totalCreditHours} —
                distributed across semesters; change one to recalculate others.
              </Text>
            </>
          )}
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Start and end dates are automatically calculated based on course duration. Each
            semester starts where the previous one ends.
          </Text>
        </div>
      )}
      <Divider />
      {semesters.map((semester, index) => (
        <SemesterCard
          key={index}
          semester={semester}
          onUpdate={(field, value) => onUpdateSemester(index, field, value)}
          t={t}
        />
      ))}
    </Card>
  );
}
