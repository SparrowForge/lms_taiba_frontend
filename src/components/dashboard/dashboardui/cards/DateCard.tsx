'use client';
import React from 'react';

interface DateCardProps {
  date: string;
  title: string;
  time: string;
  location: string;
  color: string;
}

const DateCard: React.FC<DateCardProps> = ({ date, title, time, location, color }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg "  style={{ backgroundColor: color }}>
      {/* Date box */}
      <div
        className="flex flex-col items-center justify-center w-14 h-14 rounded-md text-sm font-semibold p-4"
        style={{ backgroundColor: "#ffffff" }}
      >
        <span>{date.split(' ')[0]}</span>
        <span>{date.split(' ')[1]}</span>
      </div>

      {/* Exam details */}
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{title}</span>
        <span className="text-gray-500 text-sm">{time} • {location}</span>
      </div>
    </div>
  );
};

export default DateCard;
