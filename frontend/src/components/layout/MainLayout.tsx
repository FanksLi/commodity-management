'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  AppstoreOutlined,
  InboxOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, setToken, setUser } = useAuthStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && !isAuthenticated) {
      setToken(token);
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {}
      }
    }
  }, [isAuthenticated, setToken, setUser]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token && pathname !== '/auth/login') {
        router.push('/auth/login');
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard" prefetch={false}>仪表盘</Link>,
    },
    {
      key: '/products',
      icon: <ShopOutlined />,
      label: <Link href="/products" prefetch={false}>商品管理</Link>,
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: <Link href="/categories" prefetch={false}>分类管理</Link>,
    },
    {
      key: '/inventory',
      icon: <InboxOutlined />,
      label: <Link href="/inventory" prefetch={false}>库存管理</Link>,
    },
    {
      key: '/suppliers',
      icon: <TeamOutlined />,
      label: <Link href="/suppliers" prefetch={false}>供应商管理</Link>,
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link href="/orders" prefetch={false}>订单管理</Link>,
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link href="/users" prefetch={false}>用户管理</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
    }
  };

  if (pathname === '/auth/login') {
    return <>{children}</>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: colorBgContainer,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <h1
              style={{
                margin: 0,
                fontSize: collapsed ? 16 : 18,
                fontWeight: 'bold',
                color: '#1890ff',
              }}
            >
              {collapsed ? '商品' : '商品管理系统'}
            </h1>
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name || '用户'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}