import type { Scope } from '@sentry/nextjs'
import {
  captureException,
  captureMessage,
  addBreadcrumb as sentryAddBreadcrumb,
  setContext,
  setTag,
  setUser,
  withScope,
} from '@sentry/nextjs'
import type { ILogData, IRequestContext, TSeverityLevel } from '../_header'
import { SEVERITY_LEVEL } from '../_header'
import { BaseLogger } from './base'

export class SentryLogger extends BaseLogger {
  protected static _instance: SentryLogger
  private readonly defaultTags: Record<string, string>

  protected constructor() {
    super()
    this.defaultTags = {
      environment: process.env.NODE_ENV || 'production',
      service: process.env.SERVICE_NAME || 'unknown',
      version: process.env.APP_VERSION || 'unknown',
    }
  }

  public static getInstance(): SentryLogger {
    if (!SentryLogger._instance) {
      SentryLogger._instance = new SentryLogger()
    }

    return SentryLogger._instance
  }

  public captureWithLevel(
    error: Error,
    level: TSeverityLevel,
    extra?: ILogData,
  ): void {
    withScope((scope) => {
      scope.setLevel(level)
      this.configureScopeWithDefaults(scope)
      this.configureSentry(error, extra)
      captureException(error)
    })
  }

  protected logToSystem(
    level: TSeverityLevel,
    message: string,
    data?: ILogData,
  ): void {
    if (this.isDevelopment) {
      this.logToDevelopment(level, data)
      return
    }

    if (level === SEVERITY_LEVEL.ERROR || level === SEVERITY_LEVEL.FATAL) {
      this.logToProduction(message, data)
    }
  }

  private logToDevelopment(level: TSeverityLevel, data?: ILogData): void {
    const logData = {
      timestamp: new Date().toISOString(),
      ...this.currentContext,
      ...data,
    }
    switch (level) {
      case SEVERITY_LEVEL.LOG:
      case SEVERITY_LEVEL.INFO:
        console.log(logData)
        break
      case SEVERITY_LEVEL.DEBUG:
        console.debug(logData)
        break

      case SEVERITY_LEVEL.WARNING:
        console.warn(logData)
        break
      case SEVERITY_LEVEL.ERROR:
      case SEVERITY_LEVEL.FATAL:
        console.error(logData)
        break
    }
  }

  private logToProduction(message: string, data?: ILogData): void {
    withScope((scope) => {
      this.configureScopeWithDefaults(scope)
      // scope.setTag('environment', process.env.NODE_ENV)
      // scope.setTag('logger', 'SentryLogger')
      if (data?.level) {
        scope.setLevel(data.level)
      }
      if (data) {
        const sanitizedData = this.sanitizeData(data)
        scope.setExtras(sanitizedData)
      }
      if (data?.error instanceof Error) {
        scope.setTag('errorType', data.error.name)
        scope.setExtra('originalMessage', message)
        scope.setExtra('stackTrace', data.error.stack)
        captureException(data.error)
      } else {
        captureMessage(message, {
          level: SEVERITY_LEVEL.ERROR,
          extra: data,
        })
      }
    })
  }

  protected configureSentry(error: Error, extra?: ILogData): void {
    this.withScope((scope) => {
      this.configureScopeWithDefaults(scope)

      setTag('errorType', error.name)

      if (extra?.userId) {
        setUser({ id: extra.userId as string | number })
      }

      if (extra) {
        const sanitizedExtra = this.sanitizeData(extra)
        setContext('additional', sanitizedExtra)
      }

      captureException(error)
    })
  }

  private configureScopeWithDefaults(scope: Scope): void {
    // Set default tags
    for (const [key, value] of Object.entries(this.defaultTags)) {
      scope.setTag(key, value)
    }

    // Set current context
    if (Object.keys(this.currentContext).length > 0) {
      scope.setContext('custom', this.currentContext)
    }
  }

  public setRequestContext(context: IRequestContext): void {
    setContext('request', context)
    setTag('requestId', context.requestId)
  }

  public withScope(callback: (scope: Scope) => void): void {
    withScope(callback)
  }

  public addBreadcrumb(
    message: string,
    category?: string,
    level?: TSeverityLevel,
  ): void {
    sentryAddBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now(),
    })
  }

  public setTag(key: string, value: string): void {
    setTag(key, value)
  }

  public setUser(id: string, data?: Record<string, unknown>): void {
    setUser({
      id,
      ...data,
    })
  }
}
