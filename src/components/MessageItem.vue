<template>
  <div class="message-item" :class="[message.role]">
    <!-- 头像 -->
    <div class="avatar">
      <img v-if="message.role === 'user'" src="/icons/user.svg" alt="用户" class="avatar-icon" />
      <img v-else src="/icons/bot.svg" alt="助手" class="avatar-icon" />
    </div>

    <!-- 内容 -->
    <div class="content">
      <!-- 步骤卡片 -->
      <StepCard
        v-if="message.steps?.length"
        :steps="message.steps"
      />

      <!-- 消息内容（支持结构化数据和 Markdown） -->
      <div v-if="message.content" class="message-content">
        <MessageRenderer :message="message" />
      </div>

      <!-- 错误重试按钮 -->
      <div v-if="isError" class="error-actions">
        <button class="retry-btn" @click="handleRetry">
          <el-icon><RefreshRight /></el-icon> 重试
        </button>
      </div>

      <!-- 图片 -->
      <div v-if="message.images?.length" class="images">
        <el-image
          v-for="(img, index) in message.images"
          :key="index"
          :src="getImageFullUrl(img)"
          :preview-src-list="message.images.map(i => getImageFullUrl(i))"
          :initial-index="index"
          fit="cover"
          class="message-image"
        />
      </div>

      <!-- 文件附件 -->
      <div v-if="message.files?.length" class="files">
        <div
          v-for="(file, index) in message.files"
          :key="index"
          class="file-card"
          @click="openFile(file.url)"
          :title="'点击下载 ' + file.name"
        >
          <span class="file-icon" :style="{ background: getFileColor(file.name) }">
            {{ getFileExt(file.name) }}
          </span>
          <div class="file-info">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatSize(file.size) }}</span>
          </div>
        </div>
      </div>

      <!-- 时间 -->
      <div class="time">{{ formattedTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import { getImageFullUrl, getFileExt, getFileColor, formatSize } from '@/utils/file'
import type { Message } from '@/types/chat'
import StepCard from './StepCard.vue'
import { MessageRenderer } from './DataDisplay'

const props = defineProps<{
  message: Message
}>()

const emit = defineEmits<{
  retry: [message: Message]
}>()

// 判断是否是错误消息
const isError = computed(() => {
  if (props.message.role !== 'assistant') return false
  
  // 检查内容是否以 ❌ 开头
  if (props.message.content?.startsWith('❌')) return true
  
  // 检查步骤中是否有 error 类型
  if (props.message.steps?.some(s => s.type === 'error')) return true
  
  return false
})

// 格式化时间
const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
})

// 打开/下载文件
function openFile(url: string) {
  const fullUrl = getImageFullUrl(url)
  window.open(fullUrl, '_blank', 'noopener')
}

// 重试
function handleRetry() {
  emit('retry', props.message)
}
</script>

<style scoped lang="scss">
.message-item {
  display: flex;
  gap: var(--chat-spacing-md);
  margin-bottom: var(--chat-spacing-lg);

  &.user {
    flex-direction: row-reverse;

    .content {
      background: var(--chat-bg-user);
    }
  }

  &.assistant {
    .content {
      background: var(--chat-bg-assistant);
      max-width: 85%;
    }
  }
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--chat-radius-full);
  background: var(--chat-bg);
  flex-shrink: 0;
}

.avatar-icon {
  width: 24px;
  height: 24px;
}

.content {
  max-width: 70%;
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  border-radius: var(--chat-radius-lg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-content {
  width: 100%;
}

.error-actions {
  margin-top: var(--chat-spacing-sm);
  padding-top: var(--chat-spacing-sm);
  border-top: 1px solid var(--chat-border-light);
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--chat-primary-light);
  color: var(--chat-primary);
  border: 1px solid var(--chat-primary);
  border-radius: var(--chat-radius);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: var(--chat-primary);
    color: white;
  }
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: var(--chat-spacing-sm);
  margin-top: var(--chat-spacing-sm);

  .message-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: var(--chat-radius);
    cursor: pointer;
  }
}

.files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #93c5fd;
    background: #eff6ff;
  }

  .file-icon {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .file-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .file-name {
    font-size: 13px;
    color: #1f2937;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 11px;
    color: #9ca3af;
  }
}

.time {
  font-size: 12px;
  color: var(--chat-text-placeholder);
  margin-top: var(--chat-spacing-xs);
}
</style>
