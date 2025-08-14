import '@ant-design/v5-patch-for-react-19';
// eslint-disable-next-line import/order
import type {Metadata} from 'next';

// eslint-disable-next-line import/order
import {Geist, Geist_Mono} from 'next/font/google';

import './globals.css';
import 'antd/dist/reset.css';
import {dir} from 'i18next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

import {routing} from '@/i18n/routing';

import {AuthInitializer} from '@/components/auth/AuthInitializer';
import {SidebarProvider} from '@/components/layout/SidebarContext';
import {AntdProvider} from '@/components/providers/AntdProvider';
import {ReduxProvider} from '@/components/providers/ReduxProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LMS Taiba Admin Panel',
  description: 'Learning Management System Admin Panel',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  let messages;
  try {
    messages = await getMessages();
  } catch (error: unknown) {
    console.log(error);
    notFound();
  }

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <AntdProvider>
            <AuthInitializer>
              <SidebarProvider>
                <NextIntlClientProvider locale={locale} messages={messages}>
                  {children}
                </NextIntlClientProvider>
              </SidebarProvider>
            </AuthInitializer>
          </AntdProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
