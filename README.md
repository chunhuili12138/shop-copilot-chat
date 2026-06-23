# ShopCopilot 店铺助手

![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen)
![Vite](https://img.shields.io/badge/Vite-7.1-blue)
![ECharts](https://img.shields.io/badge/ECharts-5.5-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

店铺智能助手前端 - 基于 AI Agent 的店铺运营辅助系统

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | ^3.5.13 | 前端框架 |
| Vite | ^7.1.12 | 构建工具 |
| TypeScript | ~5.6.2 | 类型系统 |
| ECharts | ^6.1.0 | 图表库 |
| Element Plus | ^2.9.1 | UI 组件库 |
| Pinia | ^2.3.0 | 状态管理 |
| Vitest | ^4.1.8 | 测试框架 |

---

## 项目结构

```
shop-copilot-chat/
├── src/
│   ├── api/                      # API 接口
│   │   ├── chat.ts               # 聊天接口（POST + ReadableStream）
│   │   ├── session.ts            # 会话管理（axios 单例 + 响应解包）
│   │   └── upload.ts             # 文件上传
│   ├── components/
│   │   ├── ChatFloat/            # 悬浮球组件
│   │   ├── DataDisplay/          # 数据显示组件（图表/表格/卡片）
│   │   ├── ChatWindow.vue        # 聊天窗口
│   │   ├── MessageList.vue       # 消息列表
│   │   ├── MessageItem.vue       # 消息项（el-image 预览）
│   │   ├── MessageInput.vue      # 输入框（自动高度）
│   │   ├── StepCard.vue          # 步骤卡片
│   │   ├── SessionList.vue       # 会话列表
│   │   ├── QuickQuestions.vue    # 快捷问题
│   │   └── ConfirmCard.vue       # 确认框（防重复点击）
│   ├── stores/
│   │   └── chat.ts               # 聊天状态管理
│   ├── stores/__tests__/
│   │   └── chat.test.ts          # Store 单元测试
│   ├── types/
│   │   └── chat.ts               # 类型定义
│   ├── styles/                   # 样式
│   ├── App.vue                   # 根组件
│   ├── main.ts                   # 入口文件（开发模式）
│   └── lib.ts                    # 库入口（UMD 打包 + postMessage 监听）
├── vitest.config.ts              # 测试配置
├── vite.config.ts                # Vite 配置（mode 动态 NODE_ENV）
├── tsconfig.json
├── package.json
└── README.md
```

---

## 快速开始

### 环境要求

- Node.js: ^20.19.0 || >=22.13.0
- pnpm: >=9

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 构建 UMD 库（用于嵌入）

```bash
pnpm build
# 输出：dist/shop-copilot.umd.js
# 输出：dist/shop-copilot.css
```

### 运行测试

```bash
pnpm test
```

---

## 安全机制

### Token 传递

SSE 连接使用 `fetch + ReadableStream`，Token 通过 `Authorization` Header 传递，**不再暴露在 URL 中**。

```
POST /api/chat/stream
Authorization: Bearer-{shopId}-{token}
Content-Type: application/json
```

### DOMPurify

Markdown 渲染使用 DOMPurify 过滤 XSS，`target="_blank"` 链接自动添加 `rel="noopener noreferrer"`。

---

## 功能特性

### 1. 悬浮球集成

- 右下角悬浮球，鼠标悬停展开
- 支持全屏模式
- UMD 库模式，通过 `window.ShopCopilot.init()` 初始化
- postMessage API 支持 show/hide/update

### 2. 数据可视化

| 组件 | 用途 | 触发场景 |
|------|------|----------|
| 折线图 | 趋势分析 | "本月营收趋势" |
| 柱状图 | 对比分析 | "套餐销量对比" |
| 饼图 | 占比分析 | "顾客来源占比" |
| 仪表盘 | 单一指标 | "目标完成率" |
| 漏斗图 | 转化分析 | "顾客转化率" |
| 雷达图 | 多维度对比 | "店铺综合评分" |
| 表格 | 列表数据 | "顾客列表" |
| 统计卡片 | 关键指标 | "今日概况" |
| 排行榜 | 排名数据 | "热销套餐TOP5" |
| 时间线 | 操作记录 | "今日操作记录" |
| 键值对 | 详情信息 | "顾客详情" |
| 代码块 | SQL 查询 | "生成的SQL" |

### 3. 流式对话

- POST + ReadableStream 替代 EventSource
- 打字机效果（100ms 间隔逐字输出）
- 步骤卡片展示 AI 思考过程
- 确认框支持 HITL 审批

### 4. 会话管理

- 多轮对话支持
- 会话历史保存（localStorage + 后端持久化）
- 会话创建/删除
- 按 shopId 隔离存储

### 5. 角色权限

- 超管/店长/导玩员/仓管/财务 五种角色
- 确认操作前校验角色权限
- 认证失败友好提示

---

## 集成到后台管理系统

### 方式1：UMD 引入（推荐）

```html
<link rel="stylesheet" href="/shop-copilot.css">
<script src="/shop-copilot.umd.js"></script>
```

```javascript
window.ShopCopilot.init({
  apiUrl: 'http://localhost:3000',
  token: 'your-token',
  shopId: 1,
  role: '店长',
  userName: '张三'
})
```

### 方式2：postMessage 控制

```javascript
// 显示/隐藏
window.postMessage({ type: 'shop-copilot:show' }, '*')
window.postMessage({ type: 'shop-copilot:hide' }, '*')

// 更新配置
window.postMessage({ type: 'shop-copilot:update', data: { token: 'new-token' } }, '*')
```

---

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/chat/stream` | POST | 聊天流式接口（SSE） |
| `/api/chat/confirm` | POST | 确认操作接口 |
| `/api/chat/sessions` | GET | 获取会话列表 |
| `/api/chat/sessions` | POST | 创建会话 |
| `/api/chat/sessions/{id}` | DELETE | 删除会话 |
| `/api/chat/sessions/{id}/messages` | GET | 获取会话历史 |

---

## 配置说明

### 环境变量

```env
# 后端 API 地址
VITE_API_BASE_URL=http://localhost:8000

# 店铺助手地址（用于 iframe）
VITE_CHAT_URL=http://localhost:3000
```

### Vite 配置

`vite.config.ts` 使用函数式配置，`NODE_ENV` 动态读取 `mode` 参数，不再硬编码。

---

## 测试

```bash
# 运行测试
pnpm test

# 监听模式
pnpm test:watch
```

测试覆盖：
- Store 初始化、会话管理、排序、localStorage 持久化
- SSE 连接取消、确认操作

---

## 更新日志

### v0.4.0 (2026-06-13)

**安全修复**
- SSE 连接从 EventSource (GET + URL token) 改为 fetch + ReadableStream (POST + Header)
- executeConfirm 添加 response.ok 检查

**稳定性修复**
- 修复打字机定时器内存泄漏，新增 cancelCurrentSSE()
- 删除未使用的 restoreSessionId() 死代码
- session.ts axios 单例 + 拦截器统一解包响应

**UX 改进**
- MessageInput textarea 自动高度调整
- ConfirmCard 防重复点击（loading 状态）
- SessionList 删除按钮 emoji → Element Plus 图标
- MessageItem 图片预览改用 el-image
- lib.ts 添加 postMessage 监听，destroy 清理事件监听器

**构建优化**
- vite.config.ts NODE_ENV 动态读取 mode
- 删除死代码 utils/sse.ts

**测试**
- 新增 Vitest 配置 + 12 个 Store 单元测试

### v1.0 (2026-06-01)
- 初始版本

---

## License

MIT
