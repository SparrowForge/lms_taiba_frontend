'use client';
import { Button, Card } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import DateCard from '../dashboard/dashboardui/cards/DateCard';
import { useExams } from '../../hooks/useExams';

interface Exam {
  date: string;
  title: string;
  time: string;
  location: string;
  color: string;
}

const data: Exam[] = [
  {
    date: '23 JUL',
    title: 'Web Development Mid-term',
    time: '9:00 AM',
    location: 'Room 101',
    color: '#dbeafe',
  },
  {
    date: '25 JUL',
    title: 'Database Systems Exam',
    time: '11:00 AM',
    location: 'Lab 202',
    color: '#dcfce7',
  },
  {
    date: '28 JUL',
    title: 'UI Design Project Defense',
    time: '1:00 PM',
    location: 'Room 305',
    color: '#ede9fe',
  },
];

const UpcomingExam = () => {
  const { t } = useLocalization();
  const {exams, loadExams} = useExams()

  useEffect(()=>{
    loadExams({page:1, limit:99})
  },[loadExams])


  return (
    <Card className="p-4 bg-white rounded-2xl shadow-md w-full md:w-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{t(LOCALE_KEYS.UPCOMING_EXAMS)}</h2>

        <Button className="text-sm font-medium" style={{ color: '#1F4BCA' }}>
          {t(LOCALE_KEYS.VIEW_ALL)}
        </Button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {exams?.map((exam, idx) => (
          <DateCard
            key={idx}
            dateTime={exam.examDatetime}
            title={exam.name}
            location={exam.questionType}
            color='#ede9fe'
          />
        ))}
      </div>
    </Card>
  );
};

export default UpcomingExam;
