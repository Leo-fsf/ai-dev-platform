import { User, Conversation, Message, Project, Theme, Notification } from '@/types'

// 内存数据存储
class MemoryStorage {
  users: User[] = []
  conversations: Conversation[] = []
  projects: Project[] = []
  themes: Theme[] = []
  notifications: Notification[] = []

  // 初始化一些示例数据
  constructor() {
    this.initDemoData()
  }

  private initDemoData() {
    // 添加示例项目
    this.projects = [
      {
        id: 'project-1',
        userId: 'demo-user-1',
        name: 'React Dashboard',
        description: '现代化的React仪表盘模板',
        tags: ['React', 'TypeScript', 'Tailwind'],
        stars: 42,
        forks: 12,
        likes: 89,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20')
      },
      {
        id: 'project-2',
        userId: 'demo-user-2',
        name: 'Next.js E-commerce',
        description: '全栈电商解决方案',
        tags: ['Next.js', 'Stripe', 'PostgreSQL'],
        stars: 128,
        forks: 45,
        likes: 234,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-03-10')
      }
    ]
  }
}

const storage = new MemoryStorage()

// 用户数据管理
export const UserData = {
  async get(userId: string): Promise<User | null> {
    const user = storage.users.find(u => u.id === userId)
    return user || null
  },

  async getAll(): Promise<User[]> {
    return [...storage.users]
  },

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    storage.users.push(newUser)
    return newUser
  },

  async update(userId: string, updates: Partial<User>): Promise<boolean> {
    const index = storage.users.findIndex(u => u.id === userId)
    if (index === -1) return false

    storage.users[index] = {
      ...storage.users[index],
      ...updates,
      updatedAt: new Date()
    }
    return true
  },

  async delete(userId: string): Promise<boolean> {
    const initialLength = storage.users.length
    storage.users = storage.users.filter(u => u.id !== userId)
    return storage.users.length < initialLength
  }
}

// 对话数据管理
export const ConversationData = {
  async get(conversationId: string): Promise<Conversation | null> {
    const conversation = storage.conversations.find(c => c.id === conversationId)
    return conversation || null
  },

  async getAll(): Promise<Conversation[]> {
    return [...storage.conversations]
  },

  async create(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation> {
    const newConversation: Conversation = {
      ...conversation,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    storage.conversations.push(newConversation)
    return newConversation
  },

  async update(conversationId: string, updates: Partial<Conversation>): Promise<boolean> {
    const index = storage.conversations.findIndex(c => c.id === conversationId)
    if (index === -1) return false

    storage.conversations[index] = {
      ...storage.conversations[index],
      ...updates,
      updatedAt: new Date()
    }
    return true
  },

  async delete(conversationId: string): Promise<boolean> {
    const initialLength = storage.conversations.length
    storage.conversations = storage.conversations.filter(c => c.id !== conversationId)
    return storage.conversations.length < initialLength
  },

  async addMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<boolean> {
    const index = storage.conversations.findIndex(c => c.id === conversationId)
    if (index === -1) return false

    storage.conversations[index].messages.push({
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    })
    storage.conversations[index].updatedAt = new Date()
    return true
  }
}

// 项目数据管理
export const ProjectData = {
  async getAll(): Promise<Project[]> {
    return [...storage.projects]
  },

  async get(projectId: string): Promise<Project | null> {
    const project = storage.projects.find(p => p.id === projectId)
    return project || null
  },

  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'stars' | 'forks' | 'likes'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      stars: 0,
      forks: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    storage.projects.push(newProject)
    return newProject
  },

  async update(projectId: string, updates: Partial<Project>): Promise<boolean> {
    const index = storage.projects.findIndex(p => p.id === projectId)
    if (index === -1) return false

    storage.projects[index] = {
      ...storage.projects[index],
      ...updates,
      updatedAt: new Date()
    }
    return true
  },

  async delete(projectId: string): Promise<boolean> {
    const initialLength = storage.projects.length
    storage.projects = storage.projects.filter(p => p.id !== projectId)
    return storage.projects.length < initialLength
  },

  async like(projectId: string): Promise<boolean> {
    const project = storage.projects.find(p => p.id === projectId)
    if (!project) return false
    project.likes++
    return true
  },

  async fork(projectId: string): Promise<boolean> {
    const project = storage.projects.find(p => p.id === projectId)
    if (!project) return false
    project.forks++
    return true
  }
}

// 主题数据管理
export const ThemeData = {
  async get(userId: string): Promise<Theme | null> {
    const theme = storage.themes.find(t => t.userId === userId)
    return theme || null
  },

  async getAll(): Promise<Theme[]> {
    return [...storage.themes]
  },

  async set(userId: string, theme: Partial<Theme>): Promise<boolean> {
    const index = storage.themes.findIndex(t => t.userId === userId)
    if (index === -1) {
      storage.themes.push({
        userId,
        mode: 'light',
        language: 'zh',
        ...theme
      })
    } else {
      storage.themes[index] = { ...storage.themes[index], ...theme }
    }
    return true
  }
}

// 通知数据管理
export const NotificationData = {
  async getAll(userId: string): Promise<Notification[]> {
    return storage.notifications.filter(n => n.userId === userId)
  },

  async add(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<boolean> {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }
    storage.notifications.push(newNotification)
    return true
  },

  async remove(notificationId: string): Promise<boolean> {
    const initialLength = storage.notifications.length
    storage.notifications = storage.notifications.filter(n => n.id !== notificationId)
    return storage.notifications.length < initialLength
  },

  async removeOld(userId: string, beforeTime: Date): Promise<number> {
    const initialLength = storage.notifications.length
    storage.notifications = storage.notifications.filter(n => 
      n.userId === userId && 
      new Date(n.createdAt) < beforeTime
    )
    return initialLength - storage.notifications.length
  }
}
