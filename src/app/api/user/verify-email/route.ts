import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, verifyToken } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rate-limit'

// P0-3: 限流配置
const RATE_LIMIT_CONFIG = {
  requests: 5,
  windowMs: 60 * 1000 // 1分钟5次请求（防止滥用）
}

export async function POST(request: NextRequest) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult) return rateLimitResult

    const userId = request.headers.get('x-user-id') as string

    if (!userId) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 如果已经验证过，直接返回
    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        message: '邮箱已验证'
      })
    }

    // 生成验证token
    const verifyToken = generateToken({
      userId: user.id,
      email: user.email,
      type: 'email_verify'
    })

    // TODO: 发送验证邮件
    // 这里需要集成邮件服务（如Resend、SendGrid）
    // 示例代码：
    // await sendEmail({
    //   to: user.email,
    //   subject: '验证你的邮箱',
    //   html: `
    //     <p>点击以下链接验证你的邮箱：</p>
    //     <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}">
    //       验证邮箱
    //     </a>
    //   `
    // })

    console.log(`邮箱验证链接: ${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`)

    return NextResponse.json({
      success: true,
      message: '验证邮件已发送'
    })
  } catch (error) {
    console.error('发送验证邮件错误:', error)
    return NextResponse.json(
      { error: '发送失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token不能为空' },
        { status: 400 }
      )
    }

    // 验证token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: '验证链接无效或已过期' },
        { status: 401 }
      )
    }

    // 检查是否是邮箱验证token
    if (!payload.type || payload.type !== 'email_verify') {
      return NextResponse.json(
        { error: '无效的token类型' },
        { status: 401 }
      )
    }

    // 标记邮箱为已验证
    await prisma.user.update({
      where: { id: payload.userId },
      data: { isVerified: true }
    })

    return NextResponse.json({
      success: true,
      message: '邮箱验证成功'
    })
  } catch (error) {
    console.error('验证邮箱错误:', error)
    return NextResponse.json(
      { error: '验证失败，请重试' },
      { status: 500 }
    )
  }
}
