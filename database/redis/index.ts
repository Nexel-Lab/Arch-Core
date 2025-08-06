import { env } from '@env'
import type { Redis as RedisClient, RedisOptions } from 'ioredis'
import { Redis } from 'ioredis'

interface ServiceOptions {
  log: ('query' | 'error' | 'warn')[]
  redisOptions?: RedisOptions | string
}

class RedisService {
  private static _instance: RedisService | null = null
  private _connection: RedisClient | null = null
  private readonly _redisOptions: RedisOptions | string
  private readonly _serviceOptions: ServiceOptions
  public isConnected = false
  private _logQuery = true
  private _logWarn = true
  private _logError = true

  constructor(options?: ServiceOptions) {
    const { REDIS_URI } = env

    if (!REDIS_URI) throw new Error('REDIS_URI environment variable is missing')

    this._redisOptions = options?.redisOptions ?? REDIS_URI
    this._serviceOptions = options ?? {
      log: ['error'],
    }
    const logOptions = options?.log ?? ['error']
    this._logQuery = logOptions.includes('query')
    this._logWarn = logOptions.includes('warn')
    this._logError = logOptions.includes('error')

    if (typeof this._redisOptions !== 'string') {
      this._redisOptions = {
        ...this._redisOptions,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        family: 4,
      }
    }
  }

  private _connect(): RedisClient {
    if (this._connection && this.isConnected) {
      return this._connection
    }

    try {
      if (typeof this._redisOptions === 'string') {
        this._connection = new Redis(this._redisOptions) // URI string overload
      } else {
        this._connection = new Redis(this._redisOptions) // RedisOptions object overload
      }

      this._connection.on('connect', () => {
        this.isConnected = true
        console.log('🔌 Redis connected.')
      })

      this._connection.on('ready', () => {
        this.isConnected = true
        if (this._logQuery) console.log('✅ Redis ready for commands.')
      })

      this._connection.on('error', (err) => {
        this.isConnected = false
        if (this._logError) {
          console.error('❌ Redis connection error:', err)
        }
      })

      this._connection.on('close', () => {
        this.isConnected = false
        if (this._logWarn) {
          console.warn('⚠️ Redis connection closed.')
        }
      })

      return this._connection
    } catch (error) {
      this.isConnected = false
      if (this._logError) {
        console.error('❌ Failed to create Redis connection:', error)
      }
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (this._connection) {
      try {
        await this._connection.quit()
      } catch (error) {
        if (this._logWarn) {
          console.warn(
            '⚠️ Error during graceful shutdown, forcing disconnect:',
            error,
          )
        }
        this._connection.disconnect()
      } finally {
        this._connection = null
        this.isConnected = false
        console.log('🛑 Redis disconnected.')
      }
    }
  }

  get client(): RedisClient {
    if (!this._connection) {
      this._connection = this._connect()
    }
    return this._connection
  }

  public static getInstance(options?: ServiceOptions): RedisService {
    if (!RedisService._instance) {
      RedisService._instance = new RedisService(options)
    }
    return RedisService._instance
  }

  public async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping()
      return result === 'PONG'
    } catch (error) {
      if (this._logError) {
        console.error('❌ Redis ping failed:', error)
      }
      return false
    }
  }
}

export default RedisService
export { RedisService as Redis }
