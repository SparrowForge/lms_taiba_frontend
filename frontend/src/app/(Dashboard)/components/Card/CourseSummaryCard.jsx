"use client";
import React from 'react';

const CourseSummaryCard = () => {
  const cardData = [
    {
      id: 1,
      title: "Current Courses",
      value: "5",
      buttonLabel: "View Courses",
      status: null,
      icon: (
        <svg className="h-6 w-6 text-[#FC4F00] " fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Attendance Rate",
      value: "95%",
      status: {
        text: "Good Standing",
        className: "bg-green-500/10 text-green-500"
      },
      icon: (
        <svg className="h-6 w-6 text-[#FC4F00] " fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Assignments Due",
      value: "3",
      status: {
        text: "Due Soon",
        className: "bg-orange-500/10 text-orangeCustom-500"
      },
      buttonLabel: "View Courses",
      icon: (
        <svg className="h-6 w-6 text-[#FC4F00] " fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Next Exam",
      value: "5 May",
      status: {
        text: "In 6 Days",
        className: "bg-muted text-muted-foreground"
      },
      buttonLabel: "View Courses",
      icon: (
        <svg className="h-6 w-6 text-[#FC4F00] " fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map(({ id, title, value, status, icon, buttonLabel }) => (
        <div
          key={id}
          className="rounded-lg border border-[#333333]/30 bg-[#ffffff] shadow-orange-50 shadow-sm overflow-hidden transition transform duration-300 hover:-translate-y-4"
        >
          <div className="p-6">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#333333]/70">{title}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
                {status && (
                  <div
                    className={`text-xs px-2 py-1 rounded-full w-fit ${status.className}`}
                  >
                    {status.text}
                  </div>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-[#333333]/5 p-3 flex items-center justify-center">
                {icon}
              </div>
            </div>
          </div>
          {buttonLabel && (
            <button className="inline-flex items-center justify-center w-full h-10 border-t border-[#333333]/30 px-4 py-2 text-sm font-medium">
              {buttonLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseSummaryCard;
