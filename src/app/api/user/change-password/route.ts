import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, verifyPassword, hashPassword, validateSession } from '@/lib/auth'
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
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '当前密码和新密码不能为空' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度不能少于6位' },
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

    // 验证当前密码
    const isValidPassword = await verifyPassword(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '当前密码错误' },
        { status: 401 }
      )
    }

    // 更新密码
    const hashedPassword = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    // 清除所有session，要求重新登录
    await prisma.session.deleteMany({
      where: { userId }
    })

    return NextResponse.json({
      success: true,
      message: '密码修改成功，请重新登录'
    })
  } catch (error) {
    console.error('修改密码错误:', error)
    return NextResponse.json(
      { error: '修改密码失败' },
      { status: 500 }
    )
  }
}
