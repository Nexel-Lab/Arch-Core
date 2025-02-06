import type { TSeverityLevel, TLogData } from '../_header'
import { SEVERITY_LEVEL } from '../_header'
import {
  captureException,
  captureMessage,
  setContext,
  setUser,
  setTag,
  withScope,
} from '@sentry/nextjs'
import { BaseLogger } from './base'

export class SentryLogger extends BaseLogger {
  private static _instance: SentryLogger

  protected constructor() {
    super()
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
    extra?: TLogData,
  ): void {
    withScope((scope) => {
      scope.setLevel(level)
      this.configureSentry(error, extra)
      captureException(error)
    })
  }

  protected logToSystem(
    level: TSeverityLevel,
    message: string,
    data?: TLogData,
  ): void {
    if (this.isDevelopment) {
      this.logToDevelopment(level, data)
      return
    }

    if (level === SEVERITY_LEVEL.ERROR || level === SEVERITY_LEVEL.FATAL) {
      this.logToProduction(message, data)
    }
  }

  private logToDevelopment(level: TSeverityLevel, data?: TLogData): void {
    switch (level) {
      case SEVERITY_LEVEL.LOG:
      case SEVERITY_LEVEL.INFO:
        console.log(data)
        break
      case SEVERITY_LEVEL.DEBUG:
        console.debug(data)
        break

      case SEVERITY_LEVEL.WARNING:
        console.warn(data)
        break
      case SEVERITY_LEVEL.ERROR:
      case SEVERITY_LEVEL.FATAL:
        console.error(data)
        break
    }
  }

  private logToProduction(message: string, data?: TLogData): void {
    if (data?.error instanceof Error) {
      captureException(data.error, {
        extra: data,
      })
    } else {
      captureMessage(message, {
        level: SEVERITY_LEVEL.ERROR,
        extra: data,
      })
    }
  }

  protected configureSentry(error: Error, extra?: TLogData): void {
    setTag('location', 'middleware')
    setTag('errorType', error.name)

    if (extra?.userId) {
      setUser({ id: extra.userId })
    }
    if (extra) {
      setContext('additional', extra)
    }

    captureException(error)
  }
}
