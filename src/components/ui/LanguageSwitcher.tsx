'use client'

import React from 'react';
import {Button, Dropdown} from 'antd';
import {GlobalOutlined} from '@ant-design/icons';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import {routing} from '@/i18n/routing';

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  // No namespace needed for flat structure

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // Navigate to the new locale path
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  const languageItems = routing.locales.map((loc: string) => ({
    key: loc,
    label: loc === 'en' ? 'English' : loc === 'ar' ? 'العربية' : loc.toUpperCase(),
    onClick: () => handleLanguageChange(loc),
  }));

  return (
    <Dropdown
      menu={{ items: languageItems }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        className="flex items-center gap-2"
        style={{
          border: 'none',
          boxShadow: 'none',
        }}
      >
        {locale.toUpperCase()}
      </Button>
    </Dropdown>
  );
};
