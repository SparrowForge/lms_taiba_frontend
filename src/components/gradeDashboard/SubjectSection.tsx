import {Table} from 'antd';
import {useLocale} from 'next-intl';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

const dataSource = [
  {
    key: '1',
    subject: 'Mathematics',
    localSubject: 'الرياضيات',
    midterm: '89%',
    final: '94%',
    grade: '92%',
  },
  {
    key: '2',
    subject: 'Physics',
    localSubject: 'الفيزياء',
    midterm: '84%',
    final: '92%',
    grade: '88%',
  },
  {
    key: '3',
    subject: 'Chemistry',
    localSubject: 'الكيمياء',
    midterm: '95%',
    final: '95%',
    grade: '95%',
  },
];

const SubjectSection = () => {
  const { t } = useLocalization();
  const locale = useLocale();

  const columns = [
    {
      title: t(LOCALE_KEYS.SUBJECT),
      dataIndex: 'subject',
      key: 'subject',
      render: (_: any, record: { localSubject: any; subject: any }) =>
        locale === 'ar' ? record.localSubject : record.subject,
    },
    {
      title: t(LOCALE_KEYS.MIDTERM),
      dataIndex: 'midterm',
      key: 'midterm',
    },
    {
      title: t(LOCALE_KEYS.FINAL),
      dataIndex: 'final',
      key: 'final',
    },
    {
      title: t(LOCALE_KEYS.GRADE),
      dataIndex: 'grade',
      key: 'grade',
    },
  ];

  return (
    <div className="my-10">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default SubjectSection;
