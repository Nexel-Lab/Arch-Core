import { Redis as RedisService } from './init'

const globalForRedis = globalThis as unknown as {
  redisService?: RedisService
}

const getRedisService = (): RedisService => {
  if (!globalForRedis.redisService) {
    globalForRedis.redisService = RedisService.getInstance({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    })
  }
  return globalForRedis.redisService
}

// Lazy accessors to avoid connecting at import-time during build
export const getRedis = () => getRedisService().client
export const redisService = getRedisService()
export const redis = getRedis()
