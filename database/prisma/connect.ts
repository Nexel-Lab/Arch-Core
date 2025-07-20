import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// biome-ignore lint/suspicious/useAwait: <Should be Promise>
const initializePrismaClient = async (): Promise<PrismaClient> => {
  // You can add any async initialization here (e.g., checking DB migrations)
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
}

const prisma = globalForPrisma.prisma ?? (await initializePrismaClient())

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }
