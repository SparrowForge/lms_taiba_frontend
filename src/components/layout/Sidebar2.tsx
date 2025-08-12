'use client';

import { BookOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Typography, Spin, MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMenus } from '@/hooks/useMenus';
import { Status } from '@/types/common';
import { IMenu } from '@/types/menu';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

export const Sidebar2 = ({ collapsed }: SidebarProps) => {
    const { user, logout, getUserFullName } = useAuth();
    const { myMenus, myMenusStatus, loadMyMenus } = useMenus();
    const router = useRouter();
    const pathname = usePathname();

    // Load menus on mount
    // Load menus on mount
    useEffect(() => {
        console.log('Loading menus...');
        loadMyMenus();
    }, [loadMyMenus]);



    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [logout]);

    // Convert API menu structure → Ant Design Menu items
    const transformMenus = useCallback(
        (menus: IMenu[]): MenuProps['items'] => {
            return menus.map((menu) => {
                const hasChildren = menu.children && menu.children.length > 0;
                return {
                    key: menu.route ?? `parent-${menu.id}`,
                    icon: <BookOutlined />,
                    label: menu.name,
                    children: hasChildren ? transformMenus(menu.children) : [],
                };
            });
        },
        []
    );



    const menuItems = useMemo(() => transformMenus(myMenus || []), [myMenus, transformMenus]);

    // const handleMenuClick = useCallback(
    //     ({ key }: { key: string }) => {
    //         if (key.startsWith('/')) { // only navigate if key is a route
    //             router.push(key);
    //         }
    //     },
    //     [router]
    // );
    const handleMenuClick = useCallback(
        ({ key }: { key: string }) => {
            router.push(key);
        },
        [router],
    );


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
            {/* Logo */}
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
                {myMenusStatus.status === Status.LOADING ? (
                    <div className="flex justify-center items-center p-4">
                        <Spin />
                    </div>
                ) : (
                    <Menu
                        mode="inline"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        onClick={handleMenuClick}
                    />


                )}
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
