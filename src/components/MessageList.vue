<template>
  <div class="message-list" ref="listRef">
    <div class="message-list-content">
      <!-- 初始加载状态 -->
      <div v-if="initialLoading" class="initial-loading">
        <div class="loading-spinner">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="loading-text">正在加载会话...</div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <div class="empty-text">有什么可以帮您的？</div>
      </div>

      <!-- 消息列表 -->
      <template v-else>
        <MessageItem
          v-for="message in messages"
          :key="message.id"
          :message="message"
          @retry="handleRetry"
        />
      </template>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Message } from '@/types/chat'
import MessageItem from './MessageItem.vue'

const props = defineProps<{
  messages: Message[]
  loading: boolean
  initialLoading?: boolean
}>()

const emit = defineEmits<{
  retry: [message: Message]
}>()

const listRef = ref<HTMLElement>()

function scrollToBottom() {
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  })
}

// 新消息加入时滚动到底部
watch(() => props.messages.length, scrollToBottom)

// 开始加载时滚动
watch(() => props.loading, (val) => {
  if (val) scrollToBottom()
})

// 流式输出时滚动（监听最后一条消息的 content 和 steps 长度变化）
watch(
  () => {
    const last = props.messages[props.messages.length - 1]
    if (!last) return ''
    return last.content + '|' + (last.steps?.length ?? 0)
  },
  scrollToBottom
)

// 处理重试
function handleRetry(message: Message) {
  emit('retry', message)
}
</script>

<style scoped lang="scss">
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--chat-spacing-lg);
}

.message-list-content {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.initial-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--chat-text-placeholder);

  .loading-spinner {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;

    span {
      width: 10px;
      height: 10px;
      background: var(--chat-primary);
      border-radius: 50%;
      animation: loading 1.4s infinite ease-in-out both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }

  .loading-text {
    font-size: 14px;
  }
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--chat-text-placeholder);

  .empty-icon {
    font-size: 48px;
    margin-bottom: var(--chat-spacing-lg);
  }

  .empty-text {
    font-size: 16px;
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: var(--chat-spacing-lg);
}

.loading-dots {
  display: flex;
  gap: 6px;

  span {
    width: 8px;
    height: 8px;
    background: var(--chat-primary);
    border-radius: 50%;
    animation: loading 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
