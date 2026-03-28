import { NextRequest, NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/rate-limit'

// P0-3: 限流配置
const RATE_LIMIT_CONFIG = {
  requests: 30,
  windowMs: 60 * 1000 // 1分钟30次请求
}

// OAuth 配置（从环境变量获取）
const OAUTH_PROVIDERS = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user'
  }
}

// 模拟OAuth回调处理（生产环境需要真实实现）
export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult) return rateLimitResult

    const { provider } = params
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }

    // TODO: 真实的OAuth实现
    // 1. 用code换取access_token
    // 2. 用access_token获取用户信息
    // 3. 创建或更新用户
    // 4. 生成JWT token

    // 当前返回演示页面
    return NextResponse.json({
      success: true,
      provider,
      message: 'OAuth功能演示 - 需要配置真实的OAuth客户端ID和密钥',
      code,
      nextSteps: [
        '1. 在OAuth提供商注册应用',
        '2. 配置环境变量 (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)',
        '3. 实现token交换逻辑',
        '4. 实现用户信息获取',
        '5. 实现JWT生成'
      ]
    })
  } catch (error) {
    console.error('OAuth回调错误:', error)
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
  }
}

// OAuth授权URL生成
export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    // P0-3: 限流检查
    const rateLimitResult = await rateLimitMiddleware(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult) return rateLimitResult

    const { provider } = params
    const oauthConfig = OAUTH_PROVIDERS[provider as keyof typeof OAUTH_PROVIDERS]

    if (!oauthConfig) {
      return NextResponse.json(
        { error: '不支持的OAuth提供商' },
        { status: 400 }
      )
    }

    // 生成state参数防止CSRF
    const state = Math.random().toString(36).substring(2, 15)
    
    // 构建授权URL
    const authUrl = new URL(oauthConfig.authUrl)
    authUrl.searchParams.append('client_id', oauthConfig.clientId)
    authUrl.searchParams.append('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3200'}/api/oauth/${provider}/callback`)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', provider === 'google' ? 'profile email' : 'user:email')
    authUrl.searchParams.append('state', state)

    return NextResponse.json({
      success: true,
      authUrl: authUrl.toString(),
      state,
      provider
    })
  } catch (error) {
    console.error('OAuth授权错误:', error)
    return NextResponse.json(
      { error: 'OAuth授权失败' },
      { status: 500 }
    )
  }
}
