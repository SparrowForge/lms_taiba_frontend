'use client';

import { Tabs } from 'antd';
import { useLocale } from 'next-intl';

type TabItem = {
  key: string;
  title: string;
  localeTitle: string;
  initial:string
};

const UpperTab: React.FC<{ onTabChange: (key: string) => void; items: TabItem[] }> = ({
  onTabChange,
  items,
  initial
}) => {
  const locale = useLocale();

  return (
    <Tabs
      size="large"
      className="uppertab full-width-tabs"
      defaultActiveKey={initial}
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
  );
};

export default UpperTab;
