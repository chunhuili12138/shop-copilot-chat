<template>
  <div class="card-wrapper">
    <div class="card-title">{{ data.title }}</div>
    <div class="card-grid">
      <div
        v-for="(card, index) in data.data.cards"
        :key="index"
        class="stat-card"
      >
        <div class="stat-icon">{{ getIcon(card.icon) }}</div>
        <div class="stat-value">{{ card.value }}</div>
        <div class="stat-label">{{ card.label }}</div>
        <div class="stat-trend" v-if="card.trend" :class="getTrendClass(card.trend)">
          {{ card.trend }}
        </div>
      </div>
    </div>
    <div class="card-summary" v-if="data.summary">
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
      cards: Array<{
        label: string
        value: string
        icon?: string
        trend?: string
      }>
    }
    summary?: string
  }
}>()

const iconMap: Record<string, string> = {
  revenue: '💰',
  order: '📦',
  checkin: '✅',
  customer: '👤',
  warning: '⚠️',
  calendar: '📅',
  chart: '📊',
  star: '⭐',
  default: '📋'
}

function getIcon(icon?: string): string {
  if (!icon) return iconMap.default
  return iconMap[icon] || iconMap.default
}

function getTrendClass(trend: string): string {
  if (trend.startsWith('+')) return 'trend-up'
  if (trend.startsWith('-')) return 'trend-down'
  return 'trend-neutral'
}
</script>

<style scoped lang="scss">
.card-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: #f7f8fa;
  border-radius: 10px;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    background: #f0f1f3;
    transform: translateY(-2px);
  }
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1d2129;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #86909c;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;

  &.trend-up {
    color: #00b42a;
    background: rgba(0, 180, 42, 0.1);
  }

  &.trend-down {
    color: #f53f3f;
    background: rgba(245, 63, 63, 0.1);
  }

  &.trend-neutral {
    color: #86909c;
    background: rgba(134, 144, 156, 0.1);
  }
}

.card-summary {
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
