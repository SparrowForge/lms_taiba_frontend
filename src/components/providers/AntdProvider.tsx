'use client';

import { ConfigProvider, theme } from 'antd';

import { useSettings } from '@/hooks/useSettings';

interface AntdProviderProps {
  children: React.ReactNode;
}

export const AntdProvider = ({ children }: AntdProviderProps) => {
  const { themeMode } = useSettings();
  return (
    <ConfigProvider
      theme={{ algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      {children}
    </ConfigProvider>
  );
};
