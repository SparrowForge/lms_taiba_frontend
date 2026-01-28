import { Button, Card, Progress } from 'antd';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useAuth } from '@/hooks/useAuth';
import { useLocalization } from '@/hooks/useLocalization';
import { useSubjects } from '@/hooks/useSubjects';



const AcademicProgress = () => {
  const { t } = useLocalization();
  const locale = useLocale();
  const { loadSubjects, subjects
  } = useSubjects()
  const { user } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (user?.student?.courseId) {
      loadSubjects({ courseId: user?.student?.courseId });
    }
  }, [loadSubjects, user?.student?.courseId]);
  const handleViewAll = () => {
    return router.push("/dashboard/course")
  }

  return (
    <Card className="rounded-2xl shadow-sm min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{t(LOCALE_KEYS.ACADEMIC_PROGRESS)}</h2>
        <Button onClick={() => handleViewAll()} type="text" style={{ padding: 0 }}>
          <span className="text-blue-600 cursor-pointer">{t(LOCALE_KEYS.VIEW_ALL)}</span>
        </Button>
      </div>

      {/* Subjects */}
      {subjects.map((sub, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <h1>{locale === 'ar' ? sub.name : sub.name}</h1>
            {/* <p>{sub.percent}%</p> */}
          </div>
          <Progress percent={sub.percent} showInfo={false} strokeColor="#1F4BCA" />
        </div>
      ))}
    </Card>
  );
};

export default AcademicProgress;
