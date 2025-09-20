'use client';

import { SignatureOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useLocale } from 'next-intl';

const CourseDashboard: React.FC = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <SignatureOutlined style={{ color: '#155dfc' }} className="p-3 bg-blue-50 rounded-lg" />
          {isArabic ? 'الرياضيات' : 'Mathematics'}
        </h2>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2">
            <VideoCameraOutlined style={{ color: '#155dfc' }} />
            {isArabic ? 'الانضمام للفصل المباشر' : 'Join Live Class'}
          </Button>
          <Button className="text-sm">{isArabic ? 'تحميل المواد' : 'Download Materials'}</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-5 text-center">
        <div className="bg-blue-50 rounded-lg px-3 py-4">
          <h1 className="text-xl font-bold">{isArabic ? 'الوحدات المكتملة' : 'Completed Units'}</h1>
          <p className="text-[18px] font-bold">8/12</p>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-4">
          <h1 className="text-xl font-bold">{isArabic ? 'متوسط الدرجة' : 'Average Grade'}</h1>
          <p className="text-[18px] font-bold text-green-600">86%</p>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-4">
          <h1 className="text-xl font-bold">{isArabic ? 'الوقت المستغرق' : 'Time Spent'}</h1>
          <p className="text-[18px] font-bold">28h 15m</p>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-4">
          <h1 className="text-xl font-bold">{isArabic ? 'الاختبار القادم' : 'Next Exam'}</h1>
          <p className="text-[18px] font-bold text-blue-600">Aug 29</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;
