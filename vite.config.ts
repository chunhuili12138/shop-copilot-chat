import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:8000'
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env': {},
      'process.env.NODE_ENV': JSON.stringify(mode),
      '__API_BASE_URL__': JSON.stringify(apiBaseUrl),
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
      lib: {
        entry: resolve(__dirname, 'src/lib.ts'),
        name: 'ShopCopilot',
        fileName: 'shop-copilot',
        formats: ['umd'],
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'shop-copilot.css'
            return assetInfo.name || 'asset'
          },
        },
      },
      outDir: 'dist',
      sourcemap: false,
      cssCodeSplit: false,
    },
  }
})
