'use client';

import {BookOutlined, DashboardOutlined, LogoutOutlined, SettingOutlined, UserOutlined,} from '@ant-design/icons';
import {Avatar, Layout, Menu, Typography} from 'antd';
import {usePathname, useRouter} from 'next/navigation';
import {useCallback, useMemo} from 'react';

import {useAuth} from '@/hooks/useAuth';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const { user, logout, getUserFullName } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(
    () => [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        type: 'divider' as const,
      },
      {
        key: '/users',
        icon: <UserOutlined />,
        label: 'Users',
      },
      {
        key: '/panels',
        icon: <UserOutlined />,
        label: 'Panels',
      },
      {
        key: '/branches',
        icon: <UserOutlined />,
        label: 'Branches',
      },
      {
        key: '/departments',
        icon: <UserOutlined />,
        label: 'Departments',
      },
      {
        key: '/roles',
        icon: <UserOutlined />,
        label: 'Roles',
      },
      {
        key: '/menus',
        icon: <UserOutlined />,
        label: 'Menus',
      },
      {
        key: '/role-menu-permissions',
        icon: <UserOutlined />,
        label: 'Role Menu Permissions',
      },
      {
        key: '/courses',
        icon: <BookOutlined />,
        label: 'Courses',
      },
      {
        key: '/course-types',
        icon: <BookOutlined />,
        label: 'Course Types',
      },
      {
        key: '/schedule-types',
        icon: <BookOutlined />,
        label: 'Schedule Types',
      },
      {
        key: '/employment-types',
        icon: <BookOutlined />,
        label: 'Employment Types',
      },
      {
        key: '/batches',
        icon: <BookOutlined />,
        label: 'Batches',
      },
      {
        key: '/semesters',
        icon: <BookOutlined />,
        label: 'Semesters',
      },
      {
        key: '/semester-subjects',
        icon: <BookOutlined />,
        label: 'Semester Subjects',
      },
      {
        key: '/subjects',
        icon: <BookOutlined />,
        label: 'Subjects',
      },
      {
        key: '/faculties',
        icon: <BookOutlined />,
        label: 'Faculties',
      },
      {
        key: '/faculty-subjects',
        icon: <BookOutlined />,
        label: 'Faculty Subjects',
      },
      {
        key: '/audit',
        icon: <BookOutlined />,
        label: 'Audit Logs',
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
      {
        key: '/institutes',
        icon: <BookOutlined />,
        label: 'Institutes',
      },
      {
        key: '/addresses',
        icon: <BookOutlined />,
        label: 'Addresses',
      },
      {
        key: '/fee-structures',
        icon: <BookOutlined />,
        label: 'Fee Structures',
      },
      {
        key: '/fee-installment-plans',
        icon: <BookOutlined />,
        label: 'Fee Installment Plans',
      },
      {
        key: '/user-roles',
        icon: <UserOutlined />,
        label: 'User Roles',
      },
    ],
    [],
  );

  // Optimized menu click handler - removed toast for faster navigation
  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      router.push(key);
    },
    [router],
  );

  // Memoize user profile section to prevent unnecessary re-renders
  const userProfileSection = useMemo(
    () => (
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar
            size={collapsed ? 32 : 40}
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
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
        </div>
      </div>
    ),
    [collapsed, getUserFullName, user?.email],
  );

  // Memoize logout menu items
  const logoutMenuItems = useMemo(
    () => [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: collapsed ? '' : 'Logout',
        onClick: handleLogout,
        className: 'text-red-600 hover:text-red-700',
      },
    ],
    [collapsed, handleLogout],
  );

  return (
    <Sider
      collapsed={collapsed}
      theme="light"
      width={280}
      className="border-r border-gray-200 shadow-sm"
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
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-center">
          {!collapsed && (
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">LMS Taiba</h1>
              <Text type="secondary" className="text-xs">
                Admin Panel
              </Text>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      {userProfileSection}

      {/* Navigation Menu */}
      <div className="flex-1 overflow-auto">
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-0 px-3 py-2"
          style={{
            backgroundColor: 'transparent',
            fontSize: '14px',
          }}
        />
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <Menu
          mode="inline"
          items={logoutMenuItems}
          className="border-0"
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </div>
    </Sider>
  );
};
