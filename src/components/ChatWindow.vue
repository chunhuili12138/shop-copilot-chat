<template>
  <div class="chat-window" :class="{ fullscreen: store.isFullscreen }">
    <!-- 二级顶部栏 -->
    <div class="chat-toolbar">
      <div class="toolbar-left">
        <button class="session-toggle" @click="store.toggleSessionList">
          <img src="/icons/sidebar.svg" alt="会话" class="toggle-icon" />
        </button>
        <span class="chat-title">{{ firstQuestion || '店铺助手' }}</span>
      </div>
      <div class="toolbar-right">
        <span class="shop-name" v-if="store.shopName">
          <span class="label">店铺:</span>{{ store.shopName }}
        </span>
        <span class="user-name" v-if="store.userName">
          <span class="label">用户:</span>{{ store.userName }}
        </span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="chat-body">
      <!-- 会话列表 -->
      <SessionList
        v-if="store.showSessionList"
        :sessions="store.sortedSessions"
        :current-id="store.currentSessionId"
        @select="store.loadHistory"
        @create="store.handleCreateSession"
        @delete="store.handleDeleteSession"
      />

      <!-- 聊天主区域 -->
      <div class="chat-main">
        <!-- 消息列表 -->
        <MessageList
          :messages="store.messages"
          :loading="store.isLoading"
          :initial-loading="initialLoading"
          @retry="handleRetry"
        />

        <!-- 确认框 -->
        <ConfirmCard
          v-if="store.currentConfirm"
          :confirm-data="store.currentConfirm"
          @confirm="(approved, formData) => store.handleConfirm(approved, formData)"
        />

        <!-- 多选列表 -->
        <SelectCard
          v-if="store.currentSelect"
          :select-data="store.currentSelect"
          @confirm="(selectedIds, formData) => store.handleSelect(selectedIds, formData)"
          @cancel="store.currentSelect = null"
        />

        <!-- 快捷问题 -->
        <QuickQuestions
          v-if="store.showQuickQuestions && store.messages.length === 0 && !store.authError"
          @select="handleQuickQuestion"
        />

        <!-- 认证失败提示 -->
        <div v-if="store.authError" class="auth-error-banner">
          <el-icon><WarningFilled /></el-icon>
          <span>{{ store.authError }}</span>
          <button class="dismiss-btn" @click="store.authError = null">×</button>
        </div>

        <!-- 输入框 -->
        <MessageInput
          :disabled="!!store.authError"
          :placeholder="store.authError ? '认证失败，无法发送消息' : '输入您的问题...'"
          :quick-question-text="quickQuestionText"
          @send="handleSend"
          @upload="handleUpload"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { useChatStore } from '@/stores/chat'
import type { Message } from '@/types/chat'
import SessionList from './SessionList.vue'
import MessageList from './MessageList.vue'
import ConfirmCard from './ConfirmCard.vue'
import SelectCard from './SelectCard.vue'
import QuickQuestions from './QuickQuestions.vue'
import MessageInput from './MessageInput.vue'

const store = useChatStore()

// 快捷问题文本（点击后填入输入框，不直接发送）
const quickQuestionText = ref('')
const initialLoading = ref(true)  // 初始加载状态

// 计算第一个问题
const firstQuestion = computed(() => {
  const userMessage = store.messages.find(m => m.role === 'user')
  if (userMessage?.content) {
    const content = userMessage.content
    return content.length > 20 ? content.substring(0, 20) + '...' : content
  }
  return ''
})

// 处理发送消息
function handleSend(message: string) {
  store.sendMessage(message)
}

// 处理文件上传
function handleUpload(file: File) {
  // TODO: 实现文件上传
  console.log('上传文件:', file)
}

// 处理快捷问题
function handleQuickQuestion(question: string) {
  quickQuestionText.value = question
}

// 处理重试
function handleRetry(message: Message) {
  // 找到对应的用户消息
  const messageIndex = store.messages.indexOf(message)
  if (messageIndex > 0) {
    const userMessage = store.messages[messageIndex - 1]
    if (userMessage.role === 'user') {
      // 删除错误消息和用户消息
      store.messages.splice(messageIndex - 1, 2)
      // 重新发送
      store.sendMessage(userMessage.content)
    }
  }
}

// 监听父窗口消息
function handleMessage(event: MessageEvent) {
  if (event.data?.type === 'init') {
    const { token, shopId, role, userName, shopName } = event.data
    store.initUserInfo(token, shopId, role, userName, shopName)
    store.loadSessions().finally(() => {
      initialLoading.value = false
    })
    
    // 小面板状态下默认关闭会话列表
    if (!store.isFullscreen) {
      store.showSessionList = false
    }
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  
  // 如果不是 iframe，直接加载
  if (window.parent === window) {
    store.loadSessions().finally(() => {
      initialLoading.value = false
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped lang="scss">
.chat-window {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--chat-bg);
  overflow: hidden;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
  }
}

.chat-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  background: white;
  border-bottom: 1px solid var(--chat-border-light);
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.session-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  flex-shrink: 0;

  &:hover {
    background: var(--chat-bg);
  }
}

.toggle-icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.chat-title {
  font-size: 13px;
  color: var(--chat-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shop-name,
.user-name {
  font-size: 12px;
  color: var(--chat-text-secondary);
  white-space: nowrap;

  .label {
    color: var(--chat-text-placeholder);
    margin-right: 2px;
  }
}

.chat-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.auth-error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 0 12px 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 13px;
  flex-shrink: 0;

  .el-icon {
    flex-shrink: 0;
    font-size: 16px;
  }

  span {
    flex: 1;
  }

  .dismiss-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: transparent;
    border: none;
    color: #dc2626;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
    flex-shrink: 0;

    &:hover {
      background: #fecaca;
    }
  }
}
</style>
