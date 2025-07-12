import React from 'react';

const eventsData = [
  {
    date: { month: 'May', day: '02' },
    title: 'Programming Assignment Submission',
    time: '11:59 PM',
    type: 'Assignment',
    badgeColor: 'blue',
  },
  {
    date: { month: 'May', day: '05' },
    title: 'Mathematics Mid-term Exam',
    time: '10:00 AM - 12:00 PM',
    type: 'Exam',
    badgeColor: 'orange',
  },
  {
    date: { month: 'May', day: '07' },
    title: 'Psychology Live Lecture',
    time: '11:30 AM - 1:00 PM',
    type: 'Class',
    badgeColor: 'green',
  },
];

const badgeStyles = {
  blue: 'bg-blue-50 text-blue-500 border-blue-200',
  orange: 'bg-orange-50 text-orangeCustom-500 border-orange-200',
  green: 'bg-green-50 text-green-500 border-green-200',
};

const UpComingEvents = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upcoming Events</h3>
      <div className="rounded-lg border border-[#333333]/10 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-lg flex items-center gap-2">
            <svg className="h-6 w-6 text-[#FC4F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
            Upcoming Events
          </h3>
        </div>

        <div className="p-6 pt-0 space-y-5 max-h-80 overflow-y-auto">
          {eventsData.map((event, index) => (
            <div key={index} className="flex gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="h-12 w-12 rounded-lg bg-[#333333]/10 flex flex-col items-center justify-center">
                <span className="text-xs text-[#333333]/80">{event.date.month}</span>
                <span className="font-bold">{event.date.day}</span>
              </div>

              <div className="space-y-1 w-full">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[event.badgeColor]}`}>
                    {event.type}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpComingEvents;
