import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:8000'
  
  // 检查构建模式
  const isLibBuild = process.env.BUILD_TYPE === 'lib';
  
  let buildConfig = {};
  
  if (isLibBuild) {
    // 库模式配置 - 用于其他项目集成
    buildConfig = {
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
    };
  } else {
    // 应用模式配置 - 用于独立部署
    buildConfig = {
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          assetFileNames: 'assets/[name].[hash].[ext]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
        },
      },
    };
  }
  
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
      ...buildConfig,
      outDir: isLibBuild ? 'dist-lib' : 'dist',
      sourcemap: false,
      cssCodeSplit: false,
    },
  }
})
