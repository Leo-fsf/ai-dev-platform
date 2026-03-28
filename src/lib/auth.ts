import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// P0-1: 配置JWT_SECRET，运行时检查
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production')
    }
    console.warn('WARNING: JWT_SECRET not set, using default for development. DO NOT USE IN PRODUCTION!')
    return 'dev-secret-key-do-not-use-in-production'
  }
  return secret
}

export interface JWTPayload {
  userId: string
  email: string
  type?: string  // 可选字段，用于标识token类型（如password_reset, email_verify）
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  const secret = getJWTSecret()
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  const secret = getJWTSecret()
  try {
    return jwt.verify(token, secret) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

export async function validateSession(userId: string, token: string): Promise<boolean> {
  const session = await prisma.session.findUnique({
    where: { token, userId }
  })

  if (!session) return false

  // 检查是否过期
  if (new Date(session.expiresAt) < new Date()) {
    await prisma.session.delete({
      where: { id: session.id }
    })
    return false
  }

  return true
}
