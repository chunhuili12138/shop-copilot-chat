<template>
  <div class="chat-float">
    <!-- 悬浮球 -->
    <FloatBall
      v-if="!isPanelVisible"
      @click="togglePanel"
    />

    <!-- 聊天面板 -->
    <ChatPanel
      v-else
      :chat-url="chatUrl"
      :is-fullscreen="isFullscreen"
      @close="closePanel"
      @fullscreen="toggleFullscreen"
      @iframe-load="handleIframeLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import FloatBall from './FloatBall.vue'
import ChatPanel from './ChatPanel.vue'

// Props
const props = defineProps<{
  apiUrl?: string
  token?: string
  shopId?: number
  role?: string
  userName?: string
  shopName?: string
}>()

// 状态
const isPanelVisible = ref(false)
const isFullscreen = ref(false)
const iframeRef = ref<HTMLIFrameElement | null>(null)

// 店铺助手地址
const chatUrl = computed(() => {
  return props.apiUrl || 'http://localhost:3000'
})

// 监听店铺切换
watch(
  () => props.shopId,
  (newVal, oldVal) => {
    if (newVal !== oldVal && isPanelVisible.value) {
      sendInitMessage()
    }
  }
)

// 切换面板
function togglePanel() {
  isPanelVisible.value = !isPanelVisible.value
}

// 关闭面板
function closePanel() {
  isPanelVisible.value = false
  isFullscreen.value = false
}

// 切换全屏
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

// iframe 加载完成
function handleIframeLoad(iframe: HTMLIFrameElement) {
  iframeRef.value = iframe
  sendInitMessage()
}

// 发送初始化消息
function sendInitMessage() {
  if (!iframeRef.value) return

  iframeRef.value.contentWindow?.postMessage(
    {
      type: 'init',
      token: props.token || '',
      shopId: props.shopId || 0,
      role: props.role || 'guest',
      userName: props.userName || '',
      shopName: props.shopName || '',
    },
    '*'
  )
}

// 监听 iframe 消息
function handleMessage(event: MessageEvent) {
  if (event.data?.type === 'close') {
    closePanel()
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped lang="scss">
.chat-float {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
</style>
