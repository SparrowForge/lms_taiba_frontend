import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

const SocialLogin = () => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center">
      {/* Divider */}
      <div className="w-full flex items-center gap-2 mb-2">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-gray-500 text-sm">{t(LOCALE_KEYS.OR_CONTINUE_WITH)}</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Microsoft login */}
      <Button
        block
        size="small"
        className="flex items-center justify-center gap-2 border border-gray-300 rounded-md shadow-sm"
        style={{ height: '36px' }}
      >
        <Image src="/microsoft.png" alt="Microsoft" width={16} height={16} />
        <span className="text-sm font-medium">{t(LOCALE_KEYS.SIGN_IN_MICROSOFT)}</span>
      </Button>

      {/* Register prompt */}
      <div className="py-2 text-center">
        <h1>
          {t(LOCALE_KEYS.NO_ACCOUNT)}
          <Link
            href="/register"
            className="text-[#1e45bf] hover:text-blue-500 font-medium cursor-pointer"
          >
            <span className="text-[#1e45bf]">{t(LOCALE_KEYS.CONTACT_ADMIN)}</span>
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default SocialLogin;
