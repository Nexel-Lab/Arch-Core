import { getRedis } from './redis'

export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    await getRedis().ping()
    return true
  } catch (error) {
    console.error('Redis health check failed:', error)
    return false
  }
}

export const closeRedis = async (): Promise<void> => {
  try {
    await getRedis().quit()
  } catch (error) {
    console.error('Error closing Redis connection:', error)
  }
}
