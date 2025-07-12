import React from 'react';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex  flex-col items-center justify-center px-4">
            <div className="flex justify-center mb-6">
                   <h1 className="text-4xl font-bold ">
                        <span className="text-[#FC4F00] ">A</span>cademic
                    </h1>
                </div>
            <div className="max-w-md w-full bg-white shadow-md rounded-md p-8">
                {/* Logo */}
                

                {/* Welcome Text */}
                <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
                    WELCOME BACK!
                </h2>

                {/* Form */}
                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="E-Mail"
                        className="w-full px-4 py-2 border border-orange rounded-md "
                    />
                    <input
                        type="password"
                        placeholder="********************"
                        className="w-full px-4 py-2 border border-orange rounded-md "
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange hover:bg-white text-white py-2 rounded-md font-semibold  hover:text-orange hover:border hover:border-[#FC4F00] "
                    >
                        LOGIN
                    </button>
                </form>

                {/* Footer Links */}
                <div className="flex justify-between mt-10 text-sm text-orange">
                    <a href="#" className="text-orange hover:underline font-medium">
                        Don’t have an account?
                    </a>
                    <a href="#" className="hover:underline">
                        Forgot Password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
