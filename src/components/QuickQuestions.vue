<template>
  <div class="quick-questions">
    <div class="questions-title">快捷问题</div>
    <div class="questions-list">
      <button
        v-for="question in questions"
        :key="question.id"
        class="question-btn"
        @click="$emit('select', question.text)"
      >
        <span class="question-icon">{{ question.icon }}</span>
        <span class="question-text">{{ question.text }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuickQuestion } from '@/types/chat'

defineEmits<{
  select: [question: string]
}>()

const questions: QuickQuestion[] = [
  { id: '1', text: '本月营收是多少？', icon: '💰', category: '查询' },
  { id: '2', text: '库存不足的物料有哪些？', icon: '📦', category: '查询' },
  { id: '3', text: '今天的排班表是什么？', icon: '📅', category: '查询' },
  { id: '4', text: '本月热销套餐是什么？', icon: '🔥', category: '查询' },
  { id: '5', text: '分析本月经营情况', icon: '📊', category: '分析' },
  { id: '6', text: '查询顾客张三的信息', icon: '👤', category: '查询' },
]
</script>

<style scoped lang="scss">
.quick-questions {
  padding: var(--chat-spacing-lg);
}

.questions-title {
  font-size: 14px;
  color: var(--chat-text-secondary);
  margin-bottom: var(--chat-spacing-md);
}

.questions-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--chat-spacing-sm);
}

.question-btn {
  display: flex;
  align-items: center;
  gap: var(--chat-spacing-xs);
  padding: var(--chat-spacing-sm) var(--chat-spacing-md);
  background: white;
  border: 1px solid var(--chat-border);
  border-radius: var(--chat-radius-full);
  cursor: pointer;
  font-size: 13px;
  color: var(--chat-text);
  transition: all 0.2s;

  &:hover {
    border-color: var(--chat-primary);
    color: var(--chat-primary);
    background: var(--chat-primary-light);
  }

  .question-icon {
    font-size: 14px;
  }

  .question-text {
    white-space: nowrap;
  }
}
</style>
