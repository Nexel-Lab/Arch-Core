import { protectedRoutes } from '@config/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { middlewareLogger as logger } from '../logger'
// import { applySecurityHeaders } from './security'
import { checkRateLimit } from './rateLimit'
import { isValidSession, validateSession } from './session'
import {
  addCustomHeaders,
  redirectToLogin,
  // logRequest,
  // logError,
} from './utils'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const requestStartTime = Date.now()

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.ip

  try {
    // applySecurityHeaders(response)
    const pathname = request.nextUrl.pathname
    const protectedRoute = protectedRoutes.find((route) =>
      pathname.startsWith(route.path),
    )
    if (!protectedRoute) {
      return response
    }

    const sessionData = await validateSession(request)
    if (!isValidSession(sessionData)) {
      return redirectToLogin(request)
    }

    if (
      protectedRoute.roles &&
      !protectedRoute.roles.includes(sessionData.role)
    ) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (ip && protectedRoute.rateLimit) {
      const rateLimited = checkRateLimit(ip, protectedRoute.rateLimit)
      if (rateLimited) {
        return new NextResponse('Too Many Requests', { status: 429 })
      }
    }

    addCustomHeaders(response, requestStartTime)
    logger.request(request)

    return response
  } catch (error) {
    logger.error('Middleware error', error, {
      request: {
        url: request.url,
        method: request.method,
      },
    })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
