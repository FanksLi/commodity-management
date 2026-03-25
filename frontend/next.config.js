/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
   // 1. 启用 SWC 压缩
  swcMinify: true,
  
  // 2. 配置按需加载
  modularizeImports: {
    'antd': {
      transform: 'antd/lib/{{member}}',
    },
    '@ant-design/icons': {
      transform: '@ant-design/icons/lib/icons/{{member}}',
    },
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },
  
  // 3. 优化图片
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // 4. 编译优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 5. 实验性功能（提升性能）
  experimental: {
    optimizeCss: true,  // 优化 CSS
    optimizePackageImports: ['antd', 'lodash'], // 优化包导入
  },
};

module.exports = nextConfig;