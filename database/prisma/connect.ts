import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

// if (process.env.NODE_ENV !== 'production')
//   globalForPrisma.prisma = prisma as PrismaClient

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

export { prisma }
