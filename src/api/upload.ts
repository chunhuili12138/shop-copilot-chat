// api/upload.ts
import axios from 'axios'
import { useChatStore } from '@/stores/chat'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * 上传文件
 */
export async function uploadFile(file: File): Promise<{
  file_url: string
  file_type: string
  file_name: string
  file_size: number
  content?: string
  type?: string
}> {
  const store = useChatStore()

  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`${BASE_URL}/api/upload/file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer-${store.shopId}-${store.token}`,
    },
    timeout: 30000,
  })

  // 统一解包 { success, data } 格式
  const res = response.data
  if (res && typeof res === 'object' && 'success' in res) {
    if (res.success) return res.data
    throw new Error(res.msg || '上传失败')
  }
  return res
}
