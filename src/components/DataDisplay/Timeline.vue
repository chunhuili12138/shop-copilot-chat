<template>
  <div class="timeline-wrapper">
    <div class="timeline-title">{{ data.title }}</div>
    <div class="timeline-list">
      <div
        v-for="(item, index) in data.data.items"
        :key="index"
        class="timeline-item"
      >
        <div class="timeline-time">{{ item.time }}</div>
        <div class="timeline-dot" :style="getDotStyle(item.action)"></div>
        <div class="timeline-content">
          <div class="timeline-action">{{ item.action }}</div>
          <div class="timeline-detail">{{ item.detail }}</div>
          <div class="timeline-operator" v-if="item.operator">
            操作人：{{ item.operator }}
          </div>
        </div>
      </div>
    </div>
    <div class="timeline-summary" v-if="data.summary">
      <span class="summary-icon">💡</span>
      <span class="summary-text">{{ data.summary }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    title: string
    data: {
      items: Array<{
        time: string
        action: string
        detail: string
        operator?: string
      }>
    }
    summary?: string
  }
}>()

const actionColors: Record<string, string> = {
  '核销': '#00b42a',
  '入库': '#1890ff',
  '出库': '#ff7d00',
  '退款': '#f53f3f',
  '创建': '#1890ff',
  '修改': '#ff7d00',
  '删除': '#f53f3f',
  '审批': '#722ed1',
  '默认': '#86909c'
}

function getDotStyle(action: string) {
  const color = actionColors[action] || actionColors['默认']
  return {
    backgroundColor: color,
    boxShadow: `0 0 0 2px ${color}`
  }
}
</script>

<style scoped lang="scss">
.timeline-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.timeline-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 16px;
}

.timeline-list {
  position: relative;
  padding-left: 80px;

  &::before {
    content: '';
    position: absolute;
    left: 76px;
    top: 12px;
    bottom: 12px;
    width: 2px;
    background: #e5e6eb;
  }
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: none;
  }
}

.timeline-time {
  position: absolute;
  left: -80px;
  top: 14px;
  width: 60px;
  font-size: 12px;
  color: #86909c;
  text-align: right;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 1;
}

.timeline-content {
  flex: 1;
  padding-left: 8px;
}

.timeline-action {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
  margin-bottom: 4px;
}

.timeline-detail {
  font-size: 13px;
  color: #4e5969;
  margin-bottom: 4px;
}

.timeline-operator {
  font-size: 12px;
  color: #86909c;
}

.timeline-summary {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 16px;
  padding: 10px 12px;
  background: #f6f8fa;
  border-radius: 8px;
  font-size: 13px;
  color: #4e5969;
  line-height: 1.5;

  .summary-icon {
    flex-shrink: 0;
  }
}
</style>
