import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../app/api/auth/register/route'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}))

// Mock auth functions
vi.mock('@/lib/auth', () => ({
  hashPassword: vi.fn(),
  generateToken: vi.fn()
}))

describe('Auth API - Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
      bio: null
    }

    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

    const { hashPassword, generateToken } = await import('@/lib/auth')
    vi.mocked(hashPassword).mockResolvedValue('hashed_password')
    vi.mocked(generateToken).mockReturnValue('mock_token')

    const mockRequest = {
      json: async () => ({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    } as any

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.user.email).toBe('test@example.com')
  })

  it('should return error if email already exists', async () => {
    const { prisma } = await import('@/lib/prisma')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: '1', email: 'test@example.com' })

    const mockRequest = {
      json: async () => ({
        email: 'test@example.com',
        password: 'password123'
      })
    } as any

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(data.error).toContain('已被注册')
    expect(response.status).toBe(409)
  })

  it('should return error for missing email or password', async () => {
    const mockRequest = {
      json: async () => ({
        email: '',
        password: ''
      })
    } as any

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(data.error).toContain('不能为空')
    expect(response.status).toBe(400)
  })
})
