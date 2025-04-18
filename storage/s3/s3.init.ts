import { S3Client } from '@aws-sdk/client-s3'
import { env } from '@env'

const missingEnvs = (): string[] => {
  const keys = []
  if (!process.env.S3_UPLOAD_KEY) keys.push('S3_UPLOAD_KEY')
  if (!process.env.S3_UPLOAD_SECRET) keys.push('S3_UPLOAD_SECRET')
  if (!process.env.S3_UPLOAD_ENDPOINT) keys.push('S3_UPLOAD_ENDPOINT')
  if (!process.env.S3_UPLOAD_BUCKET) keys.push('S3_UPLOAD_BUCKET')
  return keys
}

const getS3Client = (): S3Client => {
  const missing = missingEnvs()
  if (missing.length > 0)
    throw new Error(`S3Client: Missing ENVs ${missing.join(', ')}`)

  return new S3Client({
    credentials: {
      accessKeyId: env.S3_UPLOAD_KEY,
      secretAccessKey: env.S3_UPLOAD_SECRET,
    },
    region: env.S3_UPLOAD_REGION,
    endpoint: env.S3_UPLOAD_ENDPOINT,
  })
}

const globalForS3 = globalThis as unknown as {
  s3?: S3Client
}

const s3 = globalForS3.s3 ?? (globalForS3.s3 = getS3Client())

export { s3 }
