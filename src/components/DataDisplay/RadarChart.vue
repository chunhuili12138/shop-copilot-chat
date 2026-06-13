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
import { RadarChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  data: {
    title: string
    data: {
      indicators: Array<{
        name: string
        max: number
      }>
      series: Array<{
        name: string
        data: number[]
      }>
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

  const { indicators, series } = props.data.data

  const colors = ['#1890ff', '#36cfc9', '#597ef7']

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      left: 'center',
      textStyle: {
        fontSize: 11
      }
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#4e5969',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: '#e5e6eb'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(24, 144, 255, 0.02)', 'rgba(24, 144, 255, 0.04)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#e5e6eb'
        }
      }
    },
    series: [
      {
        type: 'radar',
        data: series.map((item, index) => ({
          name: item.name,
          value: item.data,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: colors[index % colors.length],
            width: 2
          },
          areaStyle: {
            color: colors[index % colors.length],
            opacity: 0.15
          },
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
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
  height: 250px;
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
