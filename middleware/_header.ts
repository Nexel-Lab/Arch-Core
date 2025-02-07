import type { UserRole } from '@prisma/client'

export type MiddlewareRouteConfig = {
  path: string
  roles?: string[]
  rateLimit?: {
    requests: number
    window: number // in seconds
  }
}

export type MiddlewareSessionData = {
  userId: string
  role: UserRole
  plan: string
  active: boolean
  permissions: string[] // You can define specific permissions based on role/plan
}
