<template>
  <div class="rank-wrapper">
    <div class="rank-title">{{ data.title }}</div>
    <div class="rank-list">
      <div
        v-for="(item, index) in data.data.items"
        :key="index"
        class="rank-item"
      >
        <div class="rank-badge" :class="getBadgeClass(item.rank)">
          {{ item.rank }}
        </div>
        <div class="rank-info">
          <div class="rank-name">{{ item.name }}</div>
          <div class="rank-amount" v-if="item.amount">{{ item.amount }}</div>
        </div>
        <div class="rank-value">{{ item.value }}</div>
      </div>
    </div>
    <div class="rank-summary" v-if="data.summary">
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
        rank: number
        name: string
        value: string
        amount?: string
      }>
    }
    summary?: string
  }
}>()

function getBadgeClass(rank: number): string {
  if (rank === 1) return 'badge-gold'
  if (rank === 2) return 'badge-silver'
  if (rank === 3) return 'badge-bronze'
  return 'badge-default'
}
</script>

<style scoped lang="scss">
.rank-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.rank-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 16px;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f7f8fa;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f0f1f3;
  }
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;

  &.badge-gold {
    background: linear-gradient(135deg, #ffd700, #ffed4a);
    color: #92400e;
  }

  &.badge-silver {
    background: linear-gradient(135deg, #c0c0c0, #e0e0e0);
    color: #374151;
  }

  &.badge-bronze {
    background: linear-gradient(135deg, #cd7f32, #daa520);
    color: #451a03;
  }

  &.badge-default {
    background: #e5e6eb;
    color: #4e5969;
  }
}

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-name {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
}

.rank-amount {
  font-size: 12px;
  color: #86909c;
  margin-top: 2px;
}

.rank-value {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  flex-shrink: 0;
}

.rank-summary {
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
