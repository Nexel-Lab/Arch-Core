import type { SeverityLevel } from '@sentry/nextjs'
import type { NextRequest } from 'next/server'

export type TSeverityLevel = SeverityLevel

export interface ILogData extends Record<string, unknown> {
  level?: TSeverityLevel
}

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
  debug(message: string, data?: ILogData): void
  info(message: string, data?: ILogData): void
  warn(message: string, data?: ILogData): void
  error(message: string, error: Error | unknown, extra?: ILogData): void
}

export interface IMiddlewareLogger extends ILogger {
  request(request: NextRequest): void
}
