"use client"
import React from 'react';

const Announcement = () => {
    return (
        <div className="rounded-lg border border-[#333333]/10  shadow-sm">
                            <div className="space-y-1.5 py-6 px-2  md:p-6 flex  items-start mditems-center justify-between pb-2">
                                <h3 className="tracking-tight text-xl font-bold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        className="lucide lucide-bell h-5 w-5 text-[#FC4F00]">
                                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                                    </svg>Announcements
                                </h3>
                                <div className="inline-flex items-center rounded-full border border-[#333333]/10 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2  text-primary-foreground hover:bg-[#FC4F00]/90 bg-[#FC4F00] text-white">2 New
                                </div>
                            </div>
                            <div className="p-6 pt-0 space-y-4">
                                <div className="border-l-4 border-[#FC4F00] pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold">End of Semester Grading Deadline</h4>
                                        <div className="inline-flex items-center rounded-full border border-[#333333]/10 px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">Administrative</div>
                                    </div>
                                    <p className="text-sm text-[#333333]/70 mt-1">All final grades must be submitted by May 30th. Please ensure all assessments are completed and recorded in the system.</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-[#333333]/70">5/15/2025</span>
                                        <div className="inline-flex items-center rounded-full border border-[#333333]/10 px-2.5 py-0.5  transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2  hover:bg-[#FC4F00]/90  bg-yellow-500 text-xs bg-brand-yellow text-brand-charcoal">New</div>
                                    </div>
                                </div>
                                <div className="border-l-4 border-[#FC4F00] pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold">Faculty Development Workshop</h4>
                                        <div className="inline-flex items-center rounded-full border border-[#333333]/10 px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">Workshop</div>
                                    </div>
                                    <p className="text-sm text-[#333333]/70 mt-1">Join us for a workshop on 'Effective Online Teaching Methods' on June 5th at 10:00 AM in the Faculty Lounge.</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-[#333333]/70">5/12/2025</span>
                                        <div className="inline-flex items-center rounded-full border border-[#333333]/10 px-2.5 py-0.5  transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2  hover:bg-[#FC4F00]/90  bg-yellow-500 text-xs bg-brand-yellow text-brand-charcoal">New</div>
                                    </div>
                                </div>
                                <div className="border-l-4 border-gray-200 pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold">New Syllabus Guidelines</h4>
                                        <div className="inline-flex items-center rounded-full border border-[#333333]/10 px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">Academic</div>
                                    </div>
                                    <p className="text-sm text-[#333333]/70 mt-1">Updated syllabus templates are now available. All course syllabi should follow the new format starting next semester.</p>
                                    <div className="flex justify-between items-center mt-2"><span className="text-xs text-[#333333]/70">5/5/2025</span>
                                    </div>
                                </div>
                                <div className="border-l-4 border-gray-200 pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold">IT System Maintenance</h4>
                                        <div className="inline-flex items-center rounded-full border border-[#333333]/10 px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">IT</div>
                                    </div>
                                    <p className="text-sm text-[#333333]/70 mt-1">The campus portal will be under maintenance on May 20th from 10 PM to 2 AM. Please save your work accordingly.</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-[#333333]/70">4/28/2025</span>
                                    </div>
                                </div>
                                <button className="w-full text-sm text-[#FC4F00] hover:text-[#FC4F00] hover:underline font-medium mt-2">View All Announcements</button>
                            </div>
                        </div>
    );
};

export default Announcement;