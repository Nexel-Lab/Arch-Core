import type { NextApiRequest } from 'next'
import { SentryLogger } from './implement'

class ApiLogger extends SentryLogger {
  public request(req: NextApiRequest): void {
    if (this.isDevelopment) {
      this.debug('API request', {
        method: req.method,
        url: req.url,
        query: req.query,
      })
    }
  }
}

export const apiLogger = ApiLogger.getInstance()
