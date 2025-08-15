# Cloudflare Workers 部署指南

## 📦 项目概述

这是一个基于 Mastra 框架的 AI 聊天应用，使用 SiliconFlow AI 服务和天气功能，专为 Cloudflare Workers 运行时优化。

## 🚀 部署到 Cloudflare Workers

### 1. 前置准备

#### 安装 Wrangler CLI（如果尚未安装）
```bash
npm install -g wrangler@latest
# 或使用项目本地版本
npm install
```

#### 登录 Cloudflare
```bash
npx wrangler auth login
```

### 2. 配置环境变量

#### 本地开发环境
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入真实的 API Keys
```

#### Cloudflare Workers 密钥配置
```bash
# 设置 SiliconFlow API Key
npx wrangler secret put SILICONFLOW_API_KEY

# 设置天气 API Key（如果使用）
npx wrangler secret put WEATHER_API_KEY
```

### 3. 创建 KV 命名空间（可选，用于持久化存储）

```bash
# 创建生产环境 KV 命名空间
npx wrangler kv:namespace create "MASTRA_KV"

# 创建预览环境 KV 命名空间
npx wrangler kv:namespace create "MASTRA_KV" --preview

# 将返回的 ID 更新到 wrangler.jsonc 中的相应字段
```

### 4. 创建 D1 数据库（可选，替代内存存储）

```bash
# 创建 D1 数据库
npx wrangler d1 create ai-chat-mastra-db

# 将返回的数据库 ID 更新到 wrangler.jsonc 中
```

### 5. 构建和部署

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 部署到 Cloudflare Workers
npm run deploy
```

### 6. 验证部署

部署成功后，您将获得一个 Workers URL，类似：
```
https://ai-chat-mastra.your-subdomain.workers.dev
```

测试 API 端点：
```bash
curl https://ai-chat-mastra.your-subdomain.workers.dev/health
```

## 🔧 配置说明

### wrangler.jsonc 配置文件

主要配置项：
- `name`: Workers 服务名称
- `main`: 入口文件路径
- `compatibility_date`: 兼容性日期
- `compatibility_flags`: 启用 Node.js 兼容性
- `vars`: 环境变量
- `kv_namespaces`: KV 存储绑定
- `d1_databases`: D1 数据库绑定

### 环境变量

| 变量名 | 描述 | 设置方式 |
|--------|------|----------|
| `SILICONFLOW_API_KEY` | SiliconFlow API 密钥 | `wrangler secret put` |
| `WEATHER_API_KEY` | 天气服务 API 密钥 | `wrangler secret put` |
| `NODE_ENV` | 环境标识 | `wrangler.jsonc` |

### 持久化存储选项

1. **KV 存储**: 适用于键值对数据
2. **D1 数据库**: 适用于关系型数据
3. **内存存储**: 仅在单次请求中有效

## 📊 监控和调试

### 查看日志
```bash
# 实时查看日志
npx wrangler tail

# 查看特定时间范围的日志
npx wrangler tail --since 10m
```

### 本地开发
```bash
# 本地开发服务器
npm run dev

# 本地 Workers 模拟环境
npx wrangler dev
```

### 性能监控
- 访问 Cloudflare Dashboard → Workers & Pages
- 查看请求统计、错误率、响应时间

## 🔐 安全注意事项

1. **API 密钥安全**
   - 使用 `wrangler secret` 命令设置敏感信息
   - 不要在代码中硬编码 API 密钥
   - 定期轮换 API 密钥

2. **访问控制**
   - 考虑添加 API 认证
   - 实施请求速率限制
   - 验证输入数据

3. **CORS 配置**
   - 根据需要配置跨域访问
   - 限制允许的域名

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查 Node.js 版本
   node --version  # 应该 >= 20.9.0
   
   # 清理并重新安装依赖
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **部署失败**
   ```bash
   # 检查 wrangler 配置
   npx wrangler deploy --dry-run
   
   # 验证账户权限
   npx wrangler whoami
   ```

3. **运行时错误**
   ```bash
   # 查看详细错误日志
   npx wrangler tail --format pretty
   
   # 本地调试
   npx wrangler dev --local
   ```

4. **环境变量未生效**
   ```bash
   # 列出所有密钥
   npx wrangler secret list
   
   # 重新设置密钥
   npx wrangler secret put SILICONFLOW_API_KEY
   ```

### 调试技巧

1. **添加日志**
   ```typescript
   console.log('Environment:', process.env.NODE_ENV);
   console.log('API Key exists:', !!process.env.SILICONFLOW_API_KEY);
   ```

2. **错误处理**
   ```typescript
   try {
     // 您的代码
   } catch (error) {
     console.error('Error:', error);
     return new Response(JSON.stringify({ error: error.message }), {
       status: 500,
       headers: { 'Content-Type': 'application/json' }
     });
   }
   ```

## 📚 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Mastra 框架文档](https://mastra.ai/)
- [SiliconFlow API 文档](https://docs.siliconflow.cn/)
- [Cloudflare KV 文档](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)

## 💡 最佳实践

1. **性能优化**
   - 使用 KV 缓存频繁访问的数据
   - 实施请求去重
   - 优化冷启动时间

2. **错误处理**
   - 实施全局错误处理
   - 返回有意义的错误信息
   - 记录错误用于调试

3. **代码组织**
   - 模块化代码结构
   - 分离业务逻辑和框架代码
   - 使用 TypeScript 提高代码质量

4. **部署策略**
   - 使用预览环境测试
   - 实施渐进式部署
   - 监控部署后的性能
