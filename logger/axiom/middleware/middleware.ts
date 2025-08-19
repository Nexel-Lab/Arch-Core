import { transformMiddlewareRequest } from '@axiomhq/nextjs'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { logger } from '../server'

export const axiomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
) => {
  logger.info(...transformMiddlewareRequest(request))
  event.waitUntil(logger.flush())
}

export const axiomMiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
