import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, validateSession } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rate-limit'

interface Params {
  id: string
}

// P0-3: 限流配置（操作类接口更严格）
const RATE_LIMIT_CONFIG = {
  requests: 30,
  windowMs: 60 * 1000 // 1分钟30次请求
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
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
    const { action } = await request.json()

    if (!['like', 'fork'].includes(action)) {
      return NextResponse.json(
        { error: '无效的操作' },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      )
    }

    if (action === 'like') {
      // 检查是否已点赞
      const existingLike = await prisma.projectLike.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: params.id
          }
        }
      })

      if (existingLike) {
        return NextResponse.json(
          { error: '您已经点赞过该项目' },
          { status: 400 }
        )
      }

      // 创建点赞记录
      await prisma.projectLike.create({
        data: {
          userId,
          projectId: params.id
        }
      })

      // 增加点赞数
      await prisma.project.update({
        where: { id: params.id },
        data: { likes: { increment: 1 } }
      })

      return NextResponse.json({
        success: true,
        likes: project.likes + 1
      })
    } else if (action === 'fork') {
      // 修复类型不匹配，使用JSON.stringify
      const forkedProject = await prisma.project.create({
        data: {
          userId,
          name: `${project.name} (Fork)`,
          description: project.description,
          code: project.code,
          tags: JSON.stringify(JSON.parse(project.tags || '[]')), // 确保tags是字符串格式
          isPublic: true
        }
      })

      // 增加Fork数
      await prisma.project.update({
        where: { id: params.id },
        data: { forks: { increment: 1 } }
      })

      return NextResponse.json({
        success: true,
        forks: project.forks + 1,
        forkedProject
      })
    }

    return NextResponse.json(
      { error: '未知的操作' },
      { status: 400 }
    )
  } catch (error) {
    console.error('项目操作错误:', error)
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    )
  }
}
