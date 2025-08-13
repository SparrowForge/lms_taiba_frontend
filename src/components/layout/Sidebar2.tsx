'use client';

import { BellOutlined, BookOutlined, LogoutOutlined, MehOutlined, SettingOutlined, SignatureOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Typography, Spin, MenuProps, Dropdown } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useCallback, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMenus } from '@/hooks/useMenus';
import { Status } from '@/types/common';
import { IMenu } from '@/types/menu';
import { MenuItemType } from 'antd/es/menu/interface';

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

    const [currentPath, setCurrentPath] = useState<string>('');

    useEffect(() => {
        setCurrentPath(pathname.split('?')[0]);
    }, [pathname]);

useEffect(() => {
    if (!myMenus || myMenus.length === 0) {
        loadMyMenus();
    }
}, [myMenus, loadMyMenus]);


    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [logout]);


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
                    label: menu.name,
                    children: hasChildren ? transformMenus(menu.children) : undefined
                };
            });
        },
        []
    );


    // Compute menuItems every time currentPath changes
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
        [collapsed, getUserFullName, user?.email]
    );


    //settings 

    // Settings dropdown menu content
    const settingsDropdownMenu = (
        <Menu
            items={[
                {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'Profile',
                    onClick: () => router.push('/settings/profile'),
                },
                {
                    type: 'divider',
                },
                {
                    key: 'upgrade',
                    icon: <SignatureOutlined />,
                    label: 'Upgrade Plan',
                    onClick: () => router.push('/upgrade'),
                },
                {
                    key: 'signout',
                    icon: <LogoutOutlined />,
                    // label: <span className="text-red-500">Logout</span>,
                    label: "Logout",
                    onClick: handleLogout,
                },
            ]}
        />
    );

    const settingsMenuItems = useMemo(
        () => [
            {
                key: 'notification',
                icon: <BellOutlined />,
                label: collapsed ? '' : 'Notification',
                onClick: () => router.push('/notifications'),
            },
            {
                key: 'settings',
                icon: <SettingOutlined />,
                label: (
                    <Dropdown
                        overlay={settingsDropdownMenu}
                        trigger={['click']}
                        placement="topRight"
                    >
                        <span className="cursor-pointer">
                            {collapsed ? '' : 'Settings'}
                        </span>
                    </Dropdown>
                ),
            },
        ],
        [collapsed, router]
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
        [collapsed, handleLogout]
    );

    const defaultOpenKeys = useMemo(() => {
        if (!menuItems) return [];
        return menuItems
            .filter(
                (item): item is Required<MenuItemType> & { children: MenuItemType[] } =>
                    !!item && Array.isArray((item as any).children) && (item as any).children.length > 0
            )
            .map((item) => item.key as string);
    }, [menuItems]);

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

            {/* User Profile */}
            {userProfileSection}

            {/* Navigation Menu */}
            <div className="flex-1 overflow-auto">
                <h1 className='p-2 text-gray-700 uppercase'>Main</h1>
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

            {/* Logout and settings Button */}
            <div className="py-4 border-t border-gray-100">
                <h1 className="px-4 text-gray-500 uppercase text-xs tracking-wider mb-2">Settings</h1>
                <Menu
                    mode="inline"
                    items={settingsMenuItems}
                    className="border-0"
                    style={{ backgroundColor: 'transparent' }}
                />
                <Menu
                    mode="inline"
                    items={logoutMenuItems}
                    className="border-0 mt-2"
                    style={{ backgroundColor: 'transparent' }}
                />
            </div>


        </Sider>
    );
};
