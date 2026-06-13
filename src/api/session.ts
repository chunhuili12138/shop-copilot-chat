// api/session.ts
import axios from 'axios'
import type { Session, Message } from '@/types/chat'
import { useChatStore } from '@/stores/chat'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * 获取带认证的 axios 实例
 */
function getHttp() {
  const store = useChatStore()
  
  return axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'Authorization': `Bearer-${store.shopId}-${store.token}`,
    },
  })
}

/**
 * 获取会话列表
 */
export async function getSessions(): Promise<Session[]> {
  const http = getHttp()
  const response = await http.get('/api/chat/sessions')
  return response.data
}

/**
 * 创建会话
 */
export async function createSession(title?: string): Promise<Session> {
  const http = getHttp()
  const response = await http.post('/api/chat/sessions', { title })
  return response.data
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
  const response = await http.get(`/api/chat/sessions/${sessionId}/messages`)
  return response.data
}
