import { create } from 'zustand'
import { User, Conversation, Notification, Message } from '@/types'

interface AppState {
  user: User | null
  currentConversationId: string | null
  conversations: Conversation[]
  theme: 'light' | 'dark'
  language: 'zh' | 'en'
  notifications: Notification[]
  setUser: (user: User | null) => void
  logout: () => Promise<void>
  setCurrentConversationId: (id: string | null) => void
  addConversation: (conversation: Conversation) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'zh' | 'en') => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  loadUserData: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  currentConversationId: null,
  conversations: [],
  theme: 'light',
  language: 'zh',
  notifications: [],

  setUser: (user: User | null) => {
    set({ user })
    // v2.0: 不再使用localStorage存储用户，JWT token使用HttpOnly cookie
  },

  logout: async () => {
    try {
      // v2.0: 调用登出API清除cookie
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('登出API调用失败:', error)
    }
    set({ user: null })
  },

  setCurrentConversationId: (id: string | null) => set({ currentConversationId: id }),

  addConversation: (conversation) => {
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      currentConversationId: conversation.id
    }))
  },

  updateConversation: (id, updates) => {
    set((state) => ({
      conversations: state.conversations.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
      )
    }))
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [
              ...c.messages,
              {
                ...message,
                id: Date.now().toString(),
                timestamp: new Date()
              }
            ],
            updatedAt: new Date()
          }
        }
        return c
      })
    }))
  },

  setTheme: (theme) => {
    set({ theme })
    // 保存主题到localStorage（UI偏好，非敏感数据）
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
      // 同时更新document class
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },

  setLanguage: (language) => {
    set({ language })
    // 保存语言到localStorage（UI偏好，非敏感数据）
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  },

  addNotification: (notification) => {
    const id = Date.now().toString()
    const fullNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date()
    }
    set((state) => ({
      notifications: [fullNotification, ...state.notifications]
    }))
    // 3秒后自动移除
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }))
    }, notification.duration || 3000)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  loadUserData: async () => {
    // v2.0: 从API获取当前用户信息（JWT token自动从cookie获取）
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          set({ user: data.user })
        }
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
    }

    // 加载主题和语言偏好
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme')
      const language = localStorage.getItem('language')
      if (theme === 'light' || theme === 'dark') {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        }
      }
      if (language === 'zh' || language === 'en') {
        set({ language })
      }
    }
  }
}))
