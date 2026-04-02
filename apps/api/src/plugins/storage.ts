import fp from 'fastify-plugin'
import { S3Client } from '@aws-sdk/client-s3'
import multipart from '@fastify/multipart'

async function storagePlugin(app) {
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })

  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB máximo
    },
  })

  app.decorate('s3', s3)
}

export default fp(storagePlugin, { name: 'storage' })
