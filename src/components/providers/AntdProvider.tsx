'use client';

// import {ConfigProvider,theme} from 'antd';
import {ConfigProvider} from 'antd';

interface AntdProviderProps {
  children: React.ReactNode;
}

export const AntdProvider = ({ children }: AntdProviderProps) => {
  return <ConfigProvider>{children}</ConfigProvider>;
};
// export const AntdProvider = ({ children }: AntdProviderProps) => {
//   return <ConfigProvider theme={{
//     algorithm: theme.darkAlgorithm,
//   }}>{children}</ConfigProvider>;
// };
