import { Card } from 'antd';
import { useLocale } from 'next-intl';
import React from 'react';

interface LeftBorderCardProps {
  title?: string;
  subTitle?: string;
  localTitle: string;
  number: string;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
}

const LeftBorderCard: React.FC<LeftBorderCardProps> = ({
  title,
  subTitle,
  localTitle,
  number,
  icon,
  color,
  iconColor,
}) => {
  const locale = useLocale();
  return (
    <Card
      style={{
        borderLeft: `8px solid ${color}`,
        backgroundColor: '',
        borderRadius: '12px',
        padding: '0px',
      }}
    >
      <div className="flex items-center justify-between gap-2 ">
        <div className="w-[80%]">
          {/* Show localized title if Arabic, otherwise normal title */}
          {locale === 'ar' ? (
            <h3 className="font-normal text-[16px] text-gray-500">{localTitle}</h3>
          ) : (
            <h3 className="font-normal text-[14px] text-gray-500">{title}</h3>
          )}

          <div className="text-3xl font-bold">{number}</div>

          {/* ✅ Only render subtitle if provided */}
          {subTitle && <p style={{ color: iconColor }}>{subTitle}</p>}
        </div>

        <div
          className="w-[20%]"
          style={{
            color: iconColor,
            fontSize: '20px',
            backgroundColor: `${color}20`,
            padding: '5px 10px',
            borderRadius: '8px',
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default LeftBorderCard;
