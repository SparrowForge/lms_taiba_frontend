'use client';

import * as Icons from '@ant-design/icons';
import {
  BellOutlined,
  DashOutlined,
  LeftOutlined,
  LogoutOutlined,
  RightOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, MenuProps, Select, Spin, Typography } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches'; // ✅ ADD
import { useLocalization } from '@/hooks/useLocalization';
import { useMenus } from '@/hooks/useMenus';

import { IMenu } from '@/types/menu';

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
export const Sidebar2 = React.memo(
  ({
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
    const [userManuallyChangedMenu, setUserManuallyChangedMenu] = useState(false);

    // Helper function to find parent key for a child menu
    const findParentKeyForChild = useCallback((childKey: string, items: any[]): string | null => {
      for (const item of items || []) {
        if (item?.children) {
          // Check if any child matches the clicked key
          const hasChild = item.children.some((child: any) => child.key === childKey);
          if (hasChild) {
            return item.key;
          }
          // Recursively check nested children
          const nestedParent = findParentKeyForChild(childKey, item.children);
          if (nestedParent) {
            return nestedParent;
          }
        }
      }
      return null;
    }, []);

    // Load menus once when user is available (hook: from localStorage first, then API once in background)
    useEffect(() => {
      if (user?.id) {
        loadMyMenus();
      }
    }, [user?.id, loadMyMenus]);

    // ✅ Load branches once (or when empty)
    useEffect(() => {
      if (!branches || branches.length === 0) {
        // fetch a sensible page size for dropdown
        // loadBranches({ page: 1, limit: 100 });
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
      [getBranchById],
    );

    // Transform API menus into Ant Design Menu items
    const transformMenus = useCallback(
      (menus: IMenu[]): MenuProps['items'] => {
        return menus.map((menu) => {
          const hasChildren = menu.children && menu.children.length > 0;

          // Generate proper key for menu items
          let key: string;
          if (hasChildren) {
            // Parent menu items get a special key
            key = `parent-${menu.id}`;
          } else {
            // Child menu items get their route as key
            if (menu.route) {
              key = menu.route.startsWith('/') ? menu.route : `/${menu.route}`;
            } else {
              // Fallback to ID if no route
              key = `menu-${menu.id}`;
            }
          }

          return {
            key,
            icon: getAntIcon(menu.icon),
            label: locale === 'ar' ? menu.localName : menu.name,
            children: hasChildren ? transformMenus(menu.children) : undefined,
          };
        });
      },
      [locale],
    );

    const menuItems = useMemo(() => {
      const items = transformMenus(myMenus || []) || [];
      // Manually inject Chart of Accounts if not present
      /*
      if (!items.find((item: any) => item?.key === '/chart-of-accounts')) {
        items.push({
          key: '/chart-of-accounts',
          icon: <Icons.BankOutlined />,
          label: t(LOCALE_KEYS.CHART_OF_ACCOUNTS, { defaultValue: 'Chart of Accounts' }),
        });
      }
      */
      // Actually, let's just append it for now as the user requested "make it available".
      // Ideally this should come from backend, but explicit override is fine for dev.
      const financialManagementLabel = t(LOCALE_KEYS.FINANCIAL_MANAGEMENT, {
        defaultValue: 'Financial Management',
      });

      // Find existing Financial Management menu item
      const financialManagementIndex = items.findIndex(
        (item: any) =>
          item?.label === financialManagementLabel || item?.label === 'Financial Management',
      );

      const newChildren = [
        {
          key: '/financial-years',
          icon: <Icons.CalendarOutlined />,
          label: t(LOCALE_KEYS.FINANCIAL_YEARS, { defaultValue: 'Financial Years' }),
        },
        {
          key: '/chart-of-accounts',
          icon: <Icons.BankOutlined />,
          label: t(LOCALE_KEYS.CHART_OF_ACCOUNTS, { defaultValue: 'Chart of Accounts' }),
        },
        {
          key: '/cost-centers',
          icon: <Icons.ApartmentOutlined />,
          label: t(LOCALE_KEYS.COST_CENTERS, { defaultValue: 'Cost Centers' }),
        },

        {
          key: '/voucher-types',
          icon: <Icons.FileTextOutlined />,
          label: t(LOCALE_KEYS.VOUCHER_TYPES, { defaultValue: 'Voucher Types' }),
        },
      ];

      if (financialManagementIndex > -1) {
        // If exists, clone and append children
        const newItems = [...items];
        const existingItem = { ...newItems[financialManagementIndex] } as any;
        existingItem.children = [...(existingItem.children || []), ...newChildren];
        newItems[financialManagementIndex] = existingItem;
        return newItems;
      }

      // If not exists, create new one
      return [...items];
    }, [myMenus, transformMenus, t]);

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

      // Handle root path
      if (routeWithoutLocale === '/' || routeWithoutLocale === `/${locale}`) {
        routeWithoutLocale = '/';
      }

      // Reset manual interaction flag when route changes
      setUserManuallyChangedMenu(false);

      // Find the menu item that matches the current route and its parent
      const findSelectedKeyAndParent = (
        items: any[],
      ): { selectedKey: string[]; parentKey: string | null } => {
        for (const item of items || []) {
          // Skip parent menu items (they don't have routes)
          if (item?.key?.startsWith('parent-')) {
            // Check children of parent items
            if (item?.children) {
              const childResult = findSelectedKeyAndParent(item.children);
              if (childResult.selectedKey.length > 0) {
                return {
                  selectedKey: childResult.selectedKey,
                  parentKey: item.key,
                };
              }
            }
            continue;
          }

          // Check exact match for non-parent items
          if (item?.key === routeWithoutLocale) {
            return { selectedKey: [item.key], parentKey: null };
          }

          // Check if route starts with menu key (for nested routes like /users/123)
          if (item?.key && routeWithoutLocale.startsWith(item.key + '/')) {
            return { selectedKey: [item.key], parentKey: null };
          }

          // Check children
          if (item?.children) {
            const childResult = findSelectedKeyAndParent(item.children);
            if (childResult.selectedKey.length > 0) {
              return {
                selectedKey: childResult.selectedKey,
                parentKey: item.key,
              };
            }
          }
        }
        return { selectedKey: [], parentKey: null };
      };

      const { selectedKey, parentKey } = findSelectedKeyAndParent(menuItems || []);

      // Create final selected keys array - include parent if submenu is selected
      const finalSelectedKeys = [...selectedKey];
      if (parentKey) {
        // Add parent key to selected keys for highlighting
        finalSelectedKeys.push(parentKey);
      }

      // Update selected keys
      setSelectedKeys(finalSelectedKeys);

      // Auto-expand parent menu if a child is selected, but only if user hasn't manually changed menu and sidebar is not collapsed
      if (parentKey && !openKeys.includes(parentKey) && !userManuallyChangedMenu && !collapsed) {
        handleOpenChange([parentKey]);
      }
    }, [
      pathname,
      menuItems,
      setSelectedKeys,
      locale,
      openKeys,
      handleOpenChange,
      userManuallyChangedMenu,
    ]);

    // Local handleOpenChange for manual menu expansion
    const handleLocalOpenChange = useCallback(
      (keys: string[]) => {
        // Mark that user has manually interacted with the menu
        setUserManuallyChangedMenu(true);

        // Simple behavior: just pass the keys directly, allow multiple menus to be open
        handleOpenChange(keys);
      },
      [handleOpenChange],
    );

    const handleMenuClick = useCallback(
      ({ key }: { key: string }) => {
        // Only navigate if it's not a parent menu item and not already on the same path
        if (key && !key.startsWith('parent-') && !key.startsWith('menu-') && key !== currentPath) {
          router.push(key);
        }
      },
      [router, currentPath],
    );

    // ✅ USER PROFILE with Branch dropdown
    const userProfileSection = useMemo(
      () => (
        <div className="p-4 border-b border-gray-100">
          <div
            className={`flex ${collapsed ? 'flex-col gap-2' : 'flex-row'}  items-center space-x-3`}
          >
            <Avatar
              size={collapsed ? 22 : 40}
              icon={<UserOutlined />}
              className="bg-gradient-to-r from-blue-500 to-purple-600 "
            />
            {!collapsed && (
              <div className="flex-1 min-w-0 text-white pl-6">
                <Text strong className="block text-sm truncate text-white">
                  {getUserFullName()}
                </Text>
                <Text type="secondary" className="text-xs truncate text-white">
                  {user?.email}
                </Text>
                <div className="flex items-center mt-1 ml-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <Text className="text-xs" style={{ color: '#ffffff' }}>
                    Online
                  </Text>
                </div>
              </div>
            )}
            <DashOutlined
              onClick={() => setShowBranchSelect((prev) => !prev)}
              className="cursor-pointer bg-blue-500 p-[2px] rounded-md  text-lg"
            />
          </div>

          {/* ✅ Separate row for branch select */}
          {showBranchSelect && (
            <div className="mt-3">
              <Select
                size="small"
                className="w-full bg-[#92c4fc]"
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
                  label: locale === 'ar' ? (b.localName ?? b.name) : b.name,
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
        //  user?.type,
        t,
        selectedBranch?.id,
        branchListStatus.status,
        branches,
        handleBranchChange,
        loadBranches,
        // locale // uncomment if you localize branch label via locale
      ],
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
        key: 'settings',
        icon: <SettingOutlined />,
        label: t(LOCALE_KEYS.SETTINGS),
        onClick: () => router.push('/settings'),
      },
    ];

    const settingsMenuItems = useMemo(
      () => [
        {
          key: 'settings-parent',
          icon: <SettingOutlined />,
          label: collapsed ? null : t(LOCALE_KEYS.SETTINGS),
          children: settingsMenuItemsDropdown,
        },
      ],
      [collapsed, t, router, settingsMenuItemsDropdown],
    );

    const notificationMenuItems = useMemo(
      () => [
        {
          key: 'notification',
          icon: <BellOutlined />,
          label: t(LOCALE_KEYS.NOTIFICATION),
          onClick: () => router.push('/notifications'),
          style: {
            color: '#FFFFFF',
          },
        },
      ],
      [t, router],
    );

    const logoutMenuItems = useMemo(
      () => [
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: t(LOCALE_KEYS.LOGOUT),
          onClick: handleLogout,
          style: {
            color: '#FFFFFF',
          },
        },
      ],
      [collapsed, handleLogout, t],
    );

    return (
      <>
        <Sider
          collapsed={collapsed}
          collapsedWidth={80}
          trigger={null}
          width={280}
          theme="light"
          className="border-r flex flex-col "
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            [locale === 'ar' ? 'right' : 'left']: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: '#1F4BCA',
            transition: '1000ms ease',
          }}
        >
          {/* Logo */}
          <div className="py-6 border-b border-gray-100 shrink-0 text-white">
            <div className="flex items-center justify-center">
              {!collapsed ? (
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <h1 className="text-xl font-bold mb-1">LMS Taiba</h1>
                  <Text className="text-xs uppercase" style={{ color: '#52d1f8ff' }}>
                    {user?.type} Panel
                  </Text>
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
              )}
            </div>
          </div>
          {/* Side toggle (middle-right) */}
          <div className={`absolute  ${collapsed ? 'top-40' : 'top-36'} right-0 z-20`}>
            <Button
              type="primary"
              icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
              onClick={() => onCollapse(!collapsed)}
              style={{
                width: 28,
                height: 28,
                backgroundColor: '#92c4fc',
                color: '#333',
                border: '1px solid #ddd',
              }}
            />
          </div>
          {/* User Profile + Branch */}
          <div className="shrink-0">{userProfileSection}</div>

          {/* Navigation Menu */}
          <div
            className="flex-1 min-h-0 overflow-auto "
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
            <h1 className="pt-4 px-4 text-gray-400 uppercase text-xs tracking-wider">
              {t(LOCALE_KEYS.MAIN)}
            </h1>
            {myMenusStatus.status === Status.LOADING ? (
              <div className="flex justify-center items-center p-4">
                <Spin />
              </div>
            ) : (
              <Menu
                mode={collapsed ? 'vertical' : 'inline'}
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={handleLocalOpenChange}
                items={menuItems}
                onClick={handleMenuClick}
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                }}
              />
            )}
          </div>

          {/* Settings & Logout */}
          <div className="py-4 border-t border-gray-100 shrink-0">
            <h1
              className={`${
                collapsed ? (locale === 'ar' ? 'px-4' : 'px-2') : 'pl-4'
              } text-gray-400 uppercase text-xs tracking-wider mb-2`}
            >
              {t(LOCALE_KEYS.SETTINGS)}
            </h1>
            <Menu
              mode="inline"
              items={notificationMenuItems}
              className="text-white"
              style={{ backgroundColor: 'transparent', color: '#ffffff' }}
            />
            <Menu
              mode="vertical"
              items={settingsMenuItems}
              className="text-white"
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                paddingLeft: collapsed ? '0px' : '10px',
              }}
            />
            <Menu
              mode="inline"
              items={logoutMenuItems}
              className="text-white"
              style={{ backgroundColor: 'transparent', color: '#ffffff' }}
            />
          </div>
        </Sider>
        <style jsx global>{`
          aside::-webkit-scrollbar {
            width: 4px;
          }
          aside::-webkit-scrollbar-track {
            background: transparent;
          }
          aside::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
          }

          .ant-menu-item,
          .ant-menu-submenu-title {
            color: #ffffff !important;
          }
          .ant-menu-item-selected {
            background-color: #163a99 !important; /* darker shade */
            color: #ffffff !important;
          }

          /* Highlight parent submenu when child is selected */
          .ant-menu-submenu.ant-menu-item-selected > .ant-menu-submenu-title {
            background-color: #163a99 !important;
            color: #ffffff !important;
          }

          /* Alternative: highlight parent when it contains selected child */
          .ant-menu-submenu:has(.ant-menu-item-selected) > .ant-menu-submenu-title {
            background-color: #163a99 !important;
            color: #ffffff !important;
          }

          /* Highlight selected submenu titles in collapsed state */
          .ant-layout-sider-collapsed .ant-menu-submenu-selected > .ant-menu-submenu-title {
            background-color: #163a99 !important;
            color: #ffffff !important;
          }
        `}</style>
      </>
    );
  },
);
