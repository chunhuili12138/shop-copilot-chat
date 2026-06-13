/**
 * 数据显示组件注册
 */

import LineChart from './LineChart.vue'
import BarChart from './BarChart.vue'
import PieChart from './PieChart.vue'
import GaugeChart from './GaugeChart.vue'
import FunnelChart from './FunnelChart.vue'
import RadarChart from './RadarChart.vue'
import DataTable from './DataTable.vue'
import StatCard from './StatCard.vue'
import RankList from './RankList.vue'
import Timeline from './Timeline.vue'
import KeyValueList from './KeyValueList.vue'
import CodeBlock from './CodeBlock.vue'
import MessageRenderer from './MessageRenderer.vue'

// 图表组件映射
export const chartComponents = {
  line: LineChart,
  bar: BarChart,
  pie: PieChart,
  gauge: GaugeChart,
  funnel: FunnelChart,
  radar: RadarChart,
}

// 数据展示组件映射
export const dataComponents = {
  table: DataTable,
  card: StatCard,
  rank: RankList,
  timeline: Timeline,
  kv: KeyValueList,
  code: CodeBlock,
}

// 所有组件映射
export const allComponents = {
  ...chartComponents,
  ...dataComponents,
}

// 根据 display_type 和 chart_type 获取组件
export function getDisplayComponent(displayType: string, chartType?: string) {
  if (displayType === 'chart' && chartType) {
    return chartComponents[chartType as keyof typeof chartComponents] || null
  }
  return dataComponents[displayType as keyof typeof dataComponents] || null
}

export {
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  FunnelChart,
  RadarChart,
  DataTable,
  StatCard,
  RankList,
  Timeline,
  KeyValueList,
  CodeBlock,
  MessageRenderer,
}
