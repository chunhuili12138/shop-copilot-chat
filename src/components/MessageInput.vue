<template>
  <div class="message-input">
    <!-- 工具栏 -->
    <div class="toolbar">
      <button @click="triggerUpload" title="上传文件">
        <img src="/icons/attach.svg" alt="上传" class="toolbar-icon" />
      </button>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <textarea
        ref="textareaRef"
        v-model="text"
        @keydown.enter.exact="handleSend"
        :placeholder="actualPlaceholder"
        rows="1"
        :disabled="loading || disabled"
      />
      <button
        class="send-btn"
        @click="handleSend"
        :disabled="!text.trim() || loading || disabled"
      >
        <img src="/icons/send.svg" alt="发送" class="send-icon" />
      </button>
    </div>

    <!-- 隐藏的文件上传 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*,.txt,.md,.pdf,.xlsx,.xls,.docx,.doc,.csv"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()
const text = ref('')
const textareaRef = ref<HTMLTextAreaElement>()
const fileInputRef = ref<HTMLInputElement>()

const loading = computed(() => store.isLoading)

const props = defineProps<{
  quickQuestionText?: string
  disabled?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  send: [message: string]
  upload: [file: File]
}>()

// 快捷问题点击后填入输入框
watch(() => props.quickQuestionText, (val) => {
  if (val) {
    text.value = val
    nextTick(() => {
      textareaRef.value?.focus()
      adjustTextareaHeight()
    })
  }
})

// 计算实际 placeholder
const actualPlaceholder = computed(() => {
  return props.placeholder || '输入消息... (Enter 发送，Shift+Enter 换行)'
})

// 自动调整 textarea 高度
function adjustTextareaHeight() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

// 监听输入内容变化，自动调整高度
watch(text, () => {
  nextTick(adjustTextareaHeight)
})

// 发送消息
function handleSend() {
  if (!text.value.trim() || loading.value) return

  emit('send', text.value.trim())
  text.value = ''

  // 重置 textarea 高度
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
}

// 触发文件上传
function triggerUpload() {
  fileInputRef.value?.click()
}

// 处理文件选择
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    emit('upload', file)
    target.value = ''
  }
}
</script>

<style scoped lang="scss">
.message-input {
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  background: white;
  border-top: 1px solid var(--chat-border-light);
}

.toolbar {
  display: flex;
  gap: var(--chat-spacing-sm);
  margin-bottom: var(--chat-spacing-sm);

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--chat-border);
    padding: 0;
    border-radius: var(--chat-radius);
    cursor: pointer;

    &:hover {
      background: var(--chat-bg);
    }
  }
}

.toolbar-icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.input-area {
  display: flex;
  gap: var(--chat-spacing-sm);

  textarea {
    flex: 1;
    padding: var(--chat-spacing-sm) var(--chat-spacing-md);
    border: 1px solid var(--chat-border);
    border-radius: var(--chat-radius);
    resize: none;
    font-size: 14px;
    line-height: 1.5;
    font-family: inherit;
    min-height: 40px;
    max-height: 120px;

    &:focus {
      outline: none;
      border-color: var(--chat-primary);
    }

    &:disabled {
      background: var(--chat-bg);
      cursor: not-allowed;
    }
  }

  .send-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    height: 40px;
    background: var(--chat-primary);
    color: white;
    border: none;
    border-radius: var(--chat-radius);
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;

    &:hover:not(:disabled) {
      background: var(--chat-primary-dark);
    }

    &:disabled {
      background: #d9d9d9;
      cursor: not-allowed;
    }
  }

  .send-icon {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
  }
}
</style>
