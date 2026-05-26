import type { NextRequest } from 'next/server'
import { prisma } from '#core/database'
import { getRedis } from '#core/database/redis'
import type { TMiddlewareSessionData } from './_header'
import { getPermissionsByRoleAndPlan } from './session.utils'

const SESSION_CACHE_TTL = 60 // seconds

const validateSession = async (
  request: NextRequest,
): Promise<TMiddlewareSessionData | null> => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.ip
  try {
    const sessionToken =
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value

    if (!sessionToken) return null

    const redis = getRedis()
    const cacheKey = `session:${sessionToken}`

    const cached = await redis.get(cacheKey).catch(() => null)
    if (cached) {
      return JSON.parse(cached) as TMiddlewareSessionData
    }

    const session = await prisma.session.findUnique({
      where: {
        sessionToken,
      },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            plan: true,
            active: true,
          },
        },
      },
    })

    if (session && session.expires < new Date()) {
      await Promise.all([
        prisma.session.delete({ where: { id: session.id } }).catch((err) => {
          console.error('Failed to delete expired session:', err)
        }),
        redis.del(cacheKey).catch(() => {}),
      ])
      return null
    }

    if (!session) {
      return null
    }

    if (!session.user || !session.user.active) {
      return null
    }

    const permissions = getPermissionsByRoleAndPlan(
      session.user.role,
      session.user.plan,
    )

    const sessionData: TMiddlewareSessionData = {
      userId: session.user.id,
      role: session.user.role,
      plan: session.user.plan,
      active: session.user.active,
      permissions,
    }

    await Promise.all([
      redis.setex(cacheKey, SESSION_CACHE_TTL, JSON.stringify(sessionData)).catch(() => {}),
      prisma.session
        .update({
          where: { id: session.id },
          data: {
            ipAddress: ip,
            userAgent: request.headers.get('user-agent') || undefined,
          },
        })
        .catch(() => {}),
    ])

    return sessionData
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

const isValidSession = (
  session: TMiddlewareSessionData | null,
): session is TMiddlewareSessionData => {
  return (
    session !== null &&
    typeof session.userId === 'string' &&
    typeof session.role === 'string' &&
    Array.isArray(session.permissions)
  )
}

export { validateSession, isValidSession }
