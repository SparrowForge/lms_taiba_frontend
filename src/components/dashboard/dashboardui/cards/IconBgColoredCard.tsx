import { Tag } from 'antd';
import React from 'react';

interface IconBgColoredCardProps {
  text: string;
  time?: string;
  color: string;
  bgColor: string;
  bgColorIcon: string;
  icon: React.ReactNode;
  tag?: string;
  due?: string;
  rounded?: string; // optional: 'sm', 'md', 'lg', 'xl', '2xl', 'full'
  textSize?: string;
  onClick?: () => void;
}

const IconBgColoredCard: React.FC<IconBgColoredCardProps> = ({
  text,
  time,
  color,
  bgColor,
  bgColorIcon,
  icon,
  tag,
  due,
  rounded,
  textSize,
  onClick,
}) => {
  const roundedClass = `rounded-${rounded}`;

  return (
    <div
      className={`py-2 px-3 flex gap-3 justify-center items-center rounded-md  `}
      style={{ backgroundColor: bgColor, color: color, border: `2px solid ${bgColorIcon}` }}
      onClick={onClick} 
    >
      {/* Icon Container */}
      <div
        className={`flex items-center justify-center w-9 h-10 ${roundedClass} `}
        style={{
          backgroundColor: bgColorIcon, // lighter background
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h1 className="text-[14px] text-black " style={{ fontSize: textSize }}>
            {text}
          </h1>
          {tag && (
            <Tag color={bgColorIcon} style={{ color: color }}>
              {tag}
            </Tag>
          )}
        </div>
        {time && <p className="text-xs text-gray-500">{time}</p>}
        {due && <p className="text-xs text-gray-500">Due: {due}</p>}
      </div>
    </div>
  );
};

export default IconBgColoredCard;
