'use client';

import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ToastContainer } from 'react-toastify';

import { useNotifications } from '@/hooks/useNotifications';

import { Sidebar2 } from './Sidebar2';
import { useSidebar } from './SidebarContext';
import ErrorBoundary from '../error/ErrorBoundary';
import { NotificationBell } from '../notifications/NotificationBell';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

const { Header, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const POLLING_INTERVAL = 20000; // 20 seconds
const UNREAD_COUNT_KEY = 'unread_notification_count';

export const MainLayout = ({ children }: MainLayoutProps) => {
  const {
    collapsed,
    setCollapsed,
    openKeys,
    selectedKeys,
    setSelectedKeys,
    scrollTop,
    setScrollTop,
    isClient,
    handleOpenChange,
  } = useSidebar();

  const pathname = usePathname();
  const locale = pathname.split('/')[1];


  const {
    loadUnreadCount,
    unreadCount,
    loadNotifications,
    notifications,
  } = useNotifications();

  const isFirstLoad = useRef(true);


  useEffect(() => {
    loadUnreadCount();
    loadNotifications({ page: 1, limit: 10 });
  }, [loadUnreadCount, loadNotifications]);


  useEffect(() => {
    const interval = setInterval(() => {
      loadUnreadCount();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [loadUnreadCount]);


  useEffect(() => {
    if (unreadCount === undefined || unreadCount === null) return;

    const storedCount = Number(
      localStorage.getItem(UNREAD_COUNT_KEY) ?? 0
    );

    // First-time sync
    if (isFirstLoad.current) {
      localStorage.setItem(
        UNREAD_COUNT_KEY,
        unreadCount.toString()
      );
      isFirstLoad.current = false;
      return;
    }

    // New notification detected
    if (unreadCount !== storedCount) {
      localStorage.setItem(
        UNREAD_COUNT_KEY,
        unreadCount.toString()
      );

      loadNotifications({ page: 1, limit: 10 });
    }
  }, [unreadCount, loadNotifications]);

  const sidebarWidth = useMemo(() => (collapsed ? 80 : 280), [collapsed]);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const COLLAPSE_MS = 1000;

  const layoutStyle = useMemo(
    () => ({
      [locale === 'ar' ? 'marginRight' : 'marginLeft']: sidebarWidth,
      width: `calc(100vw - ${sidebarWidth}px)`,
      minWidth: 0,
      overflow: 'hidden',
      transition: `
        ${locale === 'ar' ? 'margin-right' : 'margin-left'} ${COLLAPSE_MS}ms ease,
        width ${COLLAPSE_MS}ms ease
      `,
    }),
    [sidebarWidth, locale],
  );

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

  const contentStyle = useMemo(
    () => ({
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
    }),
    [],
  );

  const currentPath = useMemo(
    () => pathname.split('?')[0],
    [pathname],
  );

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
    [
      collapsed,
      openKeys,
      selectedKeys,
      setSelectedKeys,
      scrollTop,
      setScrollTop,
      handleOpenChange,
      currentPath,
    ],
  );

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
    <>
      <ToastContainer />
      <Layout className="h-screen overflow-hidden w-full">
        {memoizedSidebar}

        <Layout style={layoutStyle}>
          <Header
            className="px-4 flex items-center justify-between h-16"
            style={headerStyle}
          >
            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <NotificationBell
                unreadCount={unreadCount}
                notifications={notifications}
                
              />
              <LanguageSwitcher />
            </div>
          </Header>

          <Content style={contentStyle}>
            <ErrorBoundary>
              <div style={{ width: '100%', minWidth: 0 }}>
                {children}
              </div>
            </ErrorBoundary>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
