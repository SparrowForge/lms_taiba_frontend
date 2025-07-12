import React from "react";

const FeeSummaryCard = () => {
  const data = [
    {
      id: 1,
      title: "Total Active Fee Structures",
      number: "24",
      state: "↑ 12% from last month",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-wallet text-uni-orange"
        >
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Total Revenue from Fees",
      number: "₹1,45,72,000",
      state: "↑ 8% from last month",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-credit-card text-uni-orange"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Students with Payment Plans",
      number: "1,245",
      state: "↑ 5% from last month",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-users text-uni-orange"
        >
          <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
          <circle cx="12" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M2 21v-2a4 4 0 0 1 3-3.87" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {data.map((item) => (
        <div key={item.id} className="hover:-translate-y-1 transition-transform duration-300 flex items-start bg-[#ffffffb2] shadow-xl border-l-[6px] border-[#FC4F00] py-6 rounded-lg ">
          <div className="flex-1 px-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {item.title}
            </h3>
            <div className="text-2xl font-bold mt-1">{item.number}</div>
            <div className="flex items-center mt-1">
              <span className="text-green-500 mb-1">{item.state.split(" ")[0]}</span>
              <span className="text-green-500 ml-1  ">{item.state.split(" ")[1]}</span>
              <span className="text-[#333333]/70 ml-1">
                {item.state.split(" ").slice(2).join(" ")}
              </span>
            </div>
          </div>
          <div className="rounded-full bg-[#FC4F00]/10 p-2 mr-10 text-[#FC4F00]">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default FeeSummaryCard;
