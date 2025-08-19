import type { NextRequest } from 'next/server'
import type { IMiddlewareLogger } from './_header'
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
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.ip
    if (this.isDevelopment) {
      this.debug('Incoming request', {
        method: request.method,
        path: request.nextUrl.pathname,
        userAgent: request.headers.get('user-agent'),
        ip: ip,
      })
    }
  }
}

export const middlewareLogger = MiddlewareLogger.getInstance()
