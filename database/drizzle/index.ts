import { env } from '@env'
import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleOrm } from 'drizzle-orm/neon-http'

const globalForDrizzle = globalThis as unknown as {
  drizzle?: ReturnType<typeof drizzleOrm>
}

const getDrizzleClient = () => {
  if (!globalForDrizzle.drizzle) {
    const sql = neon(env.PGSQL_URI)
    globalForDrizzle.drizzle = drizzleOrm({ client: sql })
  }
  return globalForDrizzle.drizzle
}

const drizzle = getDrizzleClient()

export { drizzle }
