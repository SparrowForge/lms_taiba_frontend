'use client';

import { MenuOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useNotifications } from '@/hooks/useNotifications';

import ErrorBoundary from '../error/ErrorBoundary';
import { NotificationBell } from '../notifications/NotificationBell';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Sidebar2 } from './Sidebar2';
import { useSidebar } from './SidebarContext';

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

  // On phones and tablets (< lg) the sidebar becomes an off-canvas overlay instead of a fixed
  // 280px column, which would otherwise leave too little room for the page content
  const isMobile = useIsMobile(1023.98);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname, isMobile]);

  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);

  const { loadUnreadCount, unreadCount, loadNotifications, notifications } = useNotifications();

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

    const storedCount = Number(localStorage.getItem(UNREAD_COUNT_KEY) ?? 0);

    // First-time sync
    if (isFirstLoad.current) {
      localStorage.setItem(UNREAD_COUNT_KEY, unreadCount.toString());
      isFirstLoad.current = false;
      return;
    }

    // New notification detected
    if (unreadCount !== storedCount) {
      localStorage.setItem(UNREAD_COUNT_KEY, unreadCount.toString());

      loadNotifications({ page: 1, limit: 10 });
    }
  }, [unreadCount, loadNotifications]);

  const sidebarWidth = useMemo(
    () => (isMobile ? 0 : collapsed ? 80 : 280),
    [collapsed, isMobile],
  );

  const handleToggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const COLLAPSE_MS = 1000;

  const layoutStyle = useMemo(
    () => ({
      [locale === 'ar' ? 'marginRight' : 'marginLeft']: sidebarWidth,
      width: isMobile ? '100%' : `calc(100vw - ${sidebarWidth}px)`,
      minWidth: 0,
      overflow: 'hidden',
      transition: `
        ${locale === 'ar' ? 'margin-right' : 'margin-left'} ${COLLAPSE_MS}ms ease,
        width ${COLLAPSE_MS}ms ease
      `,
    }),
    [sidebarWidth, locale, isMobile],
  );

  const headerStyle = useMemo(
    () => ({
      backgroundColor: '#ffffff',
      padding: isMobile ? '0 8px' : '0 16px',
      height: '64px',
      lineHeight: '64px',
      width: '100%',
      minWidth: 0,
    }),
    [isMobile],
  );

  const contentStyle = useMemo(
    () => ({
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
      overflowY: 'auto' as const,
      height: 'calc(100dvh - 64px)',
    }),
    [],
  );

  const currentPath = useMemo(() => pathname.split('?')[0], [pathname]);

  const memoizedSidebar = useMemo(
    () => (
      <Sidebar2
        collapsed={isMobile ? false : collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
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
      isMobile,
      mobileSidebarOpen,
      closeMobileSidebar,
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
      <Layout className="h-dvh overflow-hidden w-full">
        {memoizedSidebar}

        {isMobile && mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/45"
            style={{ zIndex: 999 }}
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}

        <Layout style={layoutStyle}>
          <Header className="px-4 flex items-center justify-between h-16" style={headerStyle}>
            <div className="flex-1 flex items-center">
              {isMobile && (
                <Button
                  type="text"
                  icon={<MenuOutlined style={{ fontSize: 20 }} />}
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Open menu"
                />
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <NotificationBell unreadCount={unreadCount} notifications={notifications} />
              <LanguageSwitcher />
            </div>
          </Header>

          <Content style={contentStyle}>
            <ErrorBoundary>
              <div style={{ width: '100%', minWidth: 0 }}>{children}</div>
            </ErrorBoundary>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
