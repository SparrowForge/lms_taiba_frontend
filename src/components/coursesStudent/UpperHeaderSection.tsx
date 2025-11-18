'use client';

import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import MyCourcesCard from './MyCourcesCard';
import MyCourcesList from './MyCourcesList';

const UpperHeaderSection = () => {
  const { t } = useLocalization();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      {/* Header with Toggle */}
      <div className="flex justify-between items-center mb-6">
        {/* Title */}
        <h2 className="text-xl font-bold">{t(LOCALE_KEYS.My_SUBJECT)}</h2>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md ${
              view === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <AppstoreOutlined />
            {t(LOCALE_KEYS.GRID_VIEW)}
          </button>

          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm tex rounded-md ${
              view === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarsOutlined />
            {t(LOCALE_KEYS.LIST_VIEW)}
          </button>
        </div>
      </div>

      {/* Render view */}
      {view === 'grid' ? <MyCourcesCard /> : <MyCourcesList />}
    </div>
  );
};

export default UpperHeaderSection;
