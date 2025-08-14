'use client';

import {
  BellOutlined,
  BookOutlined,
  DashOutlined,
  LeftOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  SettingOutlined,
  SignatureOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Layout,
  Menu,
  Typography,
  Spin,
  MenuProps,
  Dropdown,
  Button,
  Divider,
  Select, // ✅ ADD
} from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useCallback, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMenus } from '@/hooks/useMenus';
import { Status } from '@/types/common';
import { IMenu } from '@/types/menu';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { useLocalization } from '@/hooks/useLocalization';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useBranches } from '@/hooks/useBranches'; // ✅ ADD

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar2 = ({ collapsed, onCollapse }: SidebarProps) => {
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

  const [currentPath, setCurrentPath] = useState<string>('');
  const [showBranchSelect, setShowBranchSelect] = useState(false);

  useEffect(() => {
    setCurrentPath(pathname.split('?')[0]);
  }, [pathname]);

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
          icon: <BookOutlined />,
          label: locale === 'ar' ? menu.localName : menu.name,
          children: hasChildren ? transformMenus(menu.children) : undefined,
        };
      });
    },
    [locale]
  );

  const menuItems = useMemo(() => transformMenus(myMenus || []), [myMenus, transformMenus]);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      if (key && !key.startsWith('parent-') && key !== currentPath) {
        router.push(key);
        setCurrentPath(key);
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

  const defaultOpenKeys = useMemo(() => {
    if (!menuItems) return [];

    const openKey = menuItems.find(
      (item): item is MenuItemType & { children: ItemType<MenuItemType>[] } =>
        !!item &&
        'children' in item &&
        Array.isArray(item.children) &&
        item.children.some(
          (child): child is MenuItemType => !!child && 'key' in child && child.key === currentPath
        )
    )?.key;

    return openKey ? [String(openKey)] : [];
  }, [menuItems, currentPath]);

//   <>
//     {/* Floating Toggle Button (top) */}
//     <Button
//       type="primary"
//       shape="default"
//       icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//       onClick={() => onCollapse(!collapsed)}
//       className={`absolute shadow-md ${
//         locale === 'en'
//           ? collapsed
//             ? 'top-[100px] left-16'
//             : 'top-[170px] left-[264px]'
//           : collapsed
//           ? 'top-[100px] left-4'
//           : 'top-[170px] left-4'
//       }`}
//       style={{
//         width: 28,
//         height: 28,
//         padding: 0,
//         backgroundColor: '#fff',
//         color: '#333',
//         border: '1px solid #ddd',
//       }}
//     />
//   </>;

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
        <div
          className={`absolute right-0 z-20 ${
            collapsed
              ? locale === 'ar'
                ? 'bottom-[475px]'
                : 'bottom-[475px]'
              : locale === 'ar'
              ? 'bottom-[470px]'
              : 'bottom-[470px]'
          }`}
        >
          <Button
            type="primary"
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{
              width: 28,
              height: 28,
              padding: 0,
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid #ddd',
            }}
          />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1" style={{ overflow: 'auto' }}>
          <h1 className="pt-4 px-2 text-gray-400 uppercase">{t(LOCALE_KEYS.MAIN)}</h1>
          {myMenusStatus.status === Status.LOADING ? (
            <div className="flex justify-center items-center p-4">
              <Spin />
            </div>
          ) : (
            <Menu
              mode="inline"
              selectedKeys={[currentPath]}
              defaultOpenKeys={defaultOpenKeys}
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
};
