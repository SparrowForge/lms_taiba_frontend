'use client';


import {  Card, Empty, Spin,  } from 'antd';
import React, { useEffect,  } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';


import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';

import FacultyExamList from './FacultyExamLists';





const FacultyExamsManagement: React.FC = () => {
  const { t } = useLocalization();
    const {exams, loadExams, listStatus} = useExams()

    useEffect(()=>{
        loadExams({page:1, limit:99})
    },[loadExams])
  return (
    <Card className="rounded-xl shadow-sm mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t(LOCALE_KEYS.EXAM_SCHEDULE)}</h2>
      </div>

      {/* States */}
      {listStatus.status === Status.LOADING && (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      )}

      {listStatus.status === Status.SUCCESS && exams?.length === 0 && (
        <Empty description="NO_ASSIGNMENT" />
      )}

      {/* Assignment Cards */}
      {listStatus.status === Status.SUCCESS && exams?.length > 0 && (
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
          {exams?.map((item) => (
            <FacultyExamList key={item.id} data={item}/>
          ))}
        </div>
      )}

      

    </Card>
  );
};

export default FacultyExamsManagement;
