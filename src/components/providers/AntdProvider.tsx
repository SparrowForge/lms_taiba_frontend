'use client';

import { ConfigProvider } from 'antd';

interface AntdProviderProps {
  children: React.ReactNode;
}

export const AntdProvider = ({ children }: AntdProviderProps) => {
  return <ConfigProvider>{children}</ConfigProvider>;
};
