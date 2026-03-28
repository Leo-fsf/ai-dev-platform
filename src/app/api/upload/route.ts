import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, validateSession } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rate-limit'
import { writeFileSync, mkdirSync, unlinkSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_USER_STORAGE = 100 * 1024 * 1024 // 100MB per user
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// P0-3: 限流配置（文件接口更严格）
const RATE_LIMIT_CONFIG = {
  requests: 20,
  windowMs: 60 * 1000 // 1分钟20次请求
}

// P0-9: 验证文件名，防止路径遍历
function sanitizeFileName(fileName: string): boolean {
  // 检查文件名是否包含路径分隔符或特殊字符
  if (fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) {
    return false
  }
  if (fileName.startsWith('.')) {
    return false
  }
  return true
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
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '未提供文件' },
        { status: 400 }
      )
    }

    // P0-9: 验证文件名安全
    if (!sanitizeFileName(file.name)) {
      return NextResponse.json(
        { error: '文件名包含非法字符' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `只支持图片文件 (${ALLOWED_EXTENSIONS.join(', ')})` },
        { status: 400 }
      )
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `文件大小不能超过${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // P0-10: 检查用户存储空间限制
    const userFiles = await prisma.fileUpload.findMany({
      where: { userId }
    })

    const currentStorage = userFiles.reduce((sum, f) => sum + f.size, 0)
    if (currentStorage + file.size > MAX_USER_STORAGE) {
      return NextResponse.json(
        { error: `存储空间不足，剩余空间: ${MAX_USER_STORAGE - currentStorage}字节` },
        { status: 400 }
      )
    }

    // 验证文件扩展名
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: `不支持的文件类型` },
        { status: 400 }
      )
    }

    // 生成安全文件名
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `${randomUUID()}_${safeFileName}`

    // 确保上传目录存在
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
      mkdirSync(uploadDir, { recursive: true })
    } catch (error) {
      // 目录可能已存在，忽略错误
    }

    // 保存文件
    const filePath = join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    writeFileSync(filePath, buffer)

    // 保存到数据库
    const fileUpload = await prisma.fileUpload.create({
      data: {
        userId,
        fileName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: `/uploads/${fileName}`
      }
    })

    return NextResponse.json({
      success: true,
      file: {
        id: fileUpload.id,
        url: `/uploads/${fileName}`,
        fileName: fileUpload.fileName,
        originalName: fileUpload.originalName,
        size: fileUpload.size,
        mimeType: fileUpload.mimeType
      }
    })
  } catch (error) {
    console.error('文件上传错误:', error)
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
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

    const isValidSession = await validateSession(payload.userId, token)
    if (!isValidSession) {
      return NextResponse.json(
        { error: '会话已过期，请重新登录' },
        { status: 401 }
      )
    }

    const userId = payload.userId

    // 获取用户的文件列表
    const files = await prisma.fileUpload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({
      files: files.map((f: any) => ({
        id: f.id,
        url: f.path,
        fileName: f.fileName,
        originalName: f.originalName,
        size: f.size,
        mimeType: f.mimeType,
        createdAt: f.createdAt
      })),
      totalStorage: files.reduce((sum: number, f: any) => sum + f.size, 0),
      maxStorage: MAX_USER_STORAGE
    })
  } catch (error) {
    console.error('获取文件列表错误:', error)
    return NextResponse.json(
      { error: '获取文件列表失败' },
      { status: 500 }
    )
  }
}

// P0-11: 删除文件API（包括删除数据库记录和实际文件）
export async function DELETE(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')

    if (!fileId) {
      return NextResponse.json(
        { error: '文件ID不能为空' },
        { status: 400 }
      )
    }

    // 查找文件记录
    const fileUpload = await prisma.fileUpload.findFirst({
      where: {
        id: fileId,
        userId // 确保只能删除自己的文件
      }
    })

    if (!fileUpload) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      )
    }

    // 删除实际文件
    const filePath = join(process.cwd(), 'public', fileUpload.path)
    try {
      unlinkSync(filePath)
    } catch (error) {
      console.error('删除文件失败:', error)
      // 继续执行，删除数据库记录
    }

    // 删除数据库记录
    await prisma.fileUpload.delete({
      where: { id: fileId }
    })

    return NextResponse.json({
      success: true,
      message: '文件已删除'
    })
  } catch (error) {
    console.error('删除文件错误:', error)
    return NextResponse.json(
      { error: '删除文件失败' },
      { status: 500 }
    )
  }
}
