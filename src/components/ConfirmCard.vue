<template>
  <div class="confirm-card">
    <div class="confirm-header">
      <span class="icon">⚠️</span>
      <span class="title">{{ confirmData.title }}</span>
    </div>
    <div class="confirm-body">
      <div class="message">{{ confirmData.message }}</div>
      <div class="details">
        <div
          v-for="(value, key) in confirmData.details"
          :key="key"
          class="detail-item"
        >
          <span class="label">{{ key }}:</span>
          <span class="value">{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="confirm-footer">
      <button class="cancel-btn" @click="$emit('confirm', false)">
        取消
      </button>
      <button class="confirm-btn" @click="$emit('confirm', true)">
        确认
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConfirmData } from '@/types/chat'

defineProps<{
  confirmData: ConfirmData
}>()

defineEmits<{
  confirm: [approved: boolean]
}>()
</script>

<style scoped lang="scss">
.confirm-card {
  margin: 0 var(--chat-spacing-lg) var(--chat-spacing-md);
  background: white;
  border: 1px solid var(--chat-warning);
  border-radius: var(--chat-radius-lg);
  overflow: hidden;
}

.confirm-header {
  display: flex;
  align-items: center;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  background: #fff7e6;
  border-bottom: 1px solid #ffe7ba;

  .icon {
    font-size: 18px;
  }

  .title {
    font-size: 14px;
    font-weight: 500;
    color: #d46b08;
  }
}

.confirm-body {
  padding: var(--chat-spacing-lg);
}

.message {
  font-size: 14px;
  color: var(--chat-text);
  margin-bottom: var(--chat-spacing-md);
}

.details {
  background: var(--chat-bg);
  padding: var(--chat-spacing-md);
  border-radius: var(--chat-radius);
}

.detail-item {
  display: flex;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-xs) 0;
  font-size: 13px;

  .label {
    color: var(--chat-text-secondary);
    min-width: 80px;
  }

  .value {
    color: var(--chat-text);
  }
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  border-top: 1px solid var(--chat-border-light);
}

.cancel-btn,
.confirm-btn {
  padding: var(--chat-spacing-sm) var(--chat-spacing-lg);
  border-radius: var(--chat-radius);
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background: white;
  border: 1px solid var(--chat-border);
  color: var(--chat-text);

  &:hover {
    background: var(--chat-bg);
  }
}

.confirm-btn {
  background: var(--chat-primary);
  border: 1px solid var(--chat-primary);
  color: white;

  &:hover {
    background: var(--chat-primary-dark);
  }
}
</style>
