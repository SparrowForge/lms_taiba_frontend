import React from 'react';

interface UpBorderCardProps {
  title: string;
  subTitle: string;
  number: number;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
}

const UpBorderCard: React.FC<UpBorderCardProps> = ({
  title,
  subTitle,
  number,
  icon,
  color,
  iconColor,
}) => {
  return (
    <div
      className="rounded-2xl p-3 md:p-6 shadow-md hover:-translate-y-1 transition-transform duration-300"
      style={{ borderTop: `8px solid ${color}` }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h3 className="font-snormal text-[16px] text-gray-500">{title}</h3>
          <div className="text-3xl font-bold">{number}</div>
          <p className="text-gray-500">{subTitle}</p>
        </div>
        <div
          style={{
            color: iconColor,
            fontSize: '30px',
            backgroundColor: `${color}20`,
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default UpBorderCard;
