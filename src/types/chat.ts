// types/chat.ts

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  steps?: Step[]
  data_type?: string
  structured_data?: any
  images?: string[]
  files?: FileInfo[]
  timestamp: number
  confirm?: ConfirmData
}

export interface Step {
  type: 'thinking' | 'processing' | 'tool_result' | 'answer' | 'error'
  content: string
  step: string
  done: boolean
}

export interface Session {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
}

export interface QuickQuestion {
  id: string
  text: string
  icon?: string
  category?: string
}

export interface SSEData {
  type: 'thinking' | 'processing' | 'tool_result' | 'answer' | 'data' | 'done' | 'error' | 'confirm' | 'select'
  content: any
  step: string
  done: boolean
}

/** 选择框选项 */
export interface SelectOption {
  value: string | number
  label: string
}

/** 表单字段定义 */
export interface ConfirmField {
  name: string
  type: 'input' | 'textarea' | 'hidden' | 'select' | 'multi_select'
  label?: string
  required?: boolean
  placeholder?: string
  value?: any
  options?: SelectOption[]  // select/multi_select 类型的选项列表
}

/** 按钮定义 */
export interface ConfirmButton {
  type: 'confirm' | 'cancel'
  label: string
}

export interface ConfirmData {
  type: 'confirm'
  tool_name?: string
  title: string
  message: string
  details: Record<string, string>
  fields?: ConfirmField[]
  buttons?: ConfirmButton[]
  action: string
  params: Record<string, any>
}

/** 多选列表项 */
export interface SelectItem {
  id: number
  [key: string]: any
}

/** 多选列表数据 */
export interface SelectData {
  tool_name: string
  title: string
  message: string
  items: SelectItem[]
  fields?: ConfirmField[]
  buttons?: ConfirmButton[]
  action: string
}

export interface FileInfo {
  url: string
  name: string
  type: string
  size: number
  content?: string
}
