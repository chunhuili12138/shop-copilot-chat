<template>
  <div class="session-list">
    <div class="session-header">
      <span class="title">会话列表</span>
      <button @click="$emit('create')" class="create-btn" title="新建会话">
        <span>+</span>
      </button>
    </div>

    <div class="session-content">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="session-item"
        :class="{ active: session.id === currentId }"
        @click="$emit('select', session.id)"
      >
        <div class="session-title">{{ session.title || '新会话' }}</div>
        <div class="session-meta">
          <span class="session-count">{{ session.message_count }} 条消息</span>
          <button
            @click.stop="$emit('delete', session.id)"
            class="delete-btn"
            title="删除会话"
          >
            <el-icon :size="14"><Delete /></el-icon>
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="sessions.length === 0" class="empty-state">
        <div class="empty-text">暂无会话</div>
        <button @click="$emit('create')" class="create-btn-text">
          新建会话
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import type { Session } from '@/types/chat'

defineProps<{
  sessions: Session[]
  currentId: string | null
}>()

defineEmits<{
  select: [sessionId: string]
  create: []
  delete: [sessionId: string]
}>()
</script>

<style scoped lang="scss">
.session-list {
  width: 240px;
  background: var(--chat-bg-sidebar);
  border-right: 1px solid var(--chat-border-light);
  display: flex;
  flex-direction: column;
}

.session-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  border-bottom: 1px solid var(--chat-border-light);

  .title {
    font-size: 14px;
    font-weight: 500;
    color: var(--chat-text);
  }

  .create-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--chat-primary);
    color: white;
    border: none;
    border-radius: var(--chat-radius);
    cursor: pointer;
    font-size: 18px;

    &:hover {
      background: var(--chat-primary-dark);
    }
  }
}

.session-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--chat-spacing-sm);
}

.session-item {
  padding: var(--chat-spacing-md);
  border-radius: var(--chat-radius);
  cursor: pointer;
  margin-bottom: var(--chat-spacing-xs);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &.active {
    background: var(--chat-primary-light);
  }
}

.session-title {
  font-size: 14px;
  color: var(--chat-text);
  margin-bottom: var(--chat-spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.session-count {
  font-size: 12px;
  color: var(--chat-text-placeholder);
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--chat-radius);
  font-size: 14px;
  opacity: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
}

.session-item:hover .delete-btn {
  opacity: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--chat-spacing-xl);
  color: var(--chat-text-placeholder);

  .empty-text {
    margin-bottom: var(--chat-spacing-md);
  }

  .create-btn-text {
    background: transparent;
    border: 1px solid var(--chat-primary);
    color: var(--chat-primary);
    padding: var(--chat-spacing-xs) var(--chat-spacing-md);
    border-radius: var(--chat-radius);
    cursor: pointer;
    font-size: 13px;

    &:hover {
      background: var(--chat-primary-light);
    }
  }
}
</style>
