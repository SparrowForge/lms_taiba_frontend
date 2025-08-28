import Link from "next/link";

import { LoginForm } from "./LoginForm";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";


const RightComponent = () => {
  const {t} = useLocalization();
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-around items-center px-6  pt-4 pb-2">
        <h1 className="text-black text-center" >
         {t(LOCALE_KEYS.WELCOME_BACK)}
        </h1>
        <div className="border rounded-md">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Center Form */}
      <div className="flex flex-1 justify-center items-center">
        <LoginForm />
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-gray-500 text-[12px] " >
        <p>
           {t(LOCALE_KEYS.COPYRIGHT)}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/privacy" className="hover:text-blue-600">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-blue-600">
            Terms of Service
          </Link>
          <span>|</span>
          <Link href="/help" className="hover:text-blue-600">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RightComponent;
