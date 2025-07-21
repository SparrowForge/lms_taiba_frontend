'use client'

import {useState} from 'react'
import {Button, Layout} from 'antd'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import {Sidebar} from './Sidebar'
import ErrorBoundary from '../error/ErrorBoundary'

const {Header, Content} = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({children}: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? 80 : 280

  return (
    <Layout className="h-screen overflow-hidden w-full">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      <Layout
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        <Header
          className="bg-white border-b border-gray-200 px-4 flex items-center justify-between h-16"
          style={{
            backgroundColor: '#ffffff',
            padding: '0 16px',
            height: '64px',
            lineHeight: '64px',
            width: '100%',
            minWidth: 0,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg bg-white hover:bg-gray-50"
            style={{
              border: 'none',
              boxShadow: 'none',
            }}
          />
          <div className="flex-1" />
          {/* Add any header content here like notifications, user menu, etc. */}
        </Header>

        <Content
          className="bg-gray-50 overflow-auto"
          style={{
            width: '100%',
            minWidth: 0,
            maxWidth: '100%'
          }}
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
