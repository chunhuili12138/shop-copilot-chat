<template>
  <div class="message-renderer">
    <!-- 结构化数据（图表、表格等），组件内部自带 summary -->
    <component
      v-if="displayComponent"
      :is="displayComponent"
      :data="structuredData"
    />

    <!-- Markdown 类型的结构化数据 -->
    <div
      v-else-if="isMarkdownData"
      class="markdown-body"
      v-html="markdownContent"
    />

    <!-- 普通 Markdown 文本 -->
    <div
      v-else-if="props.message.content"
      class="markdown-body"
      v-html="renderedContent"
    />

    <!-- 有结构化数据但没有对应组件时，由这里显示 summary -->
    <div v-if="!displayComponent && structuredData?.summary" class="renderer-summary">
      <el-icon class="summary-icon"><InfoFilled /></el-icon>
      <span class="summary-text">{{ structuredData.summary }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { renderMarkdown } from '@/utils/markdown'
import { getDisplayComponent } from './index'
import type { Message } from '@/types/chat'

const props = defineProps<{
  message: Message
}>()

// 判断是否是结构化数据
const structuredData = computed(() => {
  // 优先使用后端返回的 structured_data 字段（从历史记录加载时）
  if (props.message.structured_data && typeof props.message.structured_data === 'object') {
    return props.message.structured_data
  }
  
  const content = props.message.content
  
  // 如果内容为空，返回 null
  if (!content) return null
  
  // 尝试解析 JSON
  if (typeof content === 'string') {
    // 只有当内容看起来像 JSON 时才尝试解析
    const trimmed = content.trim()
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (parsed && typeof parsed === 'object' && parsed.display_type) {
          return parsed
        }
      } catch {
        // 不是有效的 JSON，按普通文本处理
      }
    }
  }
  
  // 如果 content 本身就是对象
  if (typeof content === 'object' && content !== null) {
    const obj = content as any
    if (obj.display_type) {
      return obj
    }
  }
  
  return null
})

// 判断是否是 Markdown 类型的结构化数据
const isMarkdownData = computed(() => {
  if (!structuredData.value) return false
  return structuredData.value.display_type === 'markdown'
})

// 获取 Markdown 内容
const markdownContent = computed(() => {
  if (!isMarkdownData.value) return ''
  
  const data = structuredData.value?.data
  if (!data) return ''
  
  // 从 data.content 中获取 Markdown 文本
  const content = data.content || ''
  return renderMarkdown(content)
})

// 获取对应的组件
const displayComponent = computed(() => {
  if (!structuredData.value) return null
  // Markdown 类型不使用组件，直接渲染
  if (structuredData.value.display_type === 'markdown') return null
  return getDisplayComponent(
    structuredData.value.display_type,
    structuredData.value.chart_type
  )
})

// 渲染内容（用户消息纯文本，AI消息 Markdown）
const renderedContent = computed(() => {
  const content = props.message.content
  if (typeof content !== 'string') return ''
  
  // 用户消息：直接返回纯文本，不进行 Markdown 渲染
  if (props.message.role === 'user') {
    return escapeHtml(content)
  }
  
  // AI消息：进行 Markdown 渲染
  // 如果是 JSON 字符串，尝试提取 display_type
  const trimmed = content.trim()
  if (trimmed.startsWith('{') && trimmed.includes('display_type')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (parsed.display_type === 'markdown' && parsed.data?.content) {
        return renderMarkdown(parsed.data.content)
      }
    } catch {
      // 解析失败，按普通文本处理
    }
  }
  return renderMarkdown(content)
})

// HTML 转义函数（防止 XSS）
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
</script>

<style scoped lang="scss">
.message-renderer {
  width: 100%;
}

.renderer-summary {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(24, 144, 255, 0.06);
  border-radius: 8px;
  font-size: 13px;
  color: #4e5969;
  line-height: 1.5;

  .summary-icon {
    flex-shrink: 0;
  }

  .summary-text {
    flex: 1;
  }
}

.markdown-body {
  line-height: 1.6;
  word-break: break-word;

  :deep(p) {
    margin: 0 0 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(ul),
  :deep(ol) {
    margin: 8px 0;
    padding-left: 20px;
  }

  :deep(li) {
    margin: 4px 0;
  }

  :deep(code) {
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: #f6f8fa;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 8px 0;

    code {
      background: transparent;
      padding: 0;
    }
  }

  :deep(blockquote) {
    border-left: 4px solid #1890ff;
    padding-left: 12px;
    margin: 8px 0;
    color: #4e5969;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 8px 0;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    th,
    td {
      border: 1px solid #e5e6eb;
      padding: 8px;
      text-align: left;
      white-space: nowrap;
    }

    th {
      background: #f7f8fa;
      font-weight: 600;
    }
  }

  :deep(img) {
    max-width: 100%;
    border-radius: 4px;
    margin: 8px 0;
  }

  :deep(a) {
    color: #1890ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
