/**
 * ShopCopilot 店铺助手 - 库入口
 * 用于 UMD 打包，暴露全局方法
 */

import { createApp, type App } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ChatFloat from './components/ChatFloat/index.vue'
import './styles/index.scss'

// 应用实例
let app: App | null = null
let container: HTMLElement | null = null

// 初始化选项
interface InitOptions {
  apiUrl?: string
  token?: string
  shopId?: number
  role?: string
  userName?: string
}

/**
 * 初始化店铺助手
 * @param options 初始化选项
 */
function init(options: InitOptions = {}) {
  // 如果已初始化，先销毁
  if (app) {
    destroy()
  }

  // 创建容器
  container = document.createElement('div')
  container.id = 'shop-copilot-container'
  document.body.appendChild(container)

  // 创建应用
  app = createApp(ChatFloat, {
    apiUrl: options.apiUrl || 'http://localhost:3000',
    token: options.token || '',
    shopId: options.shopId || 0,
    role: options.role || 'guest',
    userName: options.userName || '',
  })

  // 注册插件
  const pinia = createPinia()
  app.use(pinia)
  app.use(ElementPlus)

  // 挂载
  app.mount(container)

  console.log('[ShopCopilot] 初始化完成')
}

/**
 * 显示店铺助手
 */
function show() {
  // 触发显示事件
  window.postMessage({ type: 'shop-copilot:show' }, '*')
}

/**
 * 隐藏店铺助手
 */
function hide() {
  // 触发隐藏事件
  window.postMessage({ type: 'shop-copilot:hide' }, '*')
}

/**
 * 销毁店铺助手
 */
function destroy() {
  if (app) {
    app.unmount()
    app = null
  }
  if (container) {
    container.remove()
    container = null
  }
  console.log('[ShopCopilot] 已销毁')
}

/**
 * 更新配置
 * @param options 新的配置选项
 */
function update(options: Partial<InitOptions>) {
  // 触发更新事件
  window.postMessage({ type: 'shop-copilot:update', data: options }, '*')
}

// 暴露全局 API
declare global {
  interface Window {
    ShopCopilot: {
      init: typeof init
      show: typeof show
      hide: typeof hide
      destroy: typeof destroy
      update: typeof update
    }
  }
}

window.ShopCopilot = {
  init,
  show,
  hide,
  destroy,
  update,
}

// 自动初始化（如果配置了全局变量）
if ((window as any).__SHOP_COPILOT_CONFIG__) {
  init((window as any).__SHOP_COPILOT_CONFIG__)
}

export { init, show, hide, destroy, update }
export type { InitOptions }
