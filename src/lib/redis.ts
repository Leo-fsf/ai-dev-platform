import { Redis } from 'ioredis'

// Redis客户端（可选，用于缓存和会话管理）
let redisClient: Redis | null = null

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL not configured, Redis caching disabled')
    return null
  }

  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
    })

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })
  }

  return redisClient
}

// 缓存操作
export async function cacheGet(key: string): Promise<string | null> {
  const client = getRedisClient()
  if (!client) return null

  try {
    return await client.get(key)
  } catch (error) {
    console.error('Redis GET error:', error)
    return null
  }
}

export async function cacheSet(
  key: string,
  value: string,
  expirySeconds: number = 3600
): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.setex(key, expirySeconds, value)
    return true
  } catch (error) {
    console.error('Redis SET error:', error)
    return false
  }
}

export async function cacheDel(key: string): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.del(key)
    return true
  } catch (error) {
    console.error('Redis DEL error:', error)
    return false
  }
}

export async function cacheFlush(): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.flushall()
    return true
  } catch (error) {
    console.error('Redis FLUSH error:', error)
    return false
  }
}

// 断开Redis连接
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}
