import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";

const SocialLogin = () => {
    return (
        <div className=" flex flex-col items-center">
            <div className="w-full flex items-center gap-2 mb-2">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-gray-500 text-sm">Or continue with | أو تابع باستخدام</span>
                <div className="flex-1 h-px bg-gray-300" />
            </div>

            <Button
                block
                size="large"
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-md shadow-sm"
                style={{ height: "48px" }}
            >
                <Image
                    src="/microsoft.png" // replace with your microsoft logo path
                    alt="Microsoft"
                    width={20}
                    height={20}
                />
                <span className="text-sm font-medium">
                    Sign in with Microsoft |  تسجيل <br />الدخول باستخدام مايكروسوفت
                </span>
            </Button>

            <div className="py-2 text-center">
                <h1>Don't have an account? | حساب؟ لديك ليس <br />
                    <Link
                        href="/register"
                        className="text-[#1e45bf] hover:text-blue-500 font-medium cursor-pointer"
                    >
                        <span className="text-[#1e45bf]">Contact administrator | اتصل بالمسؤول  </span>
                    </Link>
                </h1>
            </div>
        </div>
    );
};

export default SocialLogin;
