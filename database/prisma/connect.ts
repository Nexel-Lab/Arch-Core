import { PrismaClient } from '@prisma/client'

export { PRISMA_CODE } from '#core/database/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const getPrismaClient = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    })
  }
  return globalForPrisma.prisma
}

const prisma = getPrismaClient()

export { prisma }
