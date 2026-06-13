// api/chat.ts
import { useChatStore } from '@/stores/chat'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * 创建 SSE 连接
 * 注意：EventSource 不支持自定义 Header，所以 Token 通过 URL 参数传递
 */
export function createSSEConnection(
  message: string,
  sessionId: string,
  imageUrl?: string
): EventSource {
  const store = useChatStore()
  
  const params = new URLSearchParams({
    message,
    session_id: sessionId,
    token: store.token || '',
    shop_id: String(store.shopId || ''),
  })
  
  if (imageUrl) {
    params.append('image_url', imageUrl)
  }
  
  return new EventSource(`${BASE_URL}/api/chat/stream?${params.toString()}`)
}

/**
 * 发送消息（POST 方式，支持文件）
 */
export async function sendMessage(
  message: string,
  sessionId: string,
  file?: File
): Promise<Response> {
  const store = useChatStore()
  
  const formData = new FormData()
  formData.append('message', message)
  formData.append('session_id', sessionId)
  
  if (file) {
    formData.append('file', file)
  }
  
  return fetch(`${BASE_URL}/api/chat/stream`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer-${store.shopId}-${store.token}`,
    },
    body: formData,
  })
}

/**
 * 执行确认操作
 */
export async function executeConfirm(
  action: string,
  params: Record<string, any>
): Promise<any> {
  const store = useChatStore()
  
  const response = await fetch(`${BASE_URL}/api/chat/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer-${store.shopId}-${store.token}`,
    },
    body: JSON.stringify({ action, params }),
  })
  
  return response.json()
}
