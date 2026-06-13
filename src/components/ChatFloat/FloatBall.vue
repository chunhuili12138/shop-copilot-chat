<template>
  <div
    class="float-ball"
    :class="{ 'is-expanded': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="$emit('click')"
  >
    <div class="ball-inner">
      <img src="/icons/robot.svg" alt="店铺助手" class="robot-icon" />
    </div>
    <div class="pulse-ring"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{
  click: []
}>()

const isHovered = ref(false)
</script>

<style scoped lang="scss">
.float-ball {
  position: fixed;
  right: -20px;
  bottom: 100px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover,
  &.is-expanded {
    right: 0;
  }

  &:hover .ball-inner,
  &.is-expanded .ball-inner {
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.5);
  }
}

.ball-inner {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  transition: box-shadow 0.3s ease;
  z-index: 2;
}

.robot-icon {
  width: 32px;
  height: 32px;
}

.pulse-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2px solid rgba(24, 144, 255, 0.2);
  animation: pulse 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.1;
  }
}
</style>
