"use client"
import React from 'react';
import SummaryCard from '../components/Card/SummaryCard';
import Announcement from '../components/Announcement';
import TodaysShedule from '../components/TodaysShedule';

const Dashboard = () => {
    return (
        <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, Dr. Johnson</h1>
                        <p className="text-[#333333]/70">Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center bg-white rounded-md border border-[#333333]/10 p-2 gap-2 mt-4 md:mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="lucide lucide-calendar h-4 w-4 text-[#FC4F00]">
                            <path d="M8 2v4"></path><path d="M16 2v4">
                            </path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                        <span>Tuesday, May 13, 2025</span>
                    </div>
                </div>

                <SummaryCard />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Announcement />
                    </div>
                    <div>
                        <TodaysShedule />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
