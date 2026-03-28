import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, validateSession } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rate-limit'

interface Params {
  id: string
}

// P0-3: 限流配置
const PUBLIC_RATE_LIMIT = {
  requests: 200,
  windowMs: 60 * 1000
}

const PRIVATE_RATE_LIMIT = {
  requests: 50,
  windowMs: 60 * 1000
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, PUBLIC_RATE_LIMIT)
    if (rateLimitResult) return rateLimitResult

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      project: {
        ...project,
        tags: JSON.parse(project.tags || '[]')
      }
    })
  } catch (error) {
    console.error('获取项目详情错误:', error)
    return NextResponse.json(
      { error: '获取项目详情失败' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, PRIVATE_RATE_LIMIT)
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
    const { name, description, tags, code, isPublic } = await request.json()

    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      )
    }

    // 权限检查
    if (project.userId !== userId) {
      return NextResponse.json(
        { error: '无权限修改此项目' },
        { status: 403 }
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(code !== undefined && { code }),
        ...(isPublic !== undefined && { isPublic })
      }
    })

    return NextResponse.json({
      success: true,
      project: {
        ...updatedProject,
        tags: JSON.parse(updatedProject.tags || '[]')
      }
    })
  } catch (error) {
    console.error('更新项目错误:', error)
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, PRIVATE_RATE_LIMIT)
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

    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      )
    }

    // 权限检查
    if (project.userId !== userId) {
      return NextResponse.json(
        { error: '无权限删除此项目' },
        { status: 403 }
      )
    }

    await prisma.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('删除项目错误:', error)
    return NextResponse.json(
      { error: '删除项目失败' },
      { status: 500 }
    )
  }
}
