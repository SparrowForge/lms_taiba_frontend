'use client';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';
import { useSubjects } from '@/hooks/useSubjects';
import { SignatureOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const CourseDashboard: React.FC = () => {
  const {t} = useLocalization() 
  const {id} = useParams()
  const {selectedSubject, loadSubject} = useSubjects()

  useEffect(()=>{
      loadSubject(parseInt(id))
  },[loadSubject,id])


  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <SignatureOutlined style={{ color: '#155dfc' }} className="p-3 bg-blue-50 rounded-lg" />
          {selectedSubject?.name}
        </h2>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2">
            <VideoCameraOutlined style={{ color: '#155dfc' }} />
           {t(LOCALE_KEYS.JOIN_LIVE_CLASS)}
          </Button>
          {/* <Button className="text-sm">{t(LOCALE_KEYS.DOWNLOAD_MATERIALS)}</Button> */}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-center">
        <div className="bg-blue-50 rounded-lg px-3 py-4">
          <h1 className="text-xl font-bold">{t(LOCALE_KEYS.COMPLETED_UNITS)}</h1>
          <p className="text-[18px] font-bold">-</p>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-4">
          <h1 className="text-xl font-bold">{t(LOCALE_KEYS.MATHEMATICS)}</h1>
          <p className="text-[18px] font-bold text-green-600">-</p>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-4">
          <h1 className="text-xl font-bold">{t(LOCALE_KEYS.TIMESTAMP)}</h1>
          <p className="text-[18px] font-bold">-</p>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-4">
          <h1 className="text-xl font-bold">{t(LOCALE_KEYS.NEXT_EXAM)}</h1>
          <p className="text-[18px] font-bold text-blue-600">-</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;
