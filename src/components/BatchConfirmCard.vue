<template>
  <div class="batch-confirm-card">
    <div class="confirm-header">
      <el-icon class="icon" :size="18" color="#d46b08"><WarningFilled /></el-icon>
      <span class="title">{{ data.title || '确认执行以下操作' }}</span>
    </div>

    <div class="confirm-body">
      <div class="operations">
        <div
          v-for="(op, index) in operations"
          :key="index"
          class="operation-item"
        >
          <div class="op-header">
            <el-checkbox v-model="op.selected" />
            <span class="op-title">{{ op.title }}</span>
          </div>
          <div class="op-message">{{ op.message }}</div>

          <!-- 操作详情 -->
          <div v-if="op.details && Object.keys(op.details).length > 0" class="op-details">
            <div
              v-for="(value, key) in op.details"
              :key="key"
              class="detail-item"
            >
              <span class="label">{{ key }}:</span>
              <span class="value">{{ value }}</span>
            </div>
          </div>

          <!-- 需要用户填写的字段 -->
          <div v-if="op.fields && op.fields.length > 0" class="op-fields">
            <div
              v-for="field in op.fields"
              :key="field.name"
              class="field-item"
            >
              <label class="field-label">
                {{ field.label || field.name }}
                <span v-if="field.required" class="required">*</span>
              </label>
              <el-input
                v-if="field.type === 'input'"
                v-model="op.userInput[field.name]"
                :placeholder="field.placeholder || ''"
                size="small"
              />
              <el-input
                v-else-if="field.type === 'textarea'"
                v-model="op.userInput[field.name]"
                type="textarea"
                :rows="2"
                :placeholder="field.placeholder || ''"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="confirm-footer">
      <el-button
        type="primary"
        @click="handleConfirmSelected"
        :disabled="selectedCount === 0"
        :loading="loading"
      >
        确认选中 ({{ selectedCount }})
      </el-button>
      <el-button @click="handleCancel" :disabled="loading">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';

interface Operation {
  action: string;
  title: string;
  message: string;
  details: Record<string, string>;
  fields: Array<{
    name: string;
    type: string;
    label: string;
    required: boolean;
    placeholder: string;
  }>;
  params: Record<string, any>;
  selected?: boolean;
  userInput?: Record<string, any>;
}

interface BatchConfirmData {
  type: string;
  title: string;
  operations: Operation[];
  buttons?: Array<{ type: string; label: string }>;
}

const props = defineProps<{
  data: BatchConfirmData;
  loading?: boolean;
}>();

const emit = defineEmits(['confirm', 'cancel']);

const operations = ref<Operation[]>([]);

onMounted(() => {
  operations.value = props.data.operations.map(op => ({
    ...op,
    selected: true,
    userInput: {},
  }));
});

const selectedCount = computed(() => operations.value.filter(op => op.selected).length);

const handleConfirmSelected = () => {
  const selectedOps = operations.value
    .filter(op => op.selected)
    .map(op => ({
      action: op.action,
      params: {
        ...op.params,
        ...op.userInput,  // 合并用户填写的字段
      },
    }));
  emit('confirm', selectedOps);
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped lang="scss">
.batch-confirm-card {
  max-width: 480px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .confirm-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #fdf6ec;
    border-bottom: 1px solid #faecd8;

    .title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }

  .confirm-body {
    padding: 16px;

    .operations {
      .operation-item {
        border: 1px solid #ebeef5;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
        background: #fafafa;

        &:last-child {
          margin-bottom: 0;
        }

        .op-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;

          .op-title {
            font-weight: 500;
            color: #303133;
            font-size: 14px;
          }
        }

        .op-message {
          color: #606266;
          font-size: 13px;
          margin-bottom: 8px;
          padding-left: 24px;
        }

        .op-details {
          padding-left: 24px;
          margin-bottom: 8px;

          .detail-item {
            font-size: 12px;
            color: #909399;
            margin-bottom: 2px;

            .label {
              margin-right: 4px;
            }

            .value {
              color: #606266;
            }
          }
        }

        .op-fields {
          padding-left: 24px;
          margin-top: 8px;

          .field-item {
            margin-bottom: 8px;

            &:last-child {
              margin-bottom: 0;
            }

            .field-label {
              display: block;
              font-size: 12px;
              color: #606266;
              margin-bottom: 4px;

              .required {
                color: #f56c6c;
                margin-left: 2px;
              }
            }
          }
        }
      }
    }
  }

  .confirm-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #ebeef5;
    background: #fafafa;
  }
}
</style>
