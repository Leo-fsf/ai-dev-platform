import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// P0-1: 用户登出API
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        // 删除当前Session记录
        await prisma.session.deleteMany({
          where: {
            userId: payload.userId,
            token
          }
        })
      }
    }

    // 清除auth-token cookie
    const response = NextResponse.json({
      success: true,
      message: '登出成功'
    })

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('登出错误:', error)
    return NextResponse.json(
      {
        success: true,
        message: '登出成功'
      },
      { status: 200 }
    )
  }
}
