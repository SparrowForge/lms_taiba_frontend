'use client';

import { Card, Tabs } from 'antd';
import { useRouter } from 'next/navigation';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import RetakeExams from '@/components/exams/RetakeExams';
import { MainLayout } from '@/components/layout/MainLayout';
import GradeEntry from '@/components/result/GradeEntry';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';

const ResultCreatePage = () => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.GRADING, { defaultValue: 'Grading' });
  const router = useRouter();

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.ADD_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <Card className="pl-4">
          <Tabs
            defaultActiveKey="grade"
            items={[
              {
                key: 'grade',
                label: 'Grade Entry',
                children: <GradeEntry />,
              },
              {
                key: 'retake',
                label: 'Retake Exam',
                children: <RetakeExams />,
              },
            ]}
          />
        </Card>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ResultCreatePage;
