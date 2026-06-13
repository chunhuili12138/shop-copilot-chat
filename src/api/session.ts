// api/session.ts
import axios from 'axios'
import type { Session, Message } from '@/types/chat'
import { useChatStore } from '@/stores/chat'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * 获取带认证的 axios 实例（单例）
 */
let _httpInstance: ReturnType<typeof axios.create> | null = null

function getHttp() {
  if (_httpInstance) return _httpInstance

  _httpInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  })

  // 请求拦截器：统一添加认证 header
  _httpInstance.interceptors.request.use((config) => {
    const store = useChatStore()
    config.headers['Authorization'] = `Bearer-${store.shopId}-${store.token}`
    return config
  })

  // 响应拦截器：统一解包 { success, data, msg } 格式
  _httpInstance.interceptors.response.use(
    (response) => {
      const res = response.data
      if (res && typeof res === 'object' && 'success' in res) {
        if (res.success) {
          return res.data
        }
        throw new Error(res.msg || '请求失败')
      }
      return res
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return _httpInstance
}

/**
 * 获取会话列表
 */
export async function getSessions(): Promise<Session[]> {
  const http = getHttp()
  return http.get('/api/chat/sessions')
}

/**
 * 创建会话
 */
export async function createSession(title?: string): Promise<Session> {
  const http = getHttp()
  return http.post('/api/chat/sessions', { title })
}

/**
 * 删除会话
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const http = getHttp()
  await http.delete(`/api/chat/sessions/${sessionId}`)
}

/**
 * 获取会话历史
 */
export async function getSessionHistory(sessionId: string): Promise<Message[]> {
  const http = getHttp()
  return http.get(`/api/chat/sessions/${sessionId}/messages`)
}
