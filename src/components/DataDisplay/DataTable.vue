<template>
  <div class="table-wrapper">
    <div class="table-header">
      <div class="table-title">{{ data.title }}</div>
      <div class="table-count" v-if="data.data.total !== undefined">共 {{ data.data.total }} 条</div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th v-for="(col, index) in data.data.columns" :key="index">
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in displayRows" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-more" v-if="data.data.rows.length > maxRows" @click="showAll = !showAll">
      {{ showAll ? '收起' : `查看全部 ${data.data.rows.length} 条` }}
    </div>
    <div class="table-summary" v-if="data.summary">
      <span class="summary-icon">💡</span>
      <span class="summary-text">{{ data.summary }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  data: {
    title: string
    data: {
      columns: string[]
      rows: any[][]
      total?: number
    }
    summary?: string
  }
}>()

const maxRows = 5
const showAll = ref(false)

const displayRows = computed(() => {
  if (showAll.value) {
    return props.data.data.rows
  }
  return props.data.data.rows.slice(0, maxRows)
})
</script>

<style scoped lang="scss">
.table-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.table-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
}

.table-count {
  font-size: 12px;
  color: #86909c;
  background: #f2f3f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  tr {
    background: #f7f8fa;
  }
}

th {
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: #4e5969;
  white-space: nowrap;
  border-bottom: 1px solid #e5e6eb;
}

td {
  padding: 10px 12px;
  color: #1d2129;
  border-bottom: 1px solid #f2f3f5;
  white-space: nowrap;
}

tbody {
  tr:hover {
    background: #f7f8fa;
  }
}

.table-more {
  text-align: center;
  padding: 10px;
  color: #1890ff;
  font-size: 13px;
  cursor: pointer;
  border-top: 1px solid #f2f3f5;
  margin-top: 4px;

  &:hover {
    background: #f7f8fa;
    border-radius: 0 0 12px 12px;
  }
}

.table-summary {
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
