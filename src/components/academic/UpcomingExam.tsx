'use client';
import { Button, Card } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import DateCard from '../dashboard/dashboardui/cards/DateCard';
import { useExams } from '../../hooks/useExams';
import { useRouter } from 'next/navigation';
import { IExam } from '@/types/exam';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/enums/user-type.enum';

interface Exam {
  date: string;
  title: string;
  time: string;
  location: string;
  color: string;
}



const UpcomingExam = () => {
  const { t } = useLocalization();
  const { exams, loadExams } = useExams()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    loadExams({ page: 1, limit: 99, batchId: user?.student?.batchId })
  }, [loadExams, user?.student?.batchId])

  const handleExamCard = (exam: IExam) => {
    if (user?.type === UserType.STUDENT) {
      return router.push(`/exam-instructions?subjectId=${exam.subjectId}&examId=${exam.id}`)
    }else if (user?.type === UserType.FACULTY) {
      return router.push(`/exam-questions/create?subjectId=${exam.subjectId}`)
    }
  }

  const handleViewAllExam = () =>{
    return router.push(`/dashboard/course?tab=exam`)
  }


  return (
    <Card className="p-4 bg-white rounded-2xl shadow-md w-full md:w-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-gray-800">{t(LOCALE_KEYS.UPCOMING_EXAMS)}</h2>

        <Button onClick={()=>handleViewAllExam()} className="text-sm font-medium" style={{ color: '#1F4BCA' }}>
          {t(LOCALE_KEYS.VIEW_ALL)}
        </Button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {exams?.map((exam, idx) => (
          <button
            key={idx}
            onClick={() => handleExamCard(exam)}
            className="
          cursor-pointer
        group text-left
        rounded-xl
        transition-all duration-200
        hover:scale-[1.02]
        hover:shadow-lg
        focus:outline-none
      "
          >
            <div
              className="
          rounded-xl
          transition-colors duration-200
          group-hover:bg-purple-100
        "
            >
              <DateCard
                dateTime={exam.examDatetime}
                title={exam.name}
                location={exam.questionType}
                color="#ede9fe"
              />
            </div>
          </button>
        ))}
      </div>

    </Card>
  );
};

export default UpcomingExam;
