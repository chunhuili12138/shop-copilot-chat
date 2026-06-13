<template>
  <div class="chat-panel" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- 头部 -->
    <div class="panel-header">
      <div class="header-left">
        <img src="/icons/robot.svg" alt="店铺助手" class="header-icon" />
        <span class="header-title">店铺助手</span>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="$emit('fullscreen')" :title="isFullscreen ? '退出全屏' : '全屏'">
          <img src="/icons/fullscreen.svg" alt="全屏" class="action-icon" />
        </button>
        <button class="action-btn close-btn" @click="$emit('close')" title="关闭">
          <img src="/icons/close.svg" alt="关闭" class="action-icon" />
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="panel-body">
      <iframe
        ref="iframeRef"
        :src="chatUrl"
        class="chat-iframe"
        @load="handleIframeLoad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  chatUrl: string
  isFullscreen: boolean
}>()

const emit = defineEmits<{
  close: []
  fullscreen: []
  iframeLoad: [iframe: HTMLIFrameElement]
}>()

const iframeRef = ref<HTMLIFrameElement>()

function handleIframeLoad() {
  if (iframeRef.value) {
    emit('iframeLoad', iframeRef.value)
  }
}
</script>

<style scoped lang="scss">
.chat-panel {
  position: fixed;
  right: 20px;
  bottom: 100px;
  width: 500px;
  height: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-fullscreen {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    right: 0;
    bottom: 0;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  color: white;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  width: 28px;
  height: 28px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.action-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.close-btn {
  &:hover {
    background: rgba(245, 63, 63, 0.8);
  }
}

.panel-body {
  flex: 1;
  overflow: hidden;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
