'use client';
import {Button, Card, Typography} from 'antd';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useAuth} from '@/hooks/useAuth';
import {useLocalization} from '@/hooks/useLocalization';
import {useRole} from '@/hooks/useRole';

const { Title, Text } = Typography;

const WelcomeSection = () => {
  const { getUserFullName } = useAuth();
  const role = useRole();
  const { t } = useLocalization();

  // Today’s date localized
  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`m-6 ${role === 'teacher' ? 'border-l-8 border-l-[#1F4BCA] rounded-2xl' : ''}`}>
      <Card
        className={`mx-10 ${role === 'teacher' ? 'border-l-4 border-l-[#1F4BCA]' : 'text-white'}`}
        style={{
          borderRadius: 16,
          background: role === 'teacher' ? 'white' : 'linear-gradient(to right, #3a80f5, #1F4BCA)',
          color: role === 'teacher' ? 'inherit' : '#fff',
        }}
        styles={{
          body: { padding: '24px' },
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <Title level={2} style={{ color: role === 'teacher' ? '#1f2937' : '#fff' }}>
              {t(LOCALE_KEYS.WELCOME_BACK, {
                defaultValue: 'Welcome back, {name}!',
                name: getUserFullName(),
              })}
            </Title>

            <Text style={{ color: role === 'teacher' ? '#1f2937' : '#fff' }}>
              {role === 'teacher'
                ? t(LOCALE_KEYS.TEACHER_DASHBOARD_SUBTITLE, {
                    defaultValue: '{date} | You have 3 classes today',
                    date: formattedDate,
                  })
                : t(LOCALE_KEYS.STUDENT_DASHBOARD_SUBTITLE, {
                    defaultValue: 'First Semester, Academic Year 2023-2024 | {date}',
                    date: formattedDate,
                  })}
            </Text>
          </div>

          {role === 'teacher' ? (
            <Button
              style={{
                backgroundColor: '#1F4BCA',
                color: '#fff',
              }}
            >
              {t(LOCALE_KEYS.VIEW_SCHEDULE, { defaultValue: 'View Schedule' })}
            </Button>
          ) : (
            <div className="text-right">
              <Title level={2} style={{ color: '#fff' }}>
                {today.getDate()}
              </Title>
              <Text style={{ color: '#fff' }}>
                {today.toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WelcomeSection;
