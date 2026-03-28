import { NextRequest, NextResponse } from 'next/server'

// P0-3: API 限流
interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitConfig {
  requests: number
  windowMs: number
}

const defaultConfig: RateLimitConfig = {
  requests: 100, // 每时间窗口请求数
  windowMs: 60 * 1000 // 时间窗口（毫秒）
}

export function rateLimit(config: RateLimitConfig = defaultConfig) {
  return (req: NextRequest): { success: boolean; remaining?: number } => {
    const key = `rate_limit_${req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'}_${req.nextUrl.pathname}`
    const now = Date.now()

    // 清理过期记录
    if (store[key] && store[key].resetTime < now) {
      delete store[key]
    }

    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      }
      return { success: true, remaining: config.requests - 1 }
    }

    if (store[key].count >= config.requests) {
      const remaining = 0
      const resetIn = Math.ceil((store[key].resetTime - now) / 1000)
      return { success: false, remaining }
    }

    store[key].count++
    return { success: true, remaining: config.requests - store[key].count }
  }
}

// 清理过期限流记录（定期执行）
setInterval(() => {
  const now = Date.now()
  const keysToDelete = Object.keys(store).filter(key => store[key].resetTime < now)
  keysToDelete.forEach(key => delete store[key])
}, 60 * 1000) // 每分钟清理一次

// P0-3: 限流中间件
export async function rateLimitMiddleware(
  request: NextRequest,
  config?: RateLimitConfig
): Promise<NextResponse | null> {
  const limiter = rateLimit(config)
  const result = limiter(request)

  if (!result.success) {
    return NextResponse.json(
      {
        error: '请求过于频繁，请稍后再试',
        retryAfter: Math.ceil((store[`rate_limit_${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'}_${request.nextUrl.pathname}`].resetTime - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          // P0-20: 修复Headers类型问题，将数字转换为字符串
          'X-RateLimit-Limit': String(config?.requests || defaultConfig.requests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(store[`rate_limit_${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'}_${request.nextUrl.pathname}`].resetTime),
          'Retry-After': String(Math.ceil((store[`rate_limit_${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'}_${request.nextUrl.pathname}`].resetTime - Date.now()) / 1000))
        }
      }
    )
  }

  return null
}
