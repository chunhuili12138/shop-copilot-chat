# ShopCopilot 店铺助手

![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen)
![Vite](https://img.shields.io/badge/Vite-7.1-blue)
![ECharts](https://img.shields.io/badge/ECharts-5.5-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

店铺智能助手 - 基于 AI Agent 的店铺运营辅助系统前端

## 项目简介

ShopCopilot 是一款面向店铺运营场景的智能助手，为店长、导玩员、仓管、财务提供智能问答、数据查询、经营分析等服务。

### 核心功能

- **智能问答**：基于 RAG 的知识库问答
- **数据查询**：自然语言查询经营数据
- **工具调用**：23+ 个业务工具
- **数据可视化**：图表、表格、卡片等多种展示方式
- **悬浮球集成**：一键嵌入后台管理系统

### 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | 3.5.22 | 前端框架 |
| Vite | 7.1.12 | 构建工具 |
| TypeScript | 5.6 | 类型系统 |
| ECharts | 5.5 | 图表库 |
| Element Plus | 2.11 | UI 组件库 |
| Pinia | 3.0 | 状态管理 |

---

## 项目结构

```
shop-copilot-chat/
├── public/
│   └── icons/                    # 图标文件
├── src/
│   ├── api/                      # API 接口
│   │   ├── chat.ts               # 聊天接口
│   │   ├── session.ts            # 会话管理
│   │   └── upload.ts             # 文件上传
│   ├── components/
│   │   ├── ChatFloat/            # 悬浮球组件
│   │   │   ├── index.vue         # 主组件
│   │   │   ├── FloatBall.vue     # 悬浮球
│   │   │   └── ChatPanel.vue     # 聊天面板
│   │   ├── DataDisplay/          # 数据显示组件
│   │   │   ├── LineChart.vue     # 折线图
│   │   │   ├── BarChart.vue      # 柱状图
│   │   │   ├── PieChart.vue      # 饼图
│   │   │   ├── GaugeChart.vue    # 仪表盘
│   │   │   ├── FunnelChart.vue   # 漏斗图
│   │   │   ├── RadarChart.vue    # 雷达图
│   │   │   ├── DataTable.vue     # 表格
│   │   │   ├── StatCard.vue      # 统计卡片
│   │   │   ├── RankList.vue      # 排行榜
│   │   │   ├── Timeline.vue      # 时间线
│   │   │   ├── KeyValueList.vue  # 键值对
│   │   │   ├── CodeBlock.vue     # 代码块
│   │   │   └── MessageRenderer.vue # 消息渲染器
│   │   ├── ChatWindow.vue        # 聊天窗口
│   │   ├── ChatHeader.vue        # 头部
│   │   ├── MessageList.vue       # 消息列表
│   │   ├── MessageItem.vue       # 消息项
│   │   ├── MessageInput.vue      # 输入框
│   │   ├── StepCard.vue          # 步骤卡片
│   │   ├── SessionList.vue       # 会话列表
│   │   ├── QuickQuestions.vue    # 快捷问题
│   │   └── ConfirmCard.vue       # 确认框
│   ├── stores/                   # 状态管理
│   │   └── chat.ts               # 聊天状态
│   ├── types/                    # 类型定义
│   │   └── chat.ts               # 聊天类型
│   ├── utils/                    # 工具函数
│   │   ├── markdown.ts           # Markdown 渲染
│   │   └── sse.ts                # SSE 工具
│   ├── styles/                   # 样式
│   │   ├── variables.scss        # 变量
│   │   └── index.scss            # 主样式
│   ├── App.vue                   # 根组件
│   ├── main.ts                   # 入口文件（开发模式）
│   └── lib.ts                    # 库入口（UMD 打包）
├── docker/                       # Docker 配置
│   ├── Dockerfile
│   └── docker-compose.yml
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
├── package.json                  # 依赖配置
├── README.md                     # 项目说明
└── INTEGRATION.md                # 集成指南
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

访问 http://localhost:3000

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

---

## 功能特性

### 1. 悬浮球集成

- 右下角悬浮球，类似 360 风格
- 鼠标悬停展开，点击打开聊天面板
- 支持全屏模式
- 支持拖拽移动

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

### 3. 智能路由

- 自动判断任务类型
- 知识问答 → RAG
- 数据查询 → NL2SQL
- 工具调用 → Tool
- 复杂任务 → Supervisor

### 4. 会话管理

- 多轮对话支持
- 会话历史保存
- 会话创建/删除

### 5. 快捷问题

预设常见问题，一键提问：
- 本月营收是多少？
- 库存不足的物料有哪些？
- 今天的排班表是什么？
- 本月热销套餐是什么？
- 分析本月经营情况

---

## 集成到后台管理系统

### 方式1：UMD 引入（推荐）

```html
<!-- public/index.html -->
<link rel="stylesheet" href="/shop-copilot.css">
<script src="/shop-copilot.umd.js"></script>
```

```javascript
// 初始化
window.ShopCopilot.init({
  apiUrl: 'http://localhost:3000',
  token: 'your-token',
  shopId: 1,
  role: '店长',
  userName: '张三'
})
```

### 方式2：CDN 引入

```html
<script src="https://cdn.example.com/shop-copilot.umd.js"></script>
```

详细集成指南请参考 [INTEGRATION.md](./INTEGRATION.md)

---

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/chat/stream` | GET (SSE) | 聊天流式接口 |
| `/api/chat/stream` | POST | 聊天接口（支持文件） |
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

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: 'src/lib.ts',
      name: 'ShopCopilot',
      fileName: 'shop-copilot',
      formats: ['umd', 'es'],
    },
  },
})
```

---

## 开发指南

### 添加新的数据展示组件

1. 在 `src/components/DataDisplay/` 创建组件
2. 在 `src/components/DataDisplay/index.ts` 注册组件
3. 在 `MessageRenderer.vue` 添加组件映射
4. 在后端 `app/formatter/data_formatter.py` 添加组件描述

### 添加新的快捷问题

编辑 `src/components/QuickQuestions.vue`：

```typescript
const questions: QuickQuestion[] = [
  { id: '1', text: '本月营收是多少？', icon: '💰', category: '查询' },
  // 添加新问题...
]
```

---

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t shop-copilot-chat .

# 运行容器
docker run -p 3000:80 shop-copilot-chat
```

### Docker Compose

```bash
docker-compose up -d
```

---

## 常见问题

### 1. 跨域问题

确保后端 API 已配置 CORS，或使用 Vite 代理：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

### 2. Token 过期

当 Token 过期时，需要调用 `update()` 更新：

```javascript
window.ShopCopilot.update({ token: 'new-token' })
```

### 3. 图表不显示

确保已安装 ECharts 依赖：

```bash
pnpm add echarts vue-echarts
```

---

## License

MIT
