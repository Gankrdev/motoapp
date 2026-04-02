import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

const BUCKET = process.env.R2_BUCKET_NAME!

export async function uploadFile(s3: S3Client, file: Buffer, mimetype: string) {
  const ext = mimetype.split('/')[1] // ej: 'image/jpeg' → 'jpeg'
  const key = `uploads/${randomUUID()}.${ext}`

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file,
    ContentType: mimetype,
  }))

  return key
}

export async function deleteFile(s3: S3Client, key: string) {
  await s3.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }))
}
