# ShopCopilot 店铺助手集成指南

## 集成方式

将打包后的 `shop-copilot.umd.js` 和 `shop-copilot.css` 文件放到后台管理系统的 `public` 目录下，然后在页面中引入。

## 文件放置

```
shop-operate-system-ui/
├── public/
│   ├── shop-copilot.umd.js    # 打包后的 JS 文件
│   └── shop-copilot.css       # 打包后的 CSS 文件
└── src/
    └── layout/
        └── index.vue          # 引入店铺助手
```

## 引入方式

### 方式1：HTML 引入

```html
<!-- public/index.html -->
<head>
  <link rel="stylesheet" href="/shop-copilot.css">
</head>
<body>
  <script src="/shop-copilot.umd.js"></script>
</body>
```

### 方式2：Vue 组件引入

```vue
<!-- src/layout/index.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useUserStoreHook } from '@/store/modules/user'
import { getToken, getCurrentShopId } from '@/utils/auth'

// 引入店铺助手
import '/public/shop-copilot.umd.js'

const userStore = useUserStoreHook()

onMounted(() => {
  // 初始化店铺助手
  if (window.ShopCopilot) {
    window.ShopCopilot.init({
      apiUrl: import.meta.env.VITE_CHAT_URL || 'http://localhost:3000',
      token: getToken()?.accessToken || '',
      shopId: getCurrentShopId() || 0,
      role: userStore.roles[0] || 'guest',
      userName: userStore.nickname || userStore.username,
    })
  }
})

onUnmounted(() => {
  // 销毁店铺助手
  window.ShopCopilot?.destroy()
})
</script>
```

## API 说明

### 初始化

```javascript
window.ShopCopilot.init({
  apiUrl: 'http://localhost:3000',  // 店铺助手地址
  token: 'your-token',              // 用户 Token
  shopId: 1,                        // 店铺 ID
  role: '店长',                      // 用户角色
  userName: '张三'                   // 用户名称
})
```

### 显示/隐藏

```javascript
window.ShopCopilot.show()   // 显示悬浮球
window.ShopCopilot.hide()   // 隐藏悬浮球
```

### 销毁

```javascript
window.ShopCopilot.destroy()  // 销毁店铺助手
```

### 更新配置

```javascript
window.ShopCopilot.update({
  token: 'new-token',
  shopId: 2
})
```

## 打包命令

```bash
cd shop-copilot-chat

# 安装依赖
npm install

# 打包
npm run build

# 打包后的文件在 dist/ 目录下
# - shop-copilot.umd.js
# - shop-copilot.es.js
# - shop-copilot.css
```

## 注意事项

1. **Vue 版本**：店铺助手使用 Vue3，宿主应用也需要使用 Vue3
2. **样式隔离**：店铺助手使用 Shadow DOM 或 scoped 样式，不会影响宿主应用
3. **Token 刷新**：当宿主应用的 Token 刷新后，需要调用 `update()` 更新
4. **店铺切换**：当用户切换店铺后，需要调用 `update()` 更新 shopId
