"use client"
import React from 'react';

const TodaysShedule = () => {
    return (
       <div className="rounded-lg border border-[#333333]/10  shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-5 w-5 text-[#FC4F00]"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    Today's Schedule
                                </h3>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#FC4F00]/10 bg-opacity-10 text-[#FC4F00] rounded p-2 text-center min-w-[50px]">
                                            <div className="text-xs">10:00</div>
                                            <div className="text-xs">AM</div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">CS 101: Introduction to Computer Science</h4>
                                            <p className="text-sm text-[#333333]/70">Tech Building, Room 301</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#FC4F00]/10 bg-opacity-10 text-[#FC4F00] rounded p-2 text-center min-w-[50px]">
                                            <div className="text-xs">1:00</div>
                                            <div className="text-xs">PM</div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Faculty Meeting</h4>
                                            <p className="text-sm text-[#333333]/70">Admin Building, Conference Room B</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#FC4F00]/10 bg-opacity-10 text-[#FC4F00] rounded p-2 text-center min-w-[50px]">
                                            <div className="text-xs">3:00</div>
                                            <div className="text-xs">PM</div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">CS 350: Machine Learning (Online)</h4>
                                            <p className="text-sm text-[#333333]/70">Zoom Meeting</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    );
};

export default TodaysShedule;