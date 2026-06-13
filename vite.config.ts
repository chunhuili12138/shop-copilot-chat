import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      // 解决浏览器环境中 process is not defined 的问题
      'process.env': {},
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/file': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
    build: {
      // 库模式打包
      lib: {
        entry: resolve(__dirname, 'src/lib.ts'),
        name: 'ShopCopilot',
        fileName: 'shop-copilot',
        formats: ['umd'],
      },
      rollupOptions: {
        output: {
          // 导出 CSS
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'shop-copilot.css'
            return assetInfo.name || 'asset'
          },
        },
      },
      outDir: 'dist',
      sourcemap: false,
      // CSS 代码拆分
      cssCodeSplit: false,
    },
  }
})
