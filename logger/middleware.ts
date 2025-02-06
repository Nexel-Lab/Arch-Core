import type { IMiddlewareLogger } from './_header'
import type { NextRequest } from 'next/server'
import { SentryLogger } from './implement'

class MiddlewareLogger extends SentryLogger implements IMiddlewareLogger {
  private static instance: MiddlewareLogger

  private constructor() {
    super()
  }

  public static getInstance(): MiddlewareLogger {
    if (!MiddlewareLogger.instance) {
      MiddlewareLogger.instance = new MiddlewareLogger()
    }
    return MiddlewareLogger.instance
  }
  public request(request: NextRequest): void {
    if (this.isDevelopment) {
      this.debug('Incoming request', {
        method: request.method,
        path: request.nextUrl.pathname,
        userAgent: request.headers.get('user-agent'),
        ip: request.ip,
      })
    }
  }
}

export const middlewareLogger = MiddlewareLogger.getInstance()
