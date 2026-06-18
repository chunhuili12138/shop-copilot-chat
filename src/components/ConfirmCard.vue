<template>
  <div class="confirm-card">
    <div class="confirm-header">
      <el-icon class="icon" :size="18" color="#d46b08"><WarningFilled /></el-icon>
      <span class="title">{{ confirmData.title }}</span>
    </div>
    <div class="confirm-body">
      <div class="message">{{ confirmData.message }}</div>

      <!-- 静态详情 -->
      <div v-if="Object.keys(confirmData.details).length" class="details">
        <div
          v-for="(value, key) in confirmData.details"
          :key="key"
          class="detail-item"
        >
          <span class="label">{{ key }}:</span>
          <span class="value">{{ value }}</span>
        </div>
      </div>

      <!-- 动态表单字段 -->
      <div v-if="confirmData.fields?.length" class="form-fields">
        <div
          v-for="field in visibleFields"
          :key="field.name"
          class="field-item"
        >
          <label class="field-label">
            {{ field.label || field.name }}
            <span v-if="field.required" class="required">*</span>
          </label>
          <el-input
            v-if="field.type === 'input'"
            v-model="formData[field.name]"
            :placeholder="field.placeholder || ''"
            size="default"
          />
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="formData[field.name]"
            type="textarea"
            :rows="3"
            :placeholder="field.placeholder || ''"
          />
          <el-select
            v-else-if="field.type === 'select'"
            v-model="formData[field.name]"
            :placeholder="field.placeholder || '请选择'"
            size="default"
            style="width: 100%"
          >
            <el-option
              v-for="opt in (field.options || [])"
              :key="String(opt.value)"
              :label="opt.label"
              :value="String(opt.value)"
            />
          </el-select>
          <el-select
            v-else-if="field.type === 'multi_select'"
            v-model="multiSelectValues[field.name]"
            :placeholder="field.placeholder || '请选择（可多选）'"
            multiple
            collapse-tags
            size="default"
            style="width: 100%"
          >
            <el-option
              v-for="opt in (field.options || [])"
              :key="String(opt.value)"
              :label="opt.label"
              :value="String(opt.value)"
            />
          </el-select>
        </div>
      </div>
    </div>

    <div class="confirm-footer">
      <button class="cancel-btn" @click="$emit('confirm', false)" :disabled="submitting">
        {{ cancelLabel }}
      </button>
      <button
        class="confirm-btn"
        @click="handleConfirm"
        :disabled="submitting || !isFormValid"
      >
        <el-icon v-if="submitting" class="is-loading"><Loading /></el-icon>
        {{ submitting ? '处理中...' : confirmLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { WarningFilled, Loading } from '@element-plus/icons-vue'
import type { ConfirmData } from '@/types/chat'

const props = defineProps<{
  confirmData: ConfirmData
}>()

const emit = defineEmits<{
  confirm: [approved: boolean, formData?: Record<string, any>]
}>()

const confirming = ref(false)
const formData = ref<Record<string, string>>({})
const multiSelectValues = ref<Record<string, string[]>>({})

// 初始化表单数据
onMounted(() => {
  if (props.confirmData.fields) {
    for (const field of props.confirmData.fields) {
      if (field.type === 'multi_select') {
        multiSelectValues.value[field.name] = []
      } else {
        formData.value[field.name] = field.value ?? ''
      }
    }
  }
})

// 可见字段（排除 hidden）
const visibleFields = computed(() => {
  return (props.confirmData.fields || []).filter(f => f.type !== 'hidden')
})

// 按钮文案
const confirmLabel = computed(() => {
  return props.confirmData.buttons?.find(b => b.type === 'confirm')?.label || '确认'
})
const cancelLabel = computed(() => {
  return props.confirmData.buttons?.find(b => b.type === 'cancel')?.label || '取消'
})

// 表单校验
const isFormValid = computed(() => {
  if (!props.confirmData.fields) return true
  for (const field of props.confirmData.fields) {
    if (field.required) {
      if (field.type === 'multi_select') {
        if (!multiSelectValues.value[field.name]?.length) return false
      } else {
        if (!formData.value[field.name]?.trim()) return false
      }
    }
  }
  return true
})

// 提交
function handleConfirm() {
  if (confirming.value || !isFormValid.value) return
  confirming.value = true
  // 合并表单数据
  const data: Record<string, any> = {}
  for (const [key, value] of Object.entries(formData.value)) {
    data[key] = value
  }
  // multi_select 字段用逗号连接
  for (const [key, values] of Object.entries(multiSelectValues.value)) {
    data[key] = values.join(',')
  }
  emit('confirm', true, data)
}
</script>

<style scoped lang="scss">
.confirm-card {
  margin: 0 var(--chat-spacing-lg) var(--chat-spacing-md);
  background: white;
  border: 1px solid var(--chat-warning);
  border-radius: var(--chat-radius-lg);
  overflow: hidden;
}

.confirm-header {
  display: flex;
  align-items: center;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  background: #fff7e6;
  border-bottom: 1px solid #ffe7ba;

  .title {
    font-size: 14px;
    font-weight: 500;
    color: #d46b08;
  }
}

.confirm-body {
  padding: var(--chat-spacing-lg);
}

.message {
  font-size: 14px;
  color: var(--chat-text);
  margin-bottom: var(--chat-spacing-md);
}

.details {
  background: var(--chat-bg);
  padding: var(--chat-spacing-md);
  border-radius: var(--chat-radius);
  margin-bottom: var(--chat-spacing-md);
}

.detail-item {
  display: flex;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-xs) 0;
  font-size: 13px;

  .label {
    color: var(--chat-text-secondary);
    min-width: 80px;
  }

  .value {
    color: var(--chat-text);
  }
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--chat-spacing-md);
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

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--chat-spacing-sm);
  padding: var(--chat-spacing-md) var(--chat-spacing-lg);
  border-top: 1px solid var(--chat-border-light);
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
