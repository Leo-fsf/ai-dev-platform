import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserById, verifyToken, validateSession } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rate-limit'
import { Project, ProjectWithUser } from '@/types'

// P0-3: 限流配置
const RATE_LIMIT_CONFIG = {
  requests: 200,
  windowMs: 60 * 1000 // 1分钟200次请求
}

// P0-3: 私有接口限流
const PRIVATE_RATE_LIMIT_CONFIG = {
  requests: 50,
  windowMs: 60 * 1000 // 1分钟50次请求
}

export async function GET(request: NextRequest) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult) return rateLimitResult

    // 公开接口，允许未登录用户访问
    const token = request.cookies.get('auth-token')?.value
    let userId: string | null = null

    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        userId = payload.userId
      }
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          { isPublic: true }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const projectsWithParsedTags: ProjectWithUser[] = projects.map((project): ProjectWithUser => {
      let tags: string[] = []
      try {
        tags = JSON.parse(project.tags || '[]')
      } catch (error) {
        console.error('JSON解析失败:', error)
        tags = []
      }
      return {
        ...project,
        tags
      }
    })

    return NextResponse.json({ projects: projectsWithParsedTags })
  } catch (error) {
    console.error('项目列表API错误:', error)
    return NextResponse.json(
      { error: '获取项目列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, PRIVATE_RATE_LIMIT_CONFIG)
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
    const { name, description, tags, code } = await request.json()

    if (!name || !description) {
      return NextResponse.json(
        { error: '项目名称和描述不能为空' },
        { status: 400 }
      )
    }

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    const project = await prisma.project.create({
      data: {
        userId,
        name,
        description,
        tags: JSON.stringify(tags || []),
        code: code || '',
        stars: 0,
        forks: 0,
        likes: 0
      }
    })

    let parsedTags: string[] = []
    try {
      parsedTags = JSON.parse(project.tags || '[]')
    } catch (error) {
      parsedTags = []
    }

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        tags: parsedTags
      }
    })
  } catch (error) {
    console.error('创建项目API错误:', error)
    return NextResponse.json(
      { error: '创建项目失败' },
      { status: 500 }
    )
  }
}
