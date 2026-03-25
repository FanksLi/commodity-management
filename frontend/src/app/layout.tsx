import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from '@/components/layout/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: '商品管理系统',
  description: '商品管理系统 - 电商后台管理平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: '#1890ff',
                borderRadius: 6,
              },
            }}
          >
            <MainLayout>{children}</MainLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}