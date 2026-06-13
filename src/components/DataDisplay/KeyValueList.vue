<template>
  <div class="kv-wrapper">
    <div class="kv-title" v-if="data.title">{{ data.title }}</div>
    <div class="kv-list">
      <div
        v-for="(item, index) in data.data.items"
        :key="index"
        class="kv-item"
      >
        <div class="kv-label">{{ item.label }}</div>
        <div class="kv-value">{{ item.value }}</div>
      </div>
    </div>
    <div class="kv-summary" v-if="data.summary">
      <span class="summary-icon">💡</span>
      <span class="summary-text">{{ data.summary }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    title?: string
    data: {
      items: Array<{
        label: string
        value: string
      }>
    }
    summary?: string
  }
}>()
</script>

<style scoped lang="scss">
.kv-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.kv-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 16px;
}

.kv-list {
  display: flex;
  flex-direction: column;
}

.kv-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f2f3f5;

  &:last-child {
    border-bottom: none;
  }
}

.kv-label {
  width: 100px;
  flex-shrink: 0;
  font-size: 13px;
  color: #86909c;
}

.kv-value {
  flex: 1;
  font-size: 13px;
  color: #1d2129;
  word-break: break-all;
}

.kv-summary {
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
