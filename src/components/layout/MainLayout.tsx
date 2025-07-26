'use client'

import {useCallback, useMemo, useState} from 'react'
import {Button, Layout} from 'antd'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import {Sidebar} from './Sidebar'
import ErrorBoundary from '../error/ErrorBoundary'
import {LanguageSwitcher} from '../ui/LanguageSwitcher'

const {Header, Content} = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({children}: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)

  // Memoize sidebar width calculation
  const sidebarWidth = useMemo(() => collapsed ? 80 : 280, [collapsed])

  // Memoize toggle function to prevent unnecessary re-renders
  const handleToggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  // Memoize layout styles to prevent recalculation
  const layoutStyle = useMemo(() => ({
    marginLeft: sidebarWidth,
    width: `calc(100vw - ${sidebarWidth}px)`,
    minWidth: 0,
    overflow: 'hidden'
  }), [sidebarWidth])

  // Memoize header styles
  const headerStyle = useMemo(() => ({
    backgroundColor: '#ffffff',
    padding: '0 16px',
    height: '64px',
    lineHeight: '64px',
    width: '100%',
    minWidth: 0,
  }), [])

  // Memoize content styles
  const contentStyle = useMemo(() => ({
    width: '100%',
    minWidth: 0,
    maxWidth: '100%'
  }), [])

  // Memoize button styles
  const buttonStyle = useMemo(() => ({
    border: 'none',
    boxShadow: 'none',
  }), [])

  return (
    <Layout className="h-screen overflow-hidden w-full">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      <Layout style={layoutStyle}>
        <Header
          className="bg-white border-b border-gray-200 px-4 flex items-center justify-between h-16"
          style={headerStyle}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggleCollapse}
            className="text-lg bg-white hover:bg-gray-50"
            style={buttonStyle}
          />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {/* Add any other header content here like notifications, user menu, etc. */}
          </div>
        </Header>

        <Content
          className="bg-gray-50"
          style={contentStyle}
        >
          <ErrorBoundary>
            <div style={{width: '100%', minWidth: 0}}>
              {children}
            </div>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  )
}
