# 商品管理系统部署方案

## 一、部署环境调研

### 1.1 国内云服务商对比
   
| 云服务商 | 优势 | 劣势 | 推荐指数 |
|---------|------|------|---------|
| **阿里云** | 市场份额最大，生态完善，文档丰富 | 价格相对较高 | ⭐⭐⭐⭐⭐ |
| **腾讯云** | 性价比高，轻量应用服务器便宜 | 文档略逊阿里云 | ⭐⭐⭐⭐ |
| **华为云** | 政企客户首选，安全合规 | 生态相对较弱 | ⭐⭐⭐ |
| **UCloud** | 价格便宜，中小企业友好 | 品牌知名度较低 | ⭐⭐⭐ |

### 1.2 部署方式对比

| 部署方式 | 适用场景 | 月成本估算 | 推荐度 |
|---------|---------|-----------|-------|
| **云服务器 ECS** | 完全控制，灵活配置 | 100-300元 | ⭐⭐⭐⭐⭐ |
| **轻量应用服务器** | 简单应用，快速部署 | 60-120元 | ⭐⭐⭐⭐ |
| **容器服务 K8s** | 微服务架构，需要弹性伸缩 | 200-500元 | ⭐⭐⭐ |
| **Serverless** | 流量波动大，按量付费 | 0-100元 | ⭐⭐ |

### 1.3 MongoDB 部署方案

| 方案 | 月成本 | 优势 | 推荐度 |
|-----|-------|------|-------|
| **云数据库 MongoDB** | 200-500元 | 自动备份、高可用、免运维 | ⭐⭐⭐⭐ |
| **自建 MongoDB** | 0元（含在服务器成本） | 成本低，灵活控制 | ⭐⭐⭐⭐⭐ |
| **MongoDB Atlas** | 免费-200元 | 官方云服务，有免费层 | ⭐⭐⭐ |

---

## 二、推荐方案

### 2.1 方案一：轻量级部署（推荐个人/小团队）

**适合场景**：个人项目、学习测试、小规模使用

| 资源 | 配置 | 月费用 |
|-----|------|-------|
| 腾讯云轻量应用服务器 | 2核2G，4M带宽 | ¥62 |
| 自建 MongoDB | 同服务器部署 | ¥0 |
| 域名（可选） | .com 域名 | ¥55/年 |
| **总计** | | **约 ¥70/月** |

### 2.2 方案二：标准部署（推荐企业/生产环境）

**适合场景**：正式生产环境、需要高可用

| 资源 | 配置 | 月费用 |
|-----|------|-------|
| 阿里云 ECS | 2核4G，5M带宽 | ¥150-200 |
| 云数据库 MongoDB | 1核2G | ¥200 |
| OSS 对象存储 | 40GB | ¥5 |
| 域名 + SSL证书 | .com + 免费SSL | ¥55/年 |
| **总计** | | **约 ¥400/月** |

---

## 三、详细执行步骤（方案一）

### 3.1 购买服务器

**推荐：腾讯云轻量应用服务器**

1. 访问：https://cloud.tencent.com/product/lighthouse
2. 选择配置：
   - 地域：国内最近地域（如广州、上海）
   - 镜像：Ubuntu 22.04 LTS
   - 套餐：2核2G内存，4M带宽
   - 时长：按需选择（新用户有优惠）
3. 完成购买，记录服务器 IP 地址

### 3.2 连接服务器

```bash
# Windows 使用 PowerShell 或 Git Bash
ssh root@你的服务器IP

# 首次连接输入 yes，然后输入密码
```

### 3.3 安装 Node.js

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 安装 Node.js 20
nvm install 20
nvm use 20
node -v  # 验证安装
```

### 3.4 安装 MongoDB

```bash
# 导入 MongoDB 公钥
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 添加 MongoDB 源
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 安装 MongoDB
sudo apt update
sudo apt install -y mongodb-org

# 启动 MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 验证
mongod --version
```

### 3.5 安装 PM2（进程管理）

```bash
npm install -g pm2
pm2 --version
```

### 3.6 上传项目代码

**方式一：Git 拉取（推荐）**

```bash
# 在服务器上
cd /opt
git clone 你的仓库地址
cd commodity-management
```

**方式二：本地打包上传**

```bash
# 在本地 Windows 执行
# 1. 打包后端
cd backend
npm install
npm run build
tar -czvf backend.tar.gz dist node_modules package.json .env

# 2. 打包前端
cd ../frontend
npm install
npm run build
tar -czvf frontend.tar.gz .next node_modules package.json .env.local public

# 3. 上传到服务器（使用 scp 或 SFTP 工具如 WinSCP）
scp backend.tar.gz root@服务器IP:/opt/
scp frontend.tar.gz root@服务器IP:/opt/
```

### 3.7 配置后端

```bash
cd /opt/commodity-management/backend

# 安装依赖（如果没上传 node_modules）
npm install --production

# 创建环境配置
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/commodity-management
JWT_SECRET=你的随机密钥-建议32位以上随机字符串
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
EOF

# 启动后端
pm2 start npm --name "backend" -- run start:prod

# 保存 PM2 配置
pm2 save
pm2 startup  # 按提示执行输出的命令
```

### 3.8 配置前端

```bash
cd /opt/commodity-management/frontend

# 安装依赖（如果没上传 node_modules）
npm install

# 创建环境配置
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://你的服务器IP:3001/api
EOF

# 如果需要重新构建
npm run build

# 启动前端
pm2 start npm --name "frontend" -- start

# 查看运行状态
pm2 status
```

### 3.9 配置 Nginx（可选，推荐）

```bash
# 安装 Nginx
sudo apt install -y nginx

# 创建配置
sudo nano /etc/nginx/sites-available/commodity
```

**Nginx 配置内容：**

```nginx
server {
    listen 80;
    server_name 你的域名或IP;

    # 前端
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/commodity /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3.10 配置防火墙

```bash
# 开放端口
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable

# 如果不使用 Nginx，直接开放应用端口
sudo ufw allow 3000
sudo ufw allow 3001
```

### 3.11 配置 SSL 证书（域名必须）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书（需要域名已解析到服务器）
sudo certbot --nginx -d 你的域名

# 自动续期
sudo systemctl enable certbot.timer
```

---

## 四、常用运维命令

### 4.1 PM2 命令

```bash
pm2 status              # 查看进程状态
pm2 logs                # 查看日志
pm2 logs backend        # 查看后端日志
pm2 restart all         # 重启所有进程
pm2 restart backend     # 重启后端
pm2 stop all            # 停止所有进程
pm2 delete all          # 删除所有进程
```

### 4.2 MongoDB 命令

```bash
# 连接 MongoDB
mongosh

# 查看数据库
show dbs

# 查看集合
use commodity-management
show collections

# 备份数据库
mongodump --db commodity-management --out /backup/

# 恢复数据库
mongorestore --db commodity-management /backup/commodity-management/
```

### 4.3 日志查看

```bash
# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 应用日志
pm2 logs
```

---

## 五、更新部署流程

### 5.1 后端更新

```bash
cd /opt/commodity-management/backend
git pull                    # 拉取最新代码
npm install                 # 安装新依赖（如有）
npm run build               # 构建
pm2 restart backend         # 重启服务
```

### 5.2 前端更新

```bash
cd /opt/commodity-management/frontend
git pull
npm install
npm run build
pm2 restart frontend
```

---

## 六、监控与告警

### 6.1 服务器监控

推荐使用云服务商自带的监控面板，或安装：

```bash
# 安装 htop（进程监控）
sudo apt install htop

# 安装 nethogs（网络监控）
sudo apt install nethogs
```

### 6.2 应用监控

推荐方案：
- **Sentry**：错误监控（免费额度足够）
- **PM2 Plus**：进程监控（付费）
- 自建：Grafana + Prometheus

---

## 七、备份策略

| 备份项 | 频率 | 方式 |
|-------|------|------|
| MongoDB 数据库 | 每天 | crontab + mongodump |
| 项目代码 | 每次更新 | Git 仓库 |
| 配置文件 | 首次配置后 | 手动备份 |

**自动备份脚本：**

```bash
# 创建备份脚本
nano /opt/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backup/$DATE"
mkdir -p $BACKUP_DIR

# 备份 MongoDB
mongodump --db commodity-management --out $BACKUP_DIR/mongodb

# 备份配置
cp /opt/commodity-management/backend/.env $BACKUP_DIR/
cp /opt/commodity-management/frontend/.env.local $BACKUP_DIR/

# 删除7天前的备份
find /backup -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: $DATE"
```

```bash
# 设置定时任务
chmod +x /opt/backup.sh
crontab -e

# 添加以下内容（每天凌晨2点备份）
0 2 * * * /opt/backup.sh >> /var/log/backup.log 2>&1
```

---

## 八、成本估算汇总

| 方案 | 月成本 | 年成本 | 适合场景 |
|-----|-------|-------|---------|
| 轻量部署 | ¥70 | ¥840 | 个人/测试 |
| 标准部署 | ¥400 | ¥4800 | 企业生产 |

---

## 九、注意事项

1. **安全配置**
   - 修改 SSH 默认端口
   - 禁用 root 密码登录，使用密钥登录
   - 定期更新系统补丁

2. **性能优化**
   - 开启 Gzip 压缩
   - 配置静态资源缓存
   - 使用 CDN 加速（如有域名）

3. **数据安全**
   - 定期备份数据库
   - 配置 MongoDB 认证（生产环境必须）
   - 敏感配置不要提交到 Git

---

## 十、快速部署清单

- [ ] 购买云服务器
- [ ] 配置服务器环境（Node.js、MongoDB、PM2）
- [ ] 上传项目代码
- [ ] 配置环境变量
- [ ] 启动应用服务
- [ ] 配置 Nginx 反向代理
- [ ] 配置防火墙
- [ ] 配置 SSL 证书（可选）
- [ ] 配置自动备份
- [ ] 测试访问验证