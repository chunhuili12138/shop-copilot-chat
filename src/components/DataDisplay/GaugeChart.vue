<template>
  <div class="chart-wrapper">
    <div class="chart-title">{{ data.title }}</div>
    <div class="chart-container" ref="chartRef"></div>
    <div class="chart-summary" v-if="data.summary">
      <span class="summary-icon">💡</span>
      <span class="summary-text">{{ data.summary }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { GaugeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GaugeChart, CanvasRenderer])

const props = defineProps<{
  data: {
    title: string
    data: {
      value: number
      min?: number
      max?: number
      unit?: string
    }
    summary?: string
  }
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chart) return

  const { value, min = 0, max = 100, unit = '' } = props.data.data

  const option = {
    series: [
      {
        type: 'gauge',
        min: min,
        max: max,
        progress: {
          show: true,
          width: 18,
          roundCap: true,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#1890ff' },
                { offset: 1, color: '#36cfc9' }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, '#e8e8e8']]
          },
          roundCap: true
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        pointer: {
          show: false
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1d2129',
          offsetCenter: [0, '0%'],
          formatter: `{value}${unit}`
        },
        data: [
          { value: value }
        ]
      }
    ]
  }

  chart.setOption(option)
}

function handleResize() {
  chart?.resize()
}

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped lang="scss">
.chart-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 12px;
}

.chart-container {
  width: 100%;
  height: 200px;
}

.chart-summary {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 12px;
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
