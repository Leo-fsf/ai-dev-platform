import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, verifyToken } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rate-limit'

// P0-3: 限流配置
const RATE_LIMIT_CONFIG = {
  requests: 5,
  windowMs: 60 * 1000 // 1分钟5次请求（防止滥用）
}

const RESET_TOKEN_EXPIRY = '15m' // 15分钟有效期

export async function POST(request: NextRequest) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult) return rateLimitResult

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: '邮箱不能为空' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // 即使用户不存在，也返回成功（防止枚举攻击）
    if (!user) {
      console.log(`密码重置请求：邮箱 ${email} 不存在`)
      return NextResponse.json({
        success: true,
        message: '如果邮箱存在，重置链接已发送'
      })
    }

    // 生成重置token
    const resetToken = generateToken({
      userId: user.id,
      email: user.email,
      type: 'password_reset'
    })

    // TODO: 发送邮件
    // 这里需要集成邮件服务（如Resend、SendGrid）
    // 示例代码：
    // await sendEmail({
    //   to: email,
    //   subject: '重置你的密码',
    //   html: `
    //     <p>点击以下链接重置密码：</p>
    //     <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}">
    //       重置密码
    //     </a>
    //     <p>链接有效期为15分钟</p>
    //   `
    // })

    console.log(`密码重置链接: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`)

    return NextResponse.json({
      success: true,
      message: '如果邮箱存在，重置链接已发送'
    })
  } catch (error) {
    console.error('发送重置密码邮件错误:', error)
    return NextResponse.json(
      { error: '发送失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult) return rateLimitResult

    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token和新密码不能为空' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度不能少于6位' },
        { status: 400 }
      )
    }

    // 验证token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: '重置链接无效或已过期' },
        { status: 401 }
      )
    }

    // 检查是否是密码重置token
    if (!payload.type || payload.type !== 'password_reset') {
      return NextResponse.json(
        { error: '无效的token类型' },
        { status: 401 }
      )
    }

    // 更新密码
    const { hashPassword } = await import('@/lib/auth')
    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword }
    })

    // 清除所有session
    await prisma.session.deleteMany({
      where: { userId: payload.userId }
    })

    return NextResponse.json({
      success: true,
      message: '密码重置成功，请使用新密码登录'
    })
  } catch (error) {
    console.error('重置密码错误:', error)
    return NextResponse.json(
      { error: '重置失败，请重试' },
      { status: 500 }
    )
  }
}
