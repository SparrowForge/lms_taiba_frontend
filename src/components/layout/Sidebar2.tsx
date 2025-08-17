'use client';

import * as Icons from '@ant-design/icons';
import {
  BellOutlined,
  DashOutlined,
  LeftOutlined,
  LogoutOutlined,
  RightOutlined,
  SettingOutlined,
  SignatureOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {Avatar, Button, Divider, Dropdown, Layout, Menu, MenuProps, Select, Spin, Typography,} from 'antd';
import {usePathname, useRouter} from 'next/navigation';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useAuth} from '@/hooks/useAuth';
import {useBranches} from '@/hooks/useBranches'; // ✅ ADD
import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';

import {Status} from '@/types/common';
import {IMenu} from '@/types/menu';


const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  openKeys: string[];
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
  scrollTop: number;
  setScrollTop: (scrollTop: number) => void;
  handleOpenChange: (keys: string[]) => void;
  currentPath: string;
}

// eslint-disable-next-line react/display-name
export const Sidebar2 = React.memo(({
    collapsed,
    onCollapse,
    openKeys,
    selectedKeys,
    setSelectedKeys,
    scrollTop,
    setScrollTop,
    handleOpenChange,
    currentPath,
  }: SidebarProps) => {
  const { t } = useLocalization();
  const { user, logout, getUserFullName } = useAuth();
  const { myMenus, myMenusStatus, loadMyMenus } = useMenus();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  // ✅ Branch state/actions
  const {
    branches,
    selectedBranch,
    listStatus: branchListStatus,
    loadBranches,
    getBranchById,
  } = useBranches();

  const [showBranchSelect, setShowBranchSelect] = useState(false);



  useEffect(() => {
    if (!myMenus || myMenus.length === 0) {
      loadMyMenus();
    }
  }, [myMenus, loadMyMenus]);

  // ✅ Load branches once (or when empty)
  useEffect(() => {
    if (!branches || branches.length === 0) {
      // fetch a sensible page size for dropdown
      loadBranches({ page: 1, limit: 100 });
    }
  }, [branches, loadBranches]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  //icon
  const getAntIcon = (iconName?: string) => {
  if (!iconName) return null;
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : null;
};

  // ✅ Branch change handler
  const handleBranchChange = useCallback(
    (branchId: number) => {
      // will set from list or fetch if not present
      getBranchById(branchId);
    },
    [getBranchById]
  );

  // Transform API menus into Ant Design Menu items
 const transformMenus = useCallback(
  (menus: IMenu[]): MenuProps['items'] => {
    return menus.map((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const key = hasChildren
        ? `parent-${menu.id}`
        : menu.route?.startsWith('/')
        ? menu.route
        : `/${menu.route}`;



      return {
        key,
        icon: getAntIcon(menu.icon),
        label: locale === 'ar' ? menu.localName : menu.name,
        children: hasChildren ? transformMenus(menu.children) : undefined,
      };
    });
  },
  [locale]
);


  const menuItems = useMemo(() => transformMenus(myMenus || []), [myMenus, transformMenus]);

  // Update selected keys and open keys when route changes
  useEffect(() => {
    const currentRoute = pathname.split('?')[0];
    // Remove locale from path (e.g., '/en/semesters' -> '/semesters')
    const pathParts = currentRoute.split('/');
    let routeWithoutLocale = currentRoute;

    // Check if the second part is the locale
    if (pathParts.length > 2 && pathParts[1] === locale) {
      routeWithoutLocale = '/' + pathParts.slice(2).join('/');
    }

    // Find the menu item that matches the current route and its parent
    const findSelectedKeyAndParent = (items: any[]): { selectedKey: string[], parentKey: string | null } => {
      for (const item of items || []) {
        // Check exact match
        if (item?.key === routeWithoutLocale) {
          return { selectedKey: [item.key], parentKey: null };
        }

        // Check if route starts with menu key (for nested routes)
        if (item?.key && routeWithoutLocale.startsWith(item.key)) {
          return { selectedKey: [item.key], parentKey: null };
        }

        // Check children
        if (item?.children) {
          const childResult = findSelectedKeyAndParent(item.children);
          if (childResult.selectedKey.length > 0) {
            // If we found a match in children, this item is the parent
            return {
              selectedKey: childResult.selectedKey,
              parentKey: item.key
            };
          }
        }
      }
      return { selectedKey: [], parentKey: null };
    };

        const { selectedKey } = findSelectedKeyAndParent(menuItems || []);

    // Only update selected keys (don't auto-expand sections)
    setSelectedKeys(selectedKey);
  }, [pathname, menuItems, setSelectedKeys, locale]);

  // Local handleOpenChange for manual menu expansion
  const handleLocalOpenChange = useCallback((keys: string[]) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);

    if (latestOpenKey) {
      // Close all other sections and open only the clicked one
      handleOpenChange([latestOpenKey]);
    } else {
      // If closing a section, keep it closed
      handleOpenChange([]);
    }
  }, [openKeys, handleOpenChange]);


  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      if (key && !key.startsWith('parent-') && key !== currentPath) {
        router.push(key);
      }
    },
    [router, currentPath]
  );

  // ✅ USER PROFILE with Branch dropdown
  const userProfileSection = useMemo(
    () => (
   <div className="p-4 border-b border-gray-100">
  <div className="flex items-center space-x-3">
    <Avatar
      size={collapsed ? 22 : 40}
      icon={<UserOutlined />}
      className="bg-gradient-to-r from-blue-500 to-purple-600 "
    />
    {!collapsed && (
      <div className="flex-1 min-w-0">
        <Text strong className="block text-sm truncate text-gray-900">
          {getUserFullName()}
        </Text>
        <Text type="secondary" className="text-xs truncate">
          {user?.email}
        </Text>
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <Text className="text-xs text-green-600">Online</Text>
        </div>
      </div>
    )}
    <DashOutlined
      onClick={() => setShowBranchSelect((prev) => !prev)}
      className="cursor-pointer bg-gray-50 p-[2px] rounded-md  text-lg"

    />
  </div>

  {/* ✅ Separate row for branch select */}
  {showBranchSelect && (
    <div className="mt-3">
      <Select
        size="small"
        className="w-full"
        placeholder={t(LOCALE_KEYS.SELECT_BRANCH)}
        value={selectedBranch?.id}
        loading={branchListStatus.status === Status.LOADING}
        showSearch
        optionFilterProp="label"
        onChange={(val) => handleBranchChange(Number(val))}
        onDropdownVisibleChange={(open) => {
          if (open && (!branches || branches.length === 0)) {
            loadBranches({ page: 1, limit: 100 });
          }
        }}
        options={(branches || []).map((b) => ({
          value: b.id,
          label: locale === 'ar' ? b.localName ?? b.name : b.name,
        }))}
      />
    </div>
  )}
</div>

    ),
    [
      collapsed,
      getUserFullName,
      user?.email,
      t,
      selectedBranch?.id,
      branchListStatus.status,
      branches,
      handleBranchChange,
      loadBranches,
      // locale // uncomment if you localize branch label via locale
    ]
  );

  // Settings dropdown menu content
  const settingsMenuItemsDropdown: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t(LOCALE_KEYS.PROFILE),
      onClick: () => router.push('/settings/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'upgrade',
      icon: <SignatureOutlined />,
      label: t(LOCALE_KEYS.UPGRADE_PLAN),
      onClick: () => router.push('/upgrade'),
    },
    {
      key: 'signout',
      icon: <LogoutOutlined />,
      label: t(LOCALE_KEYS.LOGOUT),
      onClick: handleLogout,
    },
  ];

  const settingsMenuItems = useMemo(
    () => [
      {
        key: 'notification',
        icon: <BellOutlined />,
        label: collapsed ? '' : t(LOCALE_KEYS.NOTIFICATION),
        onClick: () => router.push('/notifications'),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: (
          <Dropdown
            menu={{ items: settingsMenuItemsDropdown }}
            trigger={['click']}
            placement="topRight"
          >
            <span className="cursor-pointer">{collapsed ? '' : t(LOCALE_KEYS.SETTINGS)}</span>
          </Dropdown>
        ),
      },
    ],
    [collapsed, t]
  );

  const logoutMenuItems = useMemo(
    () => [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: collapsed ? '' : t(LOCALE_KEYS.LOGOUT),
        onClick: handleLogout,
        className: 'text-red-600 hover:text-red-700',
      },
    ],
    [collapsed, handleLogout, t]
  );

  return (
    <>
      <Sider
        collapsed={collapsed}
        theme="light"
        width={280}
        className="border-r border-gray-200 shadow-sm flex flex-col"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: '#ffffff',
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-center">
            {!collapsed ? (
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">LMS Taiba</h1>
                <Text type="secondary" className="text-xs">
                  Admin Panel
                </Text>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
            )}
          </div>
        </div>

        {/* User Profile + Branch */}
        <div className="shrink-0">{userProfileSection}</div>

        {/* Side toggle (middle-right) */}
        <div className={'absolute right-0 z-20'}>
          <Button
            type="primary"
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{
              width: 28,
              height: 28,
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid #ddd',
            }}
          />
        </div>

        {/* Navigation Menu */}
        <div
          className="flex-1"
          style={{ overflow: 'auto' }}
          ref={(el) => {
            if (el) {
              // Restore scroll position when component mounts
              if (scrollTop > 0) {
                el.scrollTop = scrollTop;
              }
              // Save scroll position on scroll
              el.onscroll = () => {
                setScrollTop(el.scrollTop);
              };
            }
          }}
        >
          <h1 className="pt-4 px-2 text-gray-400 uppercase">{t(LOCALE_KEYS.MAIN)}</h1>
          {myMenusStatus.status === Status.LOADING ? (
            <div className="flex justify-center items-center p-4">
              <Spin />
            </div>
          ) : (
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onOpenChange={handleLocalOpenChange}
              items={menuItems}
              onClick={handleMenuClick}
            />
          )}
        </div>

        {/* Settings & Logout */}
        <div className="py-4 border-t border-gray-100 shrink-0">
          <h1 className="pl-1 text-gray-500 uppercase text-xs tracking-wider mb-2">
            {t(LOCALE_KEYS.SETTINGS)}
          </h1>
          <Menu mode="inline" items={settingsMenuItems} className="border-0" style={{ backgroundColor: 'transparent' }} />
          <Divider />
          <Menu mode="inline" items={logoutMenuItems} className="border-0 mt-2" style={{ backgroundColor: 'transparent' }} />
        </div>
      </Sider>
    </>
  );
});


