// src/lib/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Uploads a buffer to S3 and returns the public URL.
 * Files are stored under a folder named after the user ID.
 */
export async function uploadToS3(userId: string, file: Buffer, originalName: string, mimeType: string): Promise<string> {
  const extension = path.extname(originalName);
  const key = `${userId}/${uuidv4()}${extension}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET || '',
    Key: key,
    Body: file,
    ContentType: mimeType,
    ACL: 'public-read',
  });
  await s3.send(command);
  const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
  return url;
}
