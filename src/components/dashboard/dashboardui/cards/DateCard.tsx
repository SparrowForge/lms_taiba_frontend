'use client';
import React from 'react';

interface DateCardProps {
  date: string;
  title: string;
  time: string;
  location: string;
  color: string;
}

const DateCard: React.FC<DateCardProps> = ({ dateTime, title , location, color }) => {



const dateObj = new Date(dateTime);

// Get readable date with month name
const date = dateObj.toLocaleDateString("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// Get exact time
const time = dateObj.toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false, // 24-hour format
});

console.log(date); // "November 10, 2025"
console.log(time); // "07:00:37"


  return (
    <div className="flex items-center gap-3 p-3 rounded-lg " style={{ backgroundColor: color }}>
      {/* Date box */}
      <div
        className="flex flex-col items-center justify-center w-34 h-14 rounded-md text-sm font-semibold p-4"
        style={{ backgroundColor: '#ffffff' }}
      >
        <span>{date}</span>
        {/* <span>{date}</span> */}
      </div>

      {/* Exam details */}
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{title}</span>
        <span className="text-gray-500 text-sm">
          {time} • {location}
        </span>
      </div>
    </div>
  );
};

export default DateCard;
