import {ExclamationOutlined} from '@ant-design/icons';
import {Button, Card} from 'antd';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

const HeaderSection = () => {
  const { t } = useLocalization();
  return (
    <Card
      style={{
        borderLeft: `8px solid #fb2c36`,
        backgroundColor: '#ffe2e2',
        borderRadius: '12px',
        padding: '0px',
        marginBottom: '10px',
      }}
    >
      <div className=" flex justify-between items-center">
        <div className="flex justify-between items-center gap-10">
          <ExclamationOutlined
            className="text-3xl p-2 rounded-full"
            style={{ backgroundColor: '#fb2c36', color: '#ffffff', margin: '0px 10px' }}
          />
          <div className="ml-20">
            <h2 className="text-lg font-bold text-red-600">
              {t(LOCALE_KEYS.PAYMENT_DUE)} : September Tuition
            </h2>
            <p className="text-sm text-gray-600">{t(LOCALE_KEYS.DUE_DATE)}: October 30, 2025</p>
          </div>
        </div>
        <Button
          style={{
            backgroundColor: '#fb2c36',
            color: '#ffffff',
            padding: '20px',
            fontSize: '16px',
          }}
        >
          {t(LOCALE_KEYS.PAY_NOW)}
        </Button>
      </div>
    </Card>
  );
};

export default HeaderSection;
