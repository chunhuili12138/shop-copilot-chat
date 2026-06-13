// api/chat.ts
import { useChatStore } from '@/stores/chat'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * SSE 消息回调类型
 */
export interface SSECallbacks {
  onMessage: (data: any) => void
  onError: (error: Error) => void
}

/**
 * 创建 SSE 连接（POST + ReadableStream）
 * Token 通过 Authorization Header 传递，不再暴露在 URL 中
 */
export function createSSEConnection(
  message: string,
  sessionId: string,
  callbacks: SSECallbacks,
  imageUrl?: string
): { close: () => void } {
  const store = useChatStore()
  const controller = new AbortController()

  const body: Record<string, string> = {
    message,
    session_id: sessionId,
  }
  if (imageUrl) {
    body.image_url = imageUrl
  }

  fetch(`${BASE_URL}/api/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer-${store.shopId}-${store.token}`,
    },
    body: JSON.stringify(body),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const errText = await response.text()
        callbacks.onError(new Error(`HTTP ${response.status}: ${errText}`))
        return
      }
      const reader = response.body?.getReader()
      if (!reader) {
        callbacks.onError(new Error('ReadableStream not supported'))
        return
      }
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim()
              if (jsonStr) {
                try {
                  callbacks.onMessage(JSON.parse(jsonStr))
                } catch {
                  // skip malformed JSON
                }
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          callbacks.onError(err)
        }
      }
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        callbacks.onError(err)
      }
    })

  return { close: () => controller.abort() }
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
  
  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText)
    throw new Error(`操作失败 (${response.status}): ${errText}`)
  }
  
  return response.json()
}
