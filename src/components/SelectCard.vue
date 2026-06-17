<template>
  <div class="select-card">
    <div class="select-header">
      <el-icon class="icon" :size="18" color="#409eff"><Document /></el-icon>
      <span class="title">{{ selectData.title }}</span>
    </div>
    <div class="select-body">
      <div class="message">{{ selectData.message }}</div>

      <!-- 表单字段（优先显示） -->
      <div v-if="selectData.fields?.length" class="form-fields">
        <div v-for="field in selectData.fields" :key="field.name" class="field-item">
          <label class="field-label">
            {{ field.label || field.name }}
            <span v-if="field.required" class="required">*</span>
          </label>
          <el-input
            v-if="field.type === 'input'"
            v-model="formData[field.name]"
            :placeholder="field.placeholder || ''"
          />
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="formData[field.name]"
            type="textarea"
            :rows="3"
            :placeholder="field.placeholder || ''"
          />
        </div>
      </div>

      <!-- 选择列表（可滚动区域） -->
      <div class="items-wrapper">
        <div class="items">
          <label
            v-for="item in selectData.items"
            :key="item.id"
            class="item"
            :class="{ selected: selectedIds.includes(item.id) }"
          >
            <input
              type="checkbox"
              :value="item.id"
              v-model="selectedIds"
            />
            <div class="item-info">
              <span class="item-name">{{ item.nickname || item.customer_name || '未知' }}</span>
              <span class="item-detail">{{ item.package_name || '' }}</span>
              <span class="item-amount" v-if="item.refund_amount">¥{{ item.refund_amount }}</span>
              <span class="item-reason" v-if="item.reason">{{ item.reason }}</span>
            </div>
          </label>
        </div>

        <!-- 全选/取消全选 -->
        <div class="select-all">
          <label>
            <input type="checkbox" :checked="isAllSelected" @change="toggleAll" />
            全选
          </label>
          <span class="count">已选 {{ selectedIds.length }} / {{ selectData.items.length }} 条</span>
        </div>
      </div>
    </div>

    <div class="select-footer">
      <button class="cancel-btn" @click="$emit('cancel')" :disabled="submitting">
        {{ cancelButtonLabel }}
      </button>
      <button
        class="confirm-btn"
        @click="handleConfirm"
        :disabled="submitting || selectedIds.length === 0 || !isFormValid"
      >
        <el-icon v-if="submitting" class="is-loading"><Loading /></el-icon>
        {{ submitting ? '处理中...' : confirmButtonLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Document, Loading } from '@element-plus/icons-vue'
import type { SelectData } from '@/types/chat'

const props = defineProps<{
  selectData: SelectData
}>()

const emit = defineEmits<{
  confirm: [selectedIds: number[], formData: Record<string, any>]
  cancel: []
}>()

const selectedIds = ref<number[]>([])
const formData = ref<Record<string, string>>({})
const submitting = ref(false)

onMounted(() => {
  if (props.selectData.fields) {
    for (const field of props.selectData.fields) {
      formData.value[field.name] = field.value ?? ''
    }
  }
})

const isAllSelected = computed(() => {
  return props.selectData.items.length > 0 && selectedIds.value.length === props.selectData.items.length
})

const confirmButtonLabel = computed(() => {
  return props.selectData.buttons?.find(b => b.type === 'confirm')?.label || '确认操作选中项'
})

const cancelButtonLabel = computed(() => {
  return props.selectData.buttons?.find(b => b.type === 'cancel')?.label || '取消'
})

const isFormValid = computed(() => {
  if (!props.selectData.fields) return true
  for (const field of props.selectData.fields) {
    if (field.required && !formData.value[field.name]?.trim()) {
      return false
    }
  }
  return true
})

function toggleAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = props.selectData.items.map(item => item.id)
  }
}

function handleConfirm() {
  if (submitting.value || selectedIds.value.length === 0 || !isFormValid.value) return
  submitting.value = true
  emit('confirm', selectedIds.value, { ...formData.value })
}
</script>

<style scoped lang="scss">
.select-card {
  margin: 0 var(--chat-spacing-lg) var(--chat-spacing-md);
  background: white;
  border: 1px solid var(--chat-primary);
  border-radius: var(--chat-radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.select-header {
  display: flex;
  align-items: center;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  background: #ecf5ff;
  border-bottom: 1px solid #d9ecff;
  flex-shrink: 0;

  .title {
    font-size: 14px;
    font-weight: 500;
    color: #409eff;
  }
}

.select-body {
  padding: var(--chat-spacing-lg);
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--chat-spacing-md);
}

.message {
  font-size: 14px;
  color: var(--chat-text);
  flex-shrink: 0;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--chat-spacing-md);
  flex-shrink: 0;
  padding-bottom: var(--chat-spacing-md);
  border-bottom: 1px solid var(--chat-border-light);
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 13px;
  color: var(--chat-text-secondary);

  .required {
    color: #f56c6c;
    margin-left: 2px;
  }
}

.items-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.items {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--chat-spacing-sm);
  min-height: 0;
}

.item {
  display: flex;
  align-items: center;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-sm) var(--chat-spacing-md);
  border: 1px solid var(--chat-border-light);
  border-radius: var(--chat-radius);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &.selected {
    border-color: var(--chat-primary);
    background: #ecf5ff;
  }

  &:hover {
    border-color: var(--chat-primary);
  }

  input[type="checkbox"] {
    cursor: pointer;
  }
}

.item-info {
  display: flex;
  align-items: center;
  gap: var(--chat-spacing-sm);
  flex-wrap: wrap;
  font-size: 13px;

  .item-name {
    font-weight: 500;
    color: var(--chat-text);
  }

  .item-detail {
    color: var(--chat-text-secondary);
  }

  .item-amount {
    color: #e6a23c;
    font-weight: 500;
  }

  .item-reason {
    color: var(--chat-text-secondary);
    font-size: 12px;
  }
}

.select-all {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--chat-spacing-sm) 0;
  border-top: 1px solid var(--chat-border-light);
  font-size: 13px;
  flex-shrink: 0;

  label {
    display: flex;
    align-items: center;
    gap: var(--chat-spacing-xs);
    cursor: pointer;
  }

  .count {
    color: var(--chat-text-secondary);
  }
}

.select-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  border-top: 1px solid var(--chat-border-light);
  flex-shrink: 0;
}

.cancel-btn,
.confirm-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: var(--chat-spacing-sm) var(--chat-spacing-lg);
  border-radius: var(--chat-radius);
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.cancel-btn {
  background: white;
  border: 1px solid var(--chat-border);
  color: var(--chat-text);

  &:hover:not(:disabled) {
    background: var(--chat-bg);
  }
}

.confirm-btn {
  background: var(--chat-primary);
  border: 1px solid var(--chat-primary);
  color: white;

  &:hover:not(:disabled) {
    background: var(--chat-primary-dark);
  }
}
</style>
