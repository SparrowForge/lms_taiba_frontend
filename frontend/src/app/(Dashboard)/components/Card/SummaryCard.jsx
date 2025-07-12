"use client";
import React from "react";

const SummaryCard = () => {
  const cardData = [
    {
      id: 1,
      title: "Active Courses",
      value: "5",
      subtitle: "+1 from last semester",
      icon: (
        <svg
          className="h-8 w-8 text-[#FC4F00]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Total Students",
      value: "142",
      subtitle: "+12 new enrollments",
      icon: (
        <svg
          className="h-8 w-8 text-[#FC4F00]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Hours This Week",
      value: "16",
      subtitle: "2 hours remaining",
      icon: (
        <svg
          className="h-8 w-8 text-[#FC4F00]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Upcoming Events",
      value: "3",
      subtitle: "Next: Department Meeting",
      icon: (
        <svg
          className="h-8 w-8 text-[#FC4F00]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cardData.map(({ id, title, value, subtitle, icon }) => (
        <div
          key={id}
          className="rounded-lg border border-[#FC4F00] shadow-sm overflow-hidden transition transform duration-300 hover:-translate-y-4"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#333333]/70 mb-1">
                  {title}
                </p>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-xs text-[#333333]/70 mt-1">{subtitle}</p>
              </div>
              <div className="mt-1">{icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCard;
