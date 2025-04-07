import type { Redis as RedisClient, RedisOptions } from 'ioredis'
import Redis from 'ioredis'

class RedisService {
  private connection: RedisClient | null = null
  private readonly options: RedisOptions
  public isConnected = false

  constructor(options?: RedisOptions) {
    const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env

    if (!REDIS_HOST)
      throw new Error('REDIS_HOST environment variable is missing')
    if (!REDIS_PORT)
      throw new Error('REDIS_PORT environment variable is missing')
    if (!REDIS_PASSWORD)
      throw new Error('REDIS_PASSWORD environment variable is missing')

    const port = Number(REDIS_PORT)
    if (Number.isNaN(port)) throw new Error('REDIS_PORT must be a valid number')

    this.options = options ?? {
      host: REDIS_HOST,
      port,
      password: REDIS_PASSWORD,
    }
  }

  connect(): RedisClient {
    if (this.connection && this.isConnected) return this.connection

    this.connection = new Redis(this.options)

    this.connection.on('connect', () => {
      this.isConnected = true
      console.log('🔌 Redis connected.')
    })

    this.connection.on('error', (err) => {
      this.isConnected = false
      console.error('❌ Redis connection error:', err)
    })

    return this.connection
  }

  disconnect(): void {
    if (this.connection) {
      this.connection.disconnect()
      this.isConnected = false
      console.log('🛑 Redis disconnected.')
    }
  }

  get client(): RedisClient {
    if (!this.connection) {
      throw new Error('Redis client is not connected. Call `connect()` first.')
    }
    return this.connection
  }
}

export default RedisService
export { RedisService as Redis }
