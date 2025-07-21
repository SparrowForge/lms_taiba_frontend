'use client'

import {Avatar, Layout, Menu, Typography} from 'antd'
import {
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import {useAuth} from '@/hooks/useAuth'
import {usePathname, useRouter} from 'next/navigation'
import {toast, ToastContainer} from 'react-toastify'

const {Sider} = Layout
const {Text} = Typography

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

export const Sidebar = ({collapsed}: SidebarProps) => {
  const {user, logout, getUserFullName} = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const menuItems = [
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
      key: '/students',
      icon: <UserOutlined />,
      label: 'Students',
    },
    {
      key: '/teachers',
      icon: <TeamOutlined />,
      label: 'Teachers',
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: 'Courses',
    },
    {
      key: '/assignments',
      icon: <FileTextOutlined />,
      label: 'Assignments',
    },
    {
      type: 'divider' as const,
    },
    {
      key: '/calendar',
      icon: <CalendarOutlined />,
      label: 'Calendar',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
    },
    {
      type: 'divider' as const,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ]

  const handleMenuClick = ({key}: {key: string}) => {
    toast.success('Menu clicked!')
    router.push(key)
  }

  return (
    <>
    <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={true}/>
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
              <Text type="secondary" className="text-xs">Admin Panel</Text>
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
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: collapsed ? '' : 'Logout',
              onClick: handleLogout,
              className: 'text-red-600 hover:text-red-700',
            },
          ]}
          className="border-0"
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </div>
      </Sider>
    </>
  )
}
