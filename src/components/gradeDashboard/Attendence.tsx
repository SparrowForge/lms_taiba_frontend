import {Card} from 'antd';
import React from 'react';

import {LOCALE_KEYS, t} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

const Attendence = () => {
  const { t } = useLocalization();
  return (
    <Card className=" shadow rounded-lg p-4">
      <h3 className="font-bold text-xl mb-3">{t(LOCALE_KEYS.ATTENDANCE)}</h3>
      <div className="flex justify-between items-center mt-2 mb-2 text-[16px]">
        <span>{t(LOCALE_KEYS.THIS_MONTH)}</span>
        <span className="font-bold text-green-600">95%</span>
      </div>
      <div className="flex justify-between gap-2 text-[16px] mb-2">
        <span className="text-green-600">● {t(LOCALE_KEYS.PRESENT)}</span>
        <span className="text-red-500">● {t(LOCALE_KEYS.ABSENT)}</span>
        <span className="text-sky-500">● {t(LOCALE_KEYS.LATE)}</span>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
            <div key={i} className="text-gray-500">
              {d}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5, 6, 7].map((day, i) => (
            <div
              key={i}
              className={`py-2 px-3 rounded-full ${
                day === 1 || day === 2 || day === 3
                  ? 'bg-green-100 text-green-700'
                  : day === 4
                    ? 'bg-red-100 text-red-700'
                    : day === 5
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-500'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Attendence;
