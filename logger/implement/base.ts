import type { TSeverityLevel, TLogData, ILogger } from '../_header'
import { SEVERITY_LEVEL } from '../_header'

export abstract class BaseLogger implements ILogger {
  protected isDevelopment = process.env.NODE_ENV === 'development'

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
      ...(data && { data }),
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

  protected abstract configureSentry(error: Error, extra?: TLogData): void
}
