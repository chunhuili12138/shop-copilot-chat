// stores/chat.ts
import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
import type { Message, Session, SSEData, ConfirmData, Step } from '@/types/chat'
import { createSSEConnection, executeConfirm } from '@/api/chat'
import { getSessions, createSession, deleteSession, getSessionHistory } from '@/api/session'

// localStorage key 前缀
const STORAGE_KEY_PREFIX = 'shop_copilot_'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const sessions = ref<Session[]>([])
  const currentSessionId = ref<string | null>(null)
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const isFullscreen = ref(false)
  const showSessionList = ref(true)
  const showQuickQuestions = ref(true)
  const currentConfirm = ref<ConfirmData | null>(null)
  const authError = ref<string | null>(null)  // 认证错误状态

  // 用户信息
  const token = ref('')
  const shopId = ref(0)
  const shopName = ref('')
  const role = ref('')
  const userName = ref('')

  // 计算属性
  const currentSession = computed(() => {
    return sessions.value.find(s => s.id === currentSessionId.value)
  })

  const sortedSessions = computed(() => {
    return [...sessions.value].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  })

  // 获取带店铺隔离的 localStorage key
  function getStorageKey() {
    return `${STORAGE_KEY_PREFIX}session_${shopId.value || 'default'}`
  }

  // 从 localStorage 恢复 currentSessionId
  function restoreSessionId() {
    try {
      const saved = localStorage.getItem(getStorageKey())
      if (saved) {
        currentSessionId.value = saved
      }
    } catch (e) {
      console.warn('恢复会话ID失败:', e)
    }
  }

  // 保存 currentSessionId 到 localStorage
  function saveSessionId(sessionId: string | null) {
    try {
      if (sessionId) {
        localStorage.setItem(getStorageKey(), sessionId)
      } else {
        localStorage.removeItem(getStorageKey())
      }
    } catch (e) {
      console.warn('保存会话ID失败:', e)
    }
  }

  // 监听 currentSessionId 变化，自动保存
  watch(currentSessionId, (newVal) => {
    saveSessionId(newVal)
  })

  // 初始化用户信息
  function initUserInfo(t: string, sid: number, r: string, name: string, sName: string = '') {
    token.value = t
    shopId.value = sid
    role.value = r
    userName.value = name
    shopName.value = sName
  }

  // 加载会话列表（自动恢复最近会话）
  async function loadSessions() {
    try {
      authError.value = null  // 清除之前的错误
      sessions.value = await getSessions()
      
      // 如果有会话，尝试恢复当前会话
      if (sessions.value.length > 0) {
        // 优先使用 localStorage 中保存的会话ID（带店铺隔离）
        const savedSessionId = localStorage.getItem(getStorageKey())
        
        if (savedSessionId && sessions.value.some(s => s.id === savedSessionId)) {
          // localStorage 中的会话仍然存在，恢复它
          await loadHistory(savedSessionId)
        } else {
          // 恢复最近的会话（使用副本排序，避免修改原数组）
          const sorted = [...sessions.value].sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )
          await loadHistory(sorted[0].id)
        }
      } else {
        // 没有会话，清空当前状态
        currentSessionId.value = null
        messages.value = []
      }
    } catch (error: any) {
      console.error('加载会话列表失败:', error)
      // 检查是否是认证错误
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        authError.value = '店铺助手接口认证失败，请重新登录'
      } else if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        authError.value = '店铺助手接口认证失败，请重新登录'
      }
    }
  }

  // 创建会话
  async function handleCreateSession() {
    try {
      const session = await createSession()
      sessions.value.unshift(session)
      currentSessionId.value = session.id
      messages.value = []
    } catch (error) {
      console.error('创建会话失败:', error)
    }
  }

  // 删除会话
  async function handleDeleteSession(sessionId: string) {
    try {
      await deleteSession(sessionId)
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
      
      if (currentSessionId.value === sessionId) {
        // 删除的是当前会话，切换到下一个或清空
        currentSessionId.value = sessions.value[0]?.id || null
        if (currentSessionId.value) {
          await loadHistory(currentSessionId.value)
        } else {
          messages.value = []
          // 清理 localStorage（带店铺隔离）
          localStorage.removeItem(getStorageKey())
        }
      }
    } catch (error) {
      console.error('删除会话失败:', error)
    }
  }

  // 加载会话历史
  async function loadHistory(sessionId: string) {
    try {
      currentSessionId.value = sessionId
      messages.value = await getSessionHistory(sessionId)
    } catch (error) {
      console.error('加载会话历史失败:', error)
    }
  }

  // 发送消息
  async function sendMessage(message: string, imageUrl?: string) {
    if (!currentSessionId.value) {
      await handleCreateSession()
    }

    isLoading.value = true
    currentConfirm.value = null

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      images: imageUrl ? [imageUrl] : [],
      timestamp: Date.now(),
    }
    messages.value.push(userMessage)

    // 创建助手消息（用于流式更新）
    const assistantMessage = reactive<Message>({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      steps: [],
      timestamp: Date.now(),
    })
    messages.value.push(assistantMessage)

    // 打字机效果：缓冲 SSE 文本，每 100ms 渲染一小段
    let pendingBuffer = ''
    let typewriterTimer: ReturnType<typeof setInterval> | null = null

    function startTypewriter() {
      if (typewriterTimer) return
      typewriterTimer = setInterval(() => {
        if (pendingBuffer.length === 0) return
        const chunkSize = 5
        const charsToShow = Math.min(chunkSize, pendingBuffer.length)
        assistantMessage.content += pendingBuffer.slice(0, charsToShow)
        pendingBuffer = pendingBuffer.slice(charsToShow)
      }, 100)
    }

    function flushBuffer() {
      if (typewriterTimer) {
        clearInterval(typewriterTimer)
        typewriterTimer = null
      }
      if (pendingBuffer.length > 0) {
        assistantMessage.content += pendingBuffer
        pendingBuffer = ''
      }
    }

    // 连接 SSE
    const eventSource = createSSEConnection(message, currentSessionId.value!, imageUrl)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEData
        
        switch (data.type) {
          case 'thinking':
          case 'processing':
          case 'tool_result':
            assistantMessage.steps!.push({
              type: data.type as Step['type'],
              content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
              step: data.step,
              done: data.done,
            })
            break
          case 'answer':
            if (typeof data.content === 'string') {
              pendingBuffer += data.content
              startTypewriter()
            }
            break
          case 'data':
            flushBuffer()
            if (typeof data.content === 'object') {
              assistantMessage.content = JSON.stringify(data.content)
            } else if (typeof data.content === 'string') {
              assistantMessage.content = data.content
            }
            break
          case 'confirm':
            currentConfirm.value = data.content as ConfirmData
            break
          case 'done':
            flushBuffer()
            // 标记最后一步为已完成
            if (assistantMessage.steps && assistantMessage.steps.length > 0) {
              const lastStep = assistantMessage.steps[assistantMessage.steps.length - 1]
              lastStep.done = true
            }
            isLoading.value = false
            eventSource.close()
            break
          case 'error':
            flushBuffer()
            // 标记最后一步为已完成
            if (assistantMessage.steps && assistantMessage.steps.length > 0) {
              const lastStep = assistantMessage.steps[assistantMessage.steps.length - 1]
              lastStep.done = true
            }
            assistantMessage.content = `❌ ${data.content}`
            isLoading.value = false
            eventSource.close()
            break
        }
      } catch (e) {
        console.error('SSE parse error:', e)
      }
    }

    eventSource.onerror = (event) => {
      // 网络错误时关闭连接，避免自动重连导致异常状态
      console.error('SSE error:', event)
      isLoading.value = false
      eventSource.close()
      
      // 检查是否是认证错误（401）
      if (eventSource.readyState === EventSource.CLOSED) {
        // 尝试加载会话列表来检测认证状态
        getSessions().catch((error) => {
          if (error?.response?.status === 401 || error?.message?.includes('401')) {
            authError.value = '店铺助手接口认证失败，请重新登录'
          }
        })
      }
    }
  }

  // 确认操作
  async function handleConfirm(approved: boolean) {
    if (!currentConfirm.value) return

    if (approved) {
      isLoading.value = true
      
      try {
        const result = await executeConfirm(
          currentConfirm.value.action,
          currentConfirm.value.params
        )
        
        const resultMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: result.message || '操作完成',
          timestamp: Date.now(),
        }
        messages.value.push(resultMessage)
      } catch (error) {
        console.error('确认操作失败:', error)
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '操作失败，请重试',
          timestamp: Date.now(),
        }
        messages.value.push(errorMessage)
      } finally {
        isLoading.value = false
      }
    }

    currentConfirm.value = null
  }

  // 切换全屏
  function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value
  }

  // 切换会话列表
  function toggleSessionList() {
    showSessionList.value = !showSessionList.value
  }

  return {
    // 状态
    sessions,
    currentSessionId,
    messages,
    isLoading,
    isFullscreen,
    showSessionList,
    showQuickQuestions,
    currentConfirm,
    authError,
    token,
    shopId,
    shopName,
    role,
    userName,
    
    // 计算属性
    currentSession,
    sortedSessions,
    
    // 方法
    initUserInfo,
    loadSessions,
    handleCreateSession,
    handleDeleteSession,
    loadHistory,
    sendMessage,
    handleConfirm,
    toggleFullscreen,
    toggleSessionList,
    restoreSessionId,
    saveSessionId,
  }
})
