<template>
  <div class="code-wrapper">
    <div class="code-header">
      <div class="code-title" v-if="data.title">{{ data.title }}</div>
      <button class="copy-btn" @click="handleCopy">
        <span v-if="!copied">📋 复制</span>
        <span v-else>✅ 已复制</span>
      </button>
    </div>
    <div class="code-content">
      <pre><code>{{ data.data.content }}</code></pre>
    </div>
    <div class="code-summary" v-if="data.summary">
      <span class="summary-icon">💡</span>
      <span class="summary-text">{{ data.summary }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  data: {
    title?: string
    data: {
      language?: string
      content: string
    }
    summary?: string
  }
}>()

const copied = ref(false)

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.data.data.content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped lang="scss">
.code-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f7f8fa;
  border-bottom: 1px solid #e5e6eb;
}

.code-title {
  font-size: 13px;
  font-weight: 600;
  color: #4e5969;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  font-size: 12px;
  color: #4e5969;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f1f3;
    border-color: #c9cdd4;
  }
}

.code-content {
  padding: 16px;
  background: #1e1e1e;
  overflow-x: auto;

  pre {
    margin: 0;
    padding: 0;
  }

  code {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #d4d4d4;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.code-summary {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 0;
  padding: 10px 16px;
  background: #f6f8fa;
  font-size: 13px;
  color: #4e5969;
  line-height: 1.5;

  .summary-icon {
    flex-shrink: 0;
  }
}
</style>
