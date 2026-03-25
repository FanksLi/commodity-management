# 商品管理系统

一个完整的电商后台商品管理系统，包含商品管理、库存管理、供应商管理、订单管理等核心功能。

## 技术栈

### 后端
- NestJS + TypeScript
- MongoDB + Mongoose
- JWT 认证
- Swagger API 文档

### 前端
- Next.js 14 + TypeScript
- Ant Design 5.x
- Zustand 状态管理
- Axios HTTP 客户端

## 项目结构

```
commodity-management/
├── backend/                # NestJS 后端
│   ├── src/
│   │   ├── modules/        # 业务模块
│   │   │   ├── auth/       # 认证模块
│   │   │   ├── user/       # 用户管理
│   │   │   ├── product/    # 商品管理
│   │   │   ├── category/   # 分类管理
│   │   │   ├── inventory/  # 库存管理
│   │   │   ├── supplier/   # 供应商管理
│   │   │   └── order/      # 订单管理
│   │   ├── common/         # 公共模块
│   │   └── config/         # 配置文件
│   └── package.json
│
├── frontend/               # Next.js 前端
│   ├── src/
│   │   ├── app/           # 页面路由
│   │   ├── components/    # 组件
│   │   ├── services/      # API 服务
│   │   ├── stores/        # 状态管理
│   │   └── types/         # 类型定义
│   └── package.json
│
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 18
- MongoDB >= 6.0
- npm 或 yarn

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 配置环境变量

后端 `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/commodity-management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
```

前端 `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 启动 MongoDB

确保 MongoDB 服务正在运行：
```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
```

### 启动后端服务

```bash
cd backend
npm run start:dev
```

后端服务将在 http://localhost:3001 启动
API 文档地址: http://localhost:3001/api/docs

### 启动前端服务

```bash
cd frontend
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 默认管理员账户

首次启动后，系统会自动创建默认管理员账户：
- 用户名: `admin`
- 密码: `123456`

## 功能模块

### 用户管理
- 用户增删改查
- 角色权限管理
- 密码修改

### 商品管理
- 商品信息管理
- 多规格 SKU 支持
- 商品分类管理
- 商品状态流转

### 库存管理
- 入库/出库管理
- 库存盘点
- 库存预警
- 库存流水记录

### 供应商管理
- 供应商档案
- 供应商评级
- 合作信息管理

### 订单管理
- 采购订单
- 销售订单
- 退货订单
- 订单状态流转

## API 文档

启动后端服务后，访问 http://localhost:3001/api/docs 查看 Swagger API 文档。

## 开发说明

### 后端开发
```bash
cd backend
npm run start:dev    # 开发模式
npm run build        # 构建
npm run start:prod   # 生产模式
```

### 前端开发
```bash
cd frontend
npm run dev          # 开发模式
npm run build        # 构建
npm run start        # 生产模式
```

## 许可证

MIT