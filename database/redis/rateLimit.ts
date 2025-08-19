import { redis } from './redis'

interface IRateLimitOptions {
  requests: number
  window: string // e.g., '1h', '1m', '1s'
}

interface IRateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

const parseWindow = (window: string): number => {
  const unit = window.slice(-1)
  const value = parseInt(window.slice(0, -1))

  switch (unit) {
    case 's':
      return value * 1000
    case 'm':
      return value * 60 * 1000
    case 'h':
      return value * 60 * 60 * 1000
    case 'd':
      return value * 24 * 60 * 60 * 1000
    default:
      throw new Error(`Invalid window format: ${window}`)
  }
}

export const ratelimit = {
  async limit(
    key: string,
    options: IRateLimitOptions,
  ): Promise<IRateLimitResult> {
    try {
      const windowMs = parseWindow(options.window)
      const now = Date.now()
      const windowStart = Math.floor(now / windowMs) * windowMs

      const pipeline = redis.pipeline()
      const countKey = `ratelimit:${key}:${windowStart}`

      // Increment counter
      pipeline.incr(countKey)
      // Set expiration (only if key is new)
      pipeline.expire(countKey, Math.ceil(windowMs / 1000))

      const results = await pipeline.exec()
      const count = results?.[0]?.[1] as number

      const success = count <= options.requests
      const remaining = Math.max(0, options.requests - count)

      return {
        success,
        remaining,
        reset: windowStart + windowMs,
      }
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Fail open - allow request if Redis is down
      return {
        success: true,
        remaining: options.requests - 1,
        reset: Date.now() + parseWindow(options.window),
      }
    }
  },

  // Clear rate limit for a key (useful for testing or admin overrides)
  async clear(key: string): Promise<void> {
    try {
      const pattern = `ratelimit:${key}:*`
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Error clearing rate limit:', error)
    }
  },

  // Get current rate limit status without incrementing
  async status(
    key: string,
    options: IRateLimitOptions,
  ): Promise<IRateLimitResult> {
    try {
      const windowMs = parseWindow(options.window)
      const now = Date.now()
      const windowStart = Math.floor(now / windowMs) * windowMs
      const countKey = `ratelimit:${key}:${windowStart}`

      const count = await redis.get(countKey)
      const currentCount = count ? parseInt(count) : 0

      const success = currentCount < options.requests
      const remaining = Math.max(0, options.requests - currentCount)

      return {
        success,
        remaining,
        reset: windowStart + windowMs,
      }
    } catch (error) {
      console.error('Rate limit status error:', error)
      return {
        success: true,
        remaining: options.requests,
        reset: Date.now() + parseWindow(options.window),
      }
    }
  },
}
