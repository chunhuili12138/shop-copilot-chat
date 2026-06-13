<template>
  <div class="step-card">
    <!-- 步骤列表 -->
    <div
      v-for="(step, index) in displaySteps"
      :key="index"
      class="step-item"
      :class="[step.type, { 'is-loading': isLoadingStep(step) }]"
    >
      <div class="step-icon">
        <!-- 加载动画 -->
        <span v-if="isLoadingStep(step)" class="loading-icon">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
        <!-- Element Plus 图标 -->
        <el-icon v-else-if="step.type === 'thinking'"><ChatDotRound /></el-icon>
        <el-icon v-else-if="step.type === 'plan'"><List /></el-icon>
        <el-icon v-else-if="step.type === 'processing'"><Loading /></el-icon>
        <el-icon v-else-if="step.type === 'tool_result'"><Tools /></el-icon>
        <el-icon v-else-if="step.type === 'answer'"><CircleCheck /></el-icon>
        <el-icon v-else-if="step.type === 'error'"><CircleClose /></el-icon>
        <el-icon v-else><InfoFilled /></el-icon>
      </div>
      <div class="step-content">
        <div class="step-label">{{ step.step }}</div>
        <div class="step-text">{{ step.content }}</div>
      </div>
    </div>

    <!-- 折叠/展开按钮 -->
    <div v-if="steps.length > maxDisplay" class="step-toggle">
      <button @click="isExpanded = !isExpanded" class="toggle-btn">
        <span v-if="isExpanded">收起步骤</span>
        <span v-else>展开全部 {{ steps.length }} 个步骤</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  ChatDotRound, 
  List, 
  Loading, 
  Tools, 
  CircleCheck, 
  CircleClose, 
  InfoFilled 
} from '@element-plus/icons-vue'
import type { Step } from '@/types/chat'

const props = defineProps<{
  steps: Step[]
}>()

const isExpanded = ref(false)
const maxDisplay = 3

// 显示的步骤
const displaySteps = computed(() => {
  if (isExpanded.value || props.steps.length <= maxDisplay) {
    return props.steps
  }
  // 只显示最后 maxDisplay 个步骤
  return props.steps.slice(-maxDisplay)
})

// 判断是否是加载状态
function isLoadingStep(step: Step): boolean {
  // 如果是最后一个步骤，且类型是 thinking 或 processing，且 done 为 false
  const lastIndex = props.steps.length - 1
  const stepIndex = props.steps.indexOf(step)
  return (
    stepIndex === lastIndex &&
    (step.type === 'thinking' || step.type === 'processing') &&
    !step.done
  )
}
</script>

<style scoped lang="scss">
.step-card {
  margin-bottom: var(--chat-spacing-sm);
}

.step-item {
  display: flex;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-xs) 0;
  font-size: 13px;

  &.thinking {
    .step-icon {
      color: var(--chat-primary);
    }
    .step-label {
      color: var(--chat-primary);
    }
  }

  &.processing {
    .step-icon {
      color: var(--chat-warning);
    }
    .step-label {
      color: var(--chat-warning);
    }
  }

  &.tool_result {
    .step-icon {
      color: var(--chat-success);
    }
    .step-label {
      color: var(--chat-success);
    }
  }

  &.error {
    .step-icon {
      color: var(--chat-error);
    }
    .step-label {
      color: var(--chat-error);
    }
  }

  &.is-loading {
    .step-label {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

.step-icon {
  flex-shrink: 0;
  font-size: 14px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 加载动画
.loading-icon {
  display: flex;
  gap: 3px;
  align-items: center;

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    animation: bounce 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-label {
  font-weight: 500;
  margin-bottom: 2px;
}

.step-text {
  color: var(--chat-text-secondary);
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
}

.step-toggle {
  padding-top: var(--chat-spacing-xs);
}

.toggle-btn {
  background: transparent;
  border: none;
  color: var(--chat-primary);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    text-decoration: underline;
  }
}
</style>
