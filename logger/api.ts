import type { NextApiRequest, NextApiResponse } from 'next'
import type { IRequestContext } from './_header'
import { SEVERITY_LEVEL } from './_header'
import { SentryLogger } from './implement'

class ApiLogger extends SentryLogger {
  private constructor() {
    super()
  }

  public static override getInstance(): ApiLogger {
    if (!ApiLogger._instance) {
      ApiLogger._instance = new ApiLogger()
    }
    return ApiLogger._instance as ApiLogger
  }

  public request(req: NextApiRequest, _res?: NextApiResponse): void {
    const requestContext = this.buildRequestContext(req)

    // Set request context for Sentry
    this.setRequestContext(requestContext)

    // Add request breadcrumb
    this.addBreadcrumb(
      `API ${req.method} ${req.url}`,
      'request',
      SEVERITY_LEVEL.INFO,
    )

    if (this.isDevelopment) {
      this.debug('API Request', {
        ...requestContext,
        headers: this.sanitizeHeaders(req.headers),
        query: req.query,
        body: this.sanitizeData(req.body),
      })
    }
  }

  public response(
    req: NextApiRequest,
    res: NextApiResponse,
    duration?: number,
  ): void {
    this.addBreadcrumb(
      `API Response ${res.statusCode}`,
      'response',
      res.statusCode >= 400 ? SEVERITY_LEVEL.WARNING : SEVERITY_LEVEL.INFO,
    )

    if (this.isDevelopment) {
      this.debug('API Response', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: duration ? `${duration}ms` : undefined,
      })
    }
  }

  public async withRequest<T>(
    req: NextApiRequest,
    res: NextApiResponse,
    handler: () => Promise<T>,
  ): Promise<T> {
    const startTime = Date.now()

    try {
      this.request(req, res)
      const result = await handler()
      this.response(req, res, Date.now() - startTime)
      return result
    } catch (error) {
      this.error('API Request failed', error, {
        method: req.method,
        url: req.url,
        duration: Date.now() - startTime,
      })
      throw error
    }
  }

  private buildRequestContext(req: NextApiRequest): IRequestContext {
    return {
      requestId: (req.headers['x-request-id'] as string) || crypto.randomUUID(),
      url: req.url || '',
      method: req.method || 'UNKNOWN',
      userAgent: req.headers['user-agent'],
      ip: this.getClientIp(req),
      host: req.headers.host,
      protocol: req.headers['x-forwarded-proto'] || 'http',
      pathname: req.url?.split('?')[0],
      search: req.url?.includes('?') ? req.url?.split('?')[1] : '',
    }
  }

  private getClientIp(req: NextApiRequest): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown'
    )
  }

  private sanitizeHeaders(
    headers: NextApiRequest['headers'],
  ): Record<string, string> {
    const sensitiveHeaders = ['authorization', 'cookie', 'set-cookie']
    return Object.entries(headers).reduce(
      (acc, [key, value]) => {
        acc[key] = sensitiveHeaders.includes(key.toLowerCase())
          ? '[REDACTED]'
          : (value as string)
        return acc
      },
      {} as Record<string, string>,
    )
  }
}

export const apiLogger = ApiLogger.getInstance()
