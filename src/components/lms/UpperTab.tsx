'use client';

import { Tabs } from 'antd';

export type UpperTabItem = {
  key: string;
  title: string;
};

const UpperTab: React.FC<{ onTabChange: (key: string) => void; items: UpperTabItem[], initial:string | null }> = ({
  onTabChange,
  items,
  initial
}) => {

  return (
    <Tabs
      size="large"
      className="uppertab full-width-tabs"
      defaultActiveKey={initial ?? undefined}
      items={items.map((item) => ({
        key: item.key,
        label: (
          <div className="w-full text-center text-lg font-semibold">
            {item.title}
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
