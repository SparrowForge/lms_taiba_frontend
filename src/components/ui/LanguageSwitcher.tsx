'use client';

import { GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import React, { useCallback, useMemo } from 'react';

import { routing } from '@/i18n/routing';

export const LanguageSwitcher: React.FC = React.memo(() => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = useCallback(
    (newLocale: string) => {
      // Remove the current locale from the pathname
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

      // Navigate to the new locale path
      const newPath = `/${newLocale}${pathWithoutLocale}`;
      router.push(newPath);
    },
    [locale, pathname, router],
  );

  // Memoize language items to prevent unnecessary re-renders
  const languageItems = useMemo(
    () =>
      routing.locales.map((loc: string) => ({
        key: loc,
        label: loc === 'en' ? 'English' : loc === 'ar' ? 'العربية' : loc.toUpperCase(),
        onClick: () => handleLanguageChange(loc),
      })),
    [handleLanguageChange],
  );

  // Memoize button style
  const buttonStyle = useMemo(
    () => ({
      border: 'none',
      boxShadow: 'none',
    }),
    [],
  );

  return (
    <Dropdown menu={{ items: languageItems }} placement="bottomRight" trigger={['click']}>
      <Button
        type="primary"
        icon={<GlobalOutlined />}
        className="flex items-center gap-2"
        style={buttonStyle}
      >
        {locale.toUpperCase()}
      </Button>
    </Dropdown>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';
