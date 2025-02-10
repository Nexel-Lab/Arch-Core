import type { NextRequest } from 'next/server'
import type { SeverityLevel } from '@sentry/types'

export type TSeverityLevel = SeverityLevel

export type TLogData = Record<string, any>

export enum SEVERITY_LEVEL {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warning',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface IRequestContext extends Record<string, unknown> {
  requestId: string
  url: string
  method: string
  userAgent?: string
  ip?: string
  [key: string]: unknown
}

export interface ILogger {
  debug(message: string, data?: TLogData): void
  info(message: string, data?: TLogData): void
  warn(message: string, data?: TLogData): void
  error(message: string, error: Error | unknown, extra?: TLogData): void
}

export interface IMiddlewareLogger extends ILogger {
  request(request: NextRequest): void
}
