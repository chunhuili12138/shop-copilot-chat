/**
 * 文件相关共享工具函数
 */

/**
 * 获取文件完整 URL（支持相对路径 → 绝对 URL）
 */
export function getImageFullUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_FILE_BASE_URL || import.meta.env.VITE_API_BASE_URL || ''
  return `${base}${path}`
}

/**
 * 获取文件扩展名（大写）
 */
export function getFileExt(name: string): string {
  return name.split('.').pop()?.toUpperCase() || '?'
}

/**
 * 根据扩展名获取文件图标颜色
 */
export function getFileColor(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase()
  const colors: Record<string, string> = {
    pdf: '#EF4444',
    xlsx: '#22C55E', xls: '#22C55E',
    docx: '#3B82F6', doc: '#3B82F6',
    csv: '#8B5CF6',
    txt: '#6B7280', md: '#6B7280',
  }
  return colors[ext || ''] || '#6B7280'
}

/**
 * 格式化文件大小
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}
