import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const publicPaths = ['/api/auth/login', '/api/auth/register', '/login', '/_next', '/static', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 公开路径放行
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // P0-2: 检查认证token
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // API路由返回401，页面路由重定向到登录
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // P0-2: 验证token
  const payload = verifyToken(token)
  if (!payload) {
    // 清除无效token
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token', { path: '/' })
    return response
  }

  // 注意：middleware 不能使用 async/await，Session 验证在 API 路由中进行

  // 添加用户信息到请求头
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId)
  requestHeaders.set('x-user-email', payload.email)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api/health|_next/static|_next/image|favicon.ico).*)',
  ],
}
