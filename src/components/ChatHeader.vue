<template>
  <div class="chat-header">
    <div class="title">
      <span class="icon">💬</span>
      <span>店铺助手</span>
    </div>
    <div class="actions">
      <button @click="$emit('toggle-session')" title="会话列表">
        <span>📋</span>
      </button>
      <button @click="$emit('fullscreen')" title="全屏">
        <span>{{ isFullscreen ? '🔲' : '⛶' }}</span>
      </button>
      <button @click="$emit('close')" title="关闭">
        <span>✕</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()
const isFullscreen = computed(() => store.isFullscreen)

defineEmits<{
  close: []
  fullscreen: []
  'toggle-session': []
}>()
</script>

<style scoped lang="scss">
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--chat-spacing-lg);
  background: var(--chat-primary);
  color: white;
  cursor: move;
  user-select: none;

  .title {
    display: flex;
    align-items: center;
    gap: var(--chat-spacing-sm);
    font-size: 16px;
    font-weight: 500;

    .icon {
      font-size: 20px;
    }
  }

  .actions {
    display: flex;
    gap: var(--chat-spacing-sm);

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: var(--chat-radius);
      font-size: 16px;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}
</style>
