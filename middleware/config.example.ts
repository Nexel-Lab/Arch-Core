import { TIME_CONSTANTS } from '@constants'
import type { UserRole } from '@prisma/client'
import type { MiddlewareRouteConfig } from '#core/middleware'

const config = {
  matcher: [
    '/app/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/api/:path*',
  ],
}

const protectedRoutes: MiddlewareRouteConfig[] = [
  {
    path: '/app',
    roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] as UserRole[],
    rateLimit: {
      requests: 100, // Allow 100 requests
      window: TIME_CONSTANTS.IN_SECONDS.MINUTE, // per 60 seconds (1 minute)
    },
  },
  {
    path: '/dashboard',
    roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] as UserRole[],
    rateLimit: { requests: 50, window: TIME_CONSTANTS.IN_SECONDS.MINUTE },
  },
  {
    path: '/admin',
    roles: ['ADMIN', 'SUPER_ADMIN'] as UserRole[],
    rateLimit: {
      requests: 100,
      window: TIME_CONSTANTS.IN_SECONDS.MINUTE,
    },
  },
  {
    path: '/settings',
    roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] as UserRole[],
    rateLimit: {
      requests: 200,
      window: TIME_CONSTANTS.IN_SECONDS.HOUR,
    },
  },
]

export { config, protectedRoutes }
