# 构建说明

本项目支持两种构建模式：UMD库构建和标准Web应用构建。

## 构建脚本

- `pnpm build:app` - 构建为标准Web应用，输出到 `dist` 目录
- `pnpm build:lib` - 构建为UMD库，输出到 `dist-lib` 目录
- `pnpm build:prod` - 构建为生产环境的Web应用，输出到 `dist` 目录
- `pnpm build:prod-lib` - 构建为生产环境的UMD库，输出到 `dist-lib` 目录

## UMD库构建

UMD库构建主要用于将ShopCopilot集成到其他项目中。构建完成后，会在 `dist-lib` 目录生成：

- `shop-copilot.umd.cjs` - UMD格式的JavaScript文件
- `shop-copilot.css` - 样式文件

在其他项目中可通过以下方式使用：

```html
<link rel="stylesheet" href="/dist-lib/shop-copilot.css">
<script src="/dist-lib/shop-copilot.umd.cjs"></script>
<script>
  // 初始化悬浮球
  window.ShopCopilot.init({
    apiUrl: 'http://localhost:3000',
    token: 'your-token',
    shopId: 1,
    role: '店长',
    userName: '张三'
  });
</script>
```

## Web应用构建

Web应用构建用于独立部署完整的Web应用。构建完成后，会在 `dist` 目录生成完整的Web应用文件，包括：

- `index.html` - 主页
- `assets` 目录 - 包含CSS和JavaScript文件
- `icons` 目录 - 图标资源

## 部署

- 要部署为独立Web应用，请部署整个 `dist` 目录
- 要在其他项目中集成，请引用 `dist-lib` 目录中的文件