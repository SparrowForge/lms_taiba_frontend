'use client';

import {Layout} from 'antd';
import {usePathname} from 'next/navigation';
import {useCallback, useMemo} from 'react';

import {Sidebar2} from './Sidebar2';
import {useSidebar} from './SidebarContext';
import ErrorBoundary from '../error/ErrorBoundary';
import {LanguageSwitcher} from '../ui/LanguageSwitcher';

const { Header, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { collapsed, setCollapsed, openKeys, selectedKeys, setSelectedKeys, scrollTop, setScrollTop, isClient, handleOpenChange } = useSidebar();
  const pathname = usePathname();

  // Memoize sidebar width calculation
  const sidebarWidth = useMemo(() => (collapsed ? 80 : 280), [collapsed]);

  // Memoize toggle function to prevent unnecessary re-renders
  const handleToggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  // Memoize layout styles to prevent recalculation
  const layoutStyle = useMemo(
    () => ({
      marginLeft: sidebarWidth,
      width: `calc(100vw - ${sidebarWidth}px)`,
      minWidth: 0,
      overflow: 'hidden',
    }),
    [sidebarWidth],
  );

  // Memoize header styles
  const headerStyle = useMemo(
    () => ({
      backgroundColor: '#ffffff',
      padding: '0 16px',
      height: '64px',
      lineHeight: '64px',
      width: '100%',
      minWidth: 0,
    }),
    [],
  );

  // Memoize content styles
  const contentStyle = useMemo(
    () => ({
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
    }),
    [],
  );

  // Memoize button styles
  const buttonStyle = useMemo(
    () => ({
      border: 'none',
      boxShadow: 'none',
    }),
    [],
  );

  // Determine which section should be open based on current route
  const currentPath = useMemo(() => pathname.split('?')[0], [pathname]);





  // Memoize Sidebar2 component to prevent unnecessary re-renders
  const memoizedSidebar = useMemo(
    () => (
      <Sidebar2
        collapsed={collapsed}
        onCollapse={setCollapsed}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        scrollTop={scrollTop}
        setScrollTop={setScrollTop}
        handleOpenChange={handleOpenChange}
        currentPath={currentPath}
      />
    ),
    [collapsed, openKeys, selectedKeys, setSelectedKeys, scrollTop, setScrollTop, handleOpenChange, currentPath]
  );

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="h-screen overflow-hidden w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">LMS Taiba</h1>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout className="h-screen overflow-hidden w-full">
      {/* <Sidebar collapsed={collapsed} onCollapse={setCollapsed} /> */}
      {memoizedSidebar}

      <Layout style={layoutStyle}>
        <Header
          className="bg-white border-b border-gray-200 px-4 flex items-center justify-between h-16"
          style={headerStyle}
        >
          {/* <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggleCollapse}
            className="text-lg bg-white hover:bg-gray-50"
            style={buttonStyle}
          /> */}
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {/* Add any other header content here like notifications, user menu, etc. */}
          </div>
        </Header>

        <Content className="bg-gray-50" style={contentStyle}>
          <ErrorBoundary>
            <div style={{ width: '100%', minWidth: 0 }}>{children}</div>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
};
