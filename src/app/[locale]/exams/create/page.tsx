'use client';

import { Button, Steps } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamCandidateFacultyBulkForm from '@/components/examCandidates/ExamCandidateFacultyBulkForm';
import ExamFormFaculty from '@/components/exams/ExamFormFaculty';
import ExamScheduleFacultyForm from '@/components/examSchedules/ExamScheduleFacultyForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';

export default function CreateExamPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });
  const [response, setResponse] = useState({})
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Create Exam",
        content: 
        <ExamFormFaculty 
          setCurrent={setCurrent} 
          setResponse={setResponse} 
          current={current}
          mode='create' />
    },
    {
      title: "Exam Schedule",
      content: <ExamScheduleFacultyForm 
          setCurrent={setCurrent} 
          current={current} 
          response={response}
          mode='create' />
    },
    {
      title: "Exam Candidates",
      content: <ExamCandidateFacultyBulkForm response={response} />
    }
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <div style={{ width: '100%', maxWidth: 1000, margin: "auto", marginTop: 16, padding: '0 8px' }}>
          <Steps
            current={current}
            onChange={(value) => setCurrent(value)}
            items={steps.map((item) => ({ key: item.title, title: item.title }))}
          />
        </div>
            <div style={{ marginTop: 24 }}>
              {steps[current].content}
            </div>

            <div style={{ marginTop: 24 }}>
              {current > 0 && (
                <Button type='primary' onClick={() => setCurrent(current - 1)}>Previous</Button>
              )}

              {current < steps.length - 1 && (
                <Button
                  type="primary"
                  style={{ marginLeft: 8 }}
                  onClick={() => setCurrent(current + 1)}
                >
                  Next
                </Button>
              )}
    
          </div>    
        {/* <ExamForm mode="create" /> */}
        {/* <ExamFormFaculty mode="create"/> */}
      </MainLayout>
    </ProtectedRoute>
  );
}
