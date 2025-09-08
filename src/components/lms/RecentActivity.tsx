import {CodeOutlined, FileTextOutlined, MessageOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Card} from 'antd';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

import IconBgColoredCard from '../dashboard/dashboardui/cards/IconBgColoredCard';


const recentActive = [
  {
    title: 'Ahmed S. submitted the assignment',
    due: '10 minutes ago',
    bgColorIcon: '#fee2e2',
    icon: <UserOutlined style={{ color: '#ef4444' }} />,
  },
  {
    title: 'Noura A. posted in the discussion',
    due: '43 minutes ago',
    bgColorIcon: '#fef3c7',
    icon: <MessageOutlined style={{ color: '#f59e0b' }} />,
  },
  {
    title: 'Computer Science Project',
    due: 'Aug 30, 2023',
    bgColorIcon: '#dbeafe',
    icon: <CodeOutlined style={{ color: '#5190f7' }} />,
  },
  {
    title: 'English Essay',
    due: 'Sep 2, 2023',
    bgColorIcon: '#d1fae5',
    icon: <FileTextOutlined style={{ color: '#10b981' }} />,
  },
];

const RecentActivity = () => {
  const { t } = useLocalization();

  return (
    <Card className="rounded-2xl shadow-sm ">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold flex gap-2 items-center">
          {t(LOCALE_KEYS.RECENT_ACTIVITY)}
        </h2>

        <Button type="text" style={{ padding: 0 }}>
          <span className="text-blue-600 cursor-pointer">{t(LOCALE_KEYS.ALLOW_VIEW)}</span>
        </Button>
      </div>

      {/* Scrollable List */}
      <div
        className="flex flex-col gap-3 overflow-y-auto"
        style={{ maxHeight: '225px' }} // around 2 items height
      >
        {recentActive.map((a, i) => (
          <IconBgColoredCard
            key={i}
            text={a.title}
            due={a.due}
            bgColorIcon={a.bgColorIcon}
            icon={a.icon}
            rounded="full"
            color=""
            bgColor=""
          />
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
