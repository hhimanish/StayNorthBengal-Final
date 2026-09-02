// src/api/kyc/upload.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth-token'; // helper to extract user from JWT cookie
import { uploadToS3 } from '@/lib/s3';
import prisma from '@/lib/prisma';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // we will use formidable for multipart
  },
};

/**
 * POST /api/kyc/upload
 * Expects multipart/form-data with fields:
 *   - type: string (e.g., "passport")
 *   - file: binary
 */
export async function POST(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }
    const userId = token.sub; // JWT payload should contain sub = userId

    const form = new formidable.IncomingForm({
      maxFileSize: 5 * 1024 * 1024, // 5 MB limit
    });

    const formData: any = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const type = (formData.fields.type as string) || 'unknown';
    const file = (formData.files.file as formidable.File) as formidable.File;
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const fileBuffer = await fs.promises.readFile(file.filepath);
    const url = await uploadToS3(userId, fileBuffer, file.originalFilename || 'document', file.mimetype || 'application/octet-stream');

    // Persist KYC document record
    await prisma.kycDocument.create({
      data: {
        userId,
        url,
        type,
        verified: false,
        uploadedAt: new Date(),
      },
    });

    // Cleanup temp file
    await fs.promises.unlink(file.filepath);

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error('KYC upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
