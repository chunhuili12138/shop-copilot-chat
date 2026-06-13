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
