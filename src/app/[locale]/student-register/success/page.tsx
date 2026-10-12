'use client';

import { Button, Card, Result } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

const StudentRegistrationSuccessPage: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleNewRegistration = () => {
    router.push('/student-register');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto px-3 md:px-12">
        <Card className="max-w-2xl mx-auto">
          <Result
            status="success"
            title={t(LOCALE_KEYS.REGISTRATION_SUCCESS_TITLE, {
              defaultValue: 'Registration Successful!',
            })}
            subTitle={t(LOCALE_KEYS.REGISTRATION_SUCCESS_MESSAGE, {
              defaultValue:
                'Your student registration has been submitted successfully. We will review your application and contact you soon.',
            })}
            extra={[
              <Button type="primary" key="home" size="large" onClick={handleGoHome}>
                {t(LOCALE_KEYS.GO_TO_HOME, { defaultValue: 'Go to Home' })}
              </Button>,
              <Button
                key="new"
                size="large"
                onClick={handleNewRegistration}
                style={{ marginLeft: 8 }}
              >
                {t(LOCALE_KEYS.NEW_REGISTRATION, { defaultValue: 'New Registration' })}
              </Button>,
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistrationSuccessPage;
