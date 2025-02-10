import type {
  TSeverityLevel,
  TLogData,
  ILogger,
  IRequestContext,
} from '../_header'
import { SEVERITY_LEVEL } from '../_header'
import type { Scope } from '@sentry/nextjs'

export abstract class BaseLogger implements ILogger {
  protected isDevelopment = process.env.NODE_ENV === 'development'
  protected currentContext: Record<string, any> = {}
  private logQueue: Array<{
    level: TSeverityLevel
    message: string
    data?: TLogData
  }> = []
  private batchSize = 10
  private rateLimiter = new Map<string, number>()

  protected abstract logToSystem(
    level: TSeverityLevel,
    message: string,
    data?: TLogData,
  ): void

  protected log(level: TSeverityLevel, message: string, data?: TLogData) {
    if (!this.isDevelopment && level === SEVERITY_LEVEL.DEBUG) return

    const timestamp = new Date().toISOString()
    const TLogData = {
      timestamp,
      level,
      message,
      ...(data && { data: this.sanitizeData(data) }),
    }

    this.logToSystem(level, message, TLogData)
  }

  public debug(message: string, data?: TLogData): void {
    this.log(SEVERITY_LEVEL.DEBUG, message, data)
  }

  public info(message: string, data?: TLogData): void {
    this.log(SEVERITY_LEVEL.INFO, message, data)
  }

  public warn(message: string, data?: TLogData): void {
    this.log(SEVERITY_LEVEL.WARNING, message, data)
  }

  public error(
    message: string,
    error: Error | unknown,
    extra?: TLogData,
  ): void {
    if (error instanceof Error) {
      if (!this.isDevelopment) {
        this.configureSentry(error, extra)
      }

      this.log(SEVERITY_LEVEL.ERROR, message, {
        error,
        ...extra,
        stack: error.stack,
      })
    } else {
      this.log(SEVERITY_LEVEL.ERROR, message, {
        error: String(error),
        ...extra,
      })
    }
  }

  public queueLog(
    level: TSeverityLevel,
    message: string,
    data?: TLogData,
  ): void {
    this.logQueue.push({ level, message, data })

    if (this.logQueue.length >= this.batchSize) {
      this.flushLogs()
    }
  }

  protected flushLogs(): void {
    while (this.logQueue.length > 0) {
      const log = this.logQueue.shift()
      if (log) {
        this.log(log.level, log.message, log.data)
      }
    }
  }

  protected shouldRateLimit(key: string, timeWindowMs: number = 1000): boolean {
    const now = Date.now()
    const lastLog = this.rateLimiter.get(key)

    if (!lastLog || now - lastLog >= timeWindowMs) {
      this.rateLimiter.set(key, now)
      return false
    }
    return true
  }

  protected sanitizeData(data: TLogData): TLogData {
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'credentials',
      'apiKey',
    ]
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) {
        acc[key] = this.sanitizeData(value as TLogData)
      } else {
        acc[key] = sensitiveKeys.includes(key.toLowerCase())
          ? '[REDACTED]'
          : value
      }
      return acc
    }, {} as TLogData)
  }

  public async withContext<T>(
    context: Record<string, any>,
    callback: () => Promise<T>,
  ): Promise<T> {
    const oldContext = { ...this.currentContext }
    Object.assign(this.currentContext, context)

    try {
      return await callback()
    } finally {
      this.currentContext = oldContext
    }
  }

  protected abstract configureSentry(error: Error, extra?: TLogData): void
  // protected abstract setRequestContext(context: IRequestContext): void
  // protected abstract withScope(callback: (scope: Scope) => void): void
  // protected abstract addBreadcrumb(
  //   message: string,
  //   category?: string,
  //   level?: TSeverityLevel,
  // ): void
}
