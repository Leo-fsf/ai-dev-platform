import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserById, verifyToken, validateSession } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rate-limit'

// P0-3: 限流配置
const RATE_LIMIT_CONFIG = {
  requests: 100,
  windowMs: 60 * 1000 // 1分钟100次请求
}

export async function GET(request: NextRequest) {
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

    // P0-2: 验证Session是否有效
    const isValidSession = await validateSession(payload.userId, token)
    if (!isValidSession) {
      return NextResponse.json(
        { error: '会话已过期，请重新登录' },
        { status: 401 }
      )
    }

    const userId = payload.userId

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 获取用户统计
    const projectCount = await prisma.project.count({
      where: { userId }
    })

    const totalLikes = await prisma.project.aggregate({
      where: { userId },
      _sum: { likes: true }
    })

    const totalForks = await prisma.project.aggregate({
      where: { userId },
      _sum: { forks: true }
    })

    return NextResponse.json({
      user,
      stats: {
        projectCount,
        totalLikes: totalLikes._sum.likes || 0,
        totalForks: totalForks._sum.forks || 0
      }
    })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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

    // P0-2: 验证Session是否有效
    const isValidSession = await validateSession(payload.userId, token)
    if (!isValidSession) {
      return NextResponse.json(
        { error: '会话已过期，请重新登录' },
        { status: 401 }
      )
    }

    const userId = payload.userId
    const { name, bio, avatar } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar })
      }
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
    console.error('更新用户信息错误:', error)
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    )
  }
}
