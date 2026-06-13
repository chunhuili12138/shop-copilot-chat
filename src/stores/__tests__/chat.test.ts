import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock API modules before importing store
vi.mock('@/api/chat', () => ({
  createSSEConnection: vi.fn(),
  executeConfirm: vi.fn(),
}))

vi.mock('@/api/session', () => ({
  getSessions: vi.fn(() => Promise.resolve([])),
  createSession: vi.fn(() => Promise.resolve({ id: 'new-1', title: 'test', created_at: '', updated_at: '', message_count: 0 })),
  deleteSession: vi.fn(() => Promise.resolve()),
  getSessionHistory: vi.fn(() => Promise.resolve([])),
}))

import { useChatStore } from '../chat'

describe('useChatStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('initUserInfo', () => {
    it('should set user info correctly', () => {
      const store = useChatStore()
      store.initUserInfo('test-token', 5, '店长', '张三', '测试店铺')

      expect(store.token).toBe('test-token')
      expect(store.shopId).toBe(5)
      expect(store.role).toBe('店长')
      expect(store.userName).toBe('张三')
      expect(store.shopName).toBe('测试店铺')
    })
  })

  describe('session management', () => {
    it('should start with empty sessions', () => {
      const store = useChatStore()
      expect(store.sessions).toEqual([])
      expect(store.currentSessionId).toBeNull()
      expect(store.messages).toEqual([])
    })

    it('should handle create session', async () => {
      const store = useChatStore()
      await store.handleCreateSession()

      expect(store.sessions).toHaveLength(1)
      expect(store.currentSessionId).toBe('new-1')
      expect(store.messages).toEqual([])
    })

    it('should handle delete session', async () => {
      const store = useChatStore()
      store.sessions = [
        { id: 's1', title: '会话1', created_at: '', updated_at: '', message_count: 0 },
        { id: 's2', title: '会话2', created_at: '', updated_at: '', message_count: 0 },
      ]
      store.currentSessionId = 's1'

      await store.handleDeleteSession('s1')

      expect(store.sessions).toHaveLength(1)
      expect(store.sessions[0].id).toBe('s2')
    })
  })

  describe('sortedSessions', () => {
    it('should sort sessions by updated_at descending', () => {
      const store = useChatStore()
      store.sessions = [
        { id: 's1', title: '旧', created_at: '', updated_at: '2024-01-01', message_count: 0 },
        { id: 's2', title: '新', created_at: '', updated_at: '2024-06-01', message_count: 0 },
      ]

      expect(store.sortedSessions[0].id).toBe('s2')
      expect(store.sortedSessions[1].id).toBe('s1')
    })
  })

  describe('toggle functions', () => {
    it('should toggle fullscreen', () => {
      const store = useChatStore()
      expect(store.isFullscreen).toBe(false)
      store.toggleFullscreen()
      expect(store.isFullscreen).toBe(true)
      store.toggleFullscreen()
      expect(store.isFullscreen).toBe(false)
    })

    it('should toggle session list', () => {
      const store = useChatStore()
      expect(store.showSessionList).toBe(true)
      store.toggleSessionList()
      expect(store.showSessionList).toBe(false)
    })
  })

  describe('localStorage persistence', () => {
    it('should save session ID to localStorage', () => {
      const store = useChatStore()
      store.initUserInfo('token', 5, '店长', 'user', 'shop')
      store.saveSessionId('session-123')

      const key = 'shop_copilot_session_5'
      expect(localStorage.getItem(key)).toBe('session-123')
    })

    it('should remove session ID from localStorage when null', () => {
      const store = useChatStore()
      store.initUserInfo('token', 5, '店长', 'user', 'shop')
      store.saveSessionId('session-123')
      store.saveSessionId(null)

      const key = 'shop_copilot_session_5'
      expect(localStorage.getItem(key)).toBeNull()
    })

    it('should use default key when shopId is 0', () => {
      const store = useChatStore()
      store.initUserInfo('token', 0, 'guest', 'user', '')
      store.saveSessionId('session-abc')

      expect(localStorage.getItem('shop_copilot_session_default')).toBe('session-abc')
    })
  })

  describe('cancelCurrentSSE', () => {
    it('should be callable without error', () => {
      const store = useChatStore()
      expect(() => store.cancelCurrentSSE()).not.toThrow()
    })
  })

  describe('handleConfirm', () => {
    it('should do nothing when no current confirm', async () => {
      const store = useChatStore()
      store.currentConfirm = null

      await store.handleConfirm(true)

      expect(store.messages).toHaveLength(0)
    })
  })
})
