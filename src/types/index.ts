// TypeScript 类型定义

export interface User {
  id: string
  name: string | null
  email: string
  avatar: string | null
  bio: string | null
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  refreshToken: string | null
  expiresAt: Date
  createdAt: Date
}

export interface Conversation {
  id: string
  userId: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  userId: string
  name: string
  description: string
  code: string | null
  tags: string[]
  stars: number
  forks: number
  likes: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string | null
  isRead: boolean
  createdAt: Date
  duration?: number // P0-20: 添加duration属性，用于Toast显示时间
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ProjectLike {
  id: string
  userId: string
  projectId: string
  createdAt: Date
}

export interface FileUpload {
  id: string
  userId: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  path: string
  createdAt: Date
}

export interface ProjectWithUser {
  id: string
  userId: string
  name: string
  description: string
  code: string | null
  tags: string[]
  stars: number
  forks: number
  likes: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
}
