'use client';

import { Tabs } from 'antd';
import { useLocale } from 'next-intl';

const UpperTab: React.FC<{ onTabChange: (key: string) => void }> = ({ onTabChange }) => {
  const locale = useLocale();

  const items = [
    {
      key: 'courses',
      title: 'Course Materials',
      localeTitle: 'المواد الدراسية',
    },
    {
      key: 'quizzes',
      title: 'Quizzes',
      localeTitle: 'الاختبارات',
    },
    {
      key: 'submissions',
      title: 'Submissions',
      localeTitle: 'التسليمات',
    },
    {
      key: 'discussion',
      title: 'Discussion',
      localeTitle: 'المناقشات',
    },
    {
      key: 'grading',
      title: 'Grading',
      localeTitle: 'الدرجات',
    },
  ];

  return (
    // <div className=" w-[100%] flex justify-around mb-4">
    <Tabs
      size="large"
      className="uppertab full-width-tabs"
      defaultActiveKey="courses"
      items={items.map((item) => ({
        key: item.key,
        label: (
          <div className="w-full text-center text-lg font-semibold">
            {locale === 'ar' ? item.localeTitle : item.title}
          </div>
        ),
      }))}
      onChange={onTabChange}
      tabBarStyle={{
        marginBottom: 0,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    />

    // </div>
  );
};

export default UpperTab;
