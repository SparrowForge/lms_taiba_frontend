"use client";

const DashboardNavbar = () => {
    return (
        <div className="h-16 md:h-20 px-6 border-b border-[#333333]/10 flex items-center justify-between w-full">

            <div className="flex-1 md:flex-initial">
                <h1 className="text-sm md:text-xl font-bold leading-2 text-black">Dashboard</h1>
            </div>
            <div className="hidden md:flex flex-1 mx-6">
                <div className="relative w-full max-w-md">
                    {/* Search Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#333333]/80"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>

                    {/* Search Input */}
                    <input
                        className="flex h-10 rounded-md border border-none px-3 ring-offset-background file:border-0 file:bg-transparent file:text-xl file:font-medium file:text-foreground placeholder:text-[#333333]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC4F00] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-lg pl-10 bg-[#F5F5F580] w-full transition-all duration-200  focus:border-[#FC4F00]"
                        placeholder="Search..."
                    />
                </div>
            </div>

{/* language  */}
            <div className="flex items-center md:gap-4 ">
                <button className=" inline-flex items-center justify-center gap-2 whitespace-nowrap hover:bg-[#FC4F00] hover:text-white rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-5 [&amp;_svg]:shrink-0 h-10 w-10"
                    title="Change language"
                    type="button"
                    id="radix-:r6:"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    data-state="closed">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-languages h-6 w-6">
                        <path d="m5 8 6 6"></path>
                        <path d="m4 14 6-6 2-3"></path>
                        <path d="M2 5h12"></path>
                        <path d="M7 2h1"></path>
                        <path d="m22 22-5-10-5 10"></path>
                        <path d="M14 18h6"></path>
                    </svg>

                </button>
                {/* bell  */}
                <button className="inline-flex items-center justify-center gap-2  rounded-md hover:bg-[#FC4F00] hover:text-white  [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0  h-10 w-10 relative"
                    type="button"
                    id="radix-:r8:"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    data-state="closed">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-bell h-5 w-5">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                    </svg>
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#FC4F00] "></span>
                </button>
                {/* user icon  */}
                <button className="flex h-8 md:h-11 w-8 md:w-11 items-center justify-center rounded-full bg-[#FC4F00] text-white">
                    <span className="">JS</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardNavbar;