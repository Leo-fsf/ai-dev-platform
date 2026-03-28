import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, verifyPassword, validateSession } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rate-limit'

// P0-3: 限流配置（敏感操作更严格）
const RATE_LIMIT_CONFIG = {
  requests: 10,
  windowMs: 60 * 1000 // 1分钟10次请求
}

export async function POST(request: NextRequest) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult) return rateLimitResult

    // P0-2: Session验证
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: '无效的token' },
        { status: 401 }
      )
    }

    const isValidSession = await validateSession(payload.userId, token)
    if (!isValidSession) {
      return NextResponse.json(
        { error: '会话已过期，请重新登录' },
        { status: 401 }
      )
    }

    const userId = payload.userId
    const { newEmail, password } = await request.json()

    if (!newEmail || !password) {
      return NextResponse.json(
        { error: '新邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已被使用
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    })

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: '该邮箱已被其他用户使用' },
        { status: 400 }
      )
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    // 更新邮箱
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio
      }
    })
  } catch (error) {
    console.error('修改邮箱错误:', error)
    return NextResponse.json(
      { error: '修改邮箱失败' },
      { status: 500 }
    )
  }
}
