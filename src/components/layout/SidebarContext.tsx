'use client';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface SidebarContextType {
  collapsed: boolean;
  openKeys: string[];
  selectedKeys: string[];
  scrollTop: number;
  isClient: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setOpenKeys: (keys: string[]) => void;
  setSelectedKeys: (keys: string[]) => void;
  setScrollTop: (scrollTop: number) => void;
  setIsClient: (isClient: boolean) => void;
  handleOpenChange: (keys: string[]) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const handleOpenChange = useCallback((keys: string[]) => {
    // Allow multiple menus to be open - just set the keys directly
    setOpenKeys(keys);
  }, []);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const value = {
    collapsed,
    openKeys,
    selectedKeys,
    scrollTop,
    isClient,
    setCollapsed,
    setOpenKeys,
    setSelectedKeys,
    setScrollTop,
    setIsClient,
    handleOpenChange,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
