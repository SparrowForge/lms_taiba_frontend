"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
// Navigation items and SVG icons
const navItems = [
    {
        label: "Dashboard",
        href: "/",
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
        ),
        submenu: [
            { label: "Overview", href: "/Dashboard/overview" },
            { label: "Stats", href: "/Dashboard/stats" }
        ]
    },
    {
        label: "Profile",
        href: "/Profile",
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        submenu: [
            { label: "Edit Profile", href: "/Profile/edit" },
            { label: "Account Settings", href: "/Profile/settings" }
        ]
    },
    {
        label: "Courses",
        href: "/Courses",
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
            </svg>
        ),
        submenu: [
            { label: "My Courses", href: "/Courses/my-courses" },
            { label: "Enroll", href: "/Courses/enroll" }
        ]
    },
    {
        label: "Assignments",
        href: "/Assignments",
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="8" height="4" x="8" y="2" rx="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="m9 14 2 2 4-4" />
            </svg>
        ),
        submenu: [
            { label: "Upcoming", href: "/Assignments/upcoming" },
            { label: "Submitted", href: "/Assignments/submitted" }
        ]
    },
    {
        label: "Exams",
        href: "/Exams",
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8M16 13H8M16 17H8" />
            </svg>
        ),
        submenu: [
            { label: "Schedule", href: "/Exams/schedule" },
            { label: "Results", href: "/Exams/results" }
        ]
    },
    {
        label: "Attendance",
        href: "/Attendance",
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 2v4M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
            </svg>
        ),
        submenu: [
            { label: "Daily Report", href: "/Attendance/daily" },
            { label: "Monthly Summary", href: "/Attendance/monthly" }
        ]
    },
    {
        label: "Fees",
        href: "/Fees",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-book-open">
                <path d="M12 7v14"></path>
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
            </svg>
        ),
        submenu: [
            { label: "Pay Fees", href: "/Fees/pay" },
            { label: "History", href: "/Fees/history" }
        ]
    },
    {
        label: "Results",
        href: "/Results",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-users">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        ),
        submenu: [
            { label: "Latest", href: "/Results/latest" },
            { label: "Download", href: "/Results/download" }
        ]
    },
    {
        label: "Leave Requests",
        href: "/LeaveRequests",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-calendar">
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path></svg>
        ),
        submenu: [
            { label: "Apply Leave", href: "/LeaveRequests/apply" },
            { label: "History", href: "/LeaveRequests/history" }
        ]
    },
    {
        label: "Notifications",
        href: "/Notifications",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
        ),
        submenu: [
            { label: "All", href: "/Notifications/all" },
            { label: "Settings", href: "/Notifications/settings" }
        ]
    },
    {
        label: "Help & Support",
        href: "/Help&Support",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
        ),
        submenu: [
            { label: "FAQ", href: "/Help&Support/faq" },
            { label: "Contact", href: "/Help&Support/contact" }
        ]
    }

];

const DashboardSidebar = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(true);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const toggleSidebar = () => setOpen(!open);
    const toggleSubmenu = (label) => {
        setOpenSubmenu((prev) => (prev === label ? null : label));
    };

    const sidebarWidth = open ? "md:w-64" : "md:w-20";
    return (

           <div
    className={`bg-[#1f1e1e] text-[#FFFFFFB2] min-h-screen flex flex-col transition-all border-r border-[#333333] w-20 ${sidebarWidth}`}
  >
   
            {/* Header */}
            <div className="hidden md:flex items-center justify-between h-20 px-4 border-b border-[#333333]">
                {open && (
                    <h1 className="text-xl font-bold text-white">
                        <span className="text-[#FC4F00]">A</span>cademic
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    className={`text-white hover:text-[#FFFFFFB2] h-11 w-11 flex items-center justify-center ${open ? "pl-6" : "pl-0"}`}
                >
                    <svg width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <line x1="4" x2="20" y1="12" y2="12" />
                        <line x1="4" x2="20" y1="6" y2="6" />
                        <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                </button>
            </div>
            <div className="flex md:hidden items-center justify-between h-16  px-2 border-b border-[#333333]">
             
                    <h1 className="text-sm font-semibold text-white">
                        <span className="text-[#FC4F00]">A</span>cademic
                    </h1>
             
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
                <ul className="p-2 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                        const isSubmenuOpen = openSubmenu === item.label;

                        return (
                            <li key={item.label}>
                                <div className={`flex justify-between items-center gap-1 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-[#333333] text-white" : "hover:bg-[#333333] hover:text-white"
                                    }`}>
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center ${open ? "gap-3" :"gap-0 md:gap-1" }`}
                                    
                                    >
                                        <h1 title={item.label}>{item.icon}</h1>
                                        <div className="hidden md:flex">
                                            {open && <span>{item.label}</span>}
                                        </div>
                                    </Link>

                                    {item.submenu && (
                                        <button onClick={() => toggleSubmenu(item.label)} className="text-white text-[10px]">
                                            {isSubmenuOpen ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    )}
                                </div>

                                {/* Submenu */}
                                {isSubmenuOpen && item.submenu && (
                                    <ul className="pl-2 space-y-1 mt-2">
                                        {item.submenu.map((subItem) => {
                                            const isActiveSubmenu = pathname === subItem.href || pathname.startsWith(subItem.href + "/");
                                            return (
                                                <li key={subItem.label}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`flex items-center gap-1 px-3 py-2 text-[13px] rounded-md transition-colors ${isActiveSubmenu ? "bg-[#333333] text-white" : "hover:bg-[#333333] hover:text-white"
                                                            }`}
                                                    >
                                                       <GoDotFill title={subItem.label}/>
                                                       <div className="hidden md:flex">
                                                        {open && <span>{subItem.label}</span>}
                                                       </div>
                                                        
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
           

            {/* Logout Button */}
            <div className="px-2 py-4 border-t border-[#333333]">
                <button className="w-full flex items-center gap-1 px-3 py-2 rounded-md hover:bg-[#333333] hover:text-white">
                    <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                   <div className="hidden md:flex">
                     {open && <span>Logout</span>}
                   </div>
                </button>
            </div>
        </div>
        
  

    );
};

export default DashboardSidebar;
