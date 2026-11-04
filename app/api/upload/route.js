import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getClientIp, rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB max upload

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    // SECURITY: Limit uploads to 20 uploads per 10 minutes per IP
    const MAX_UPLOADS = 20;
    const rl = rateLimit('upload_ip', clientIp, MAX_UPLOADS, 10 * 60);
    const rlHeaders = getRateLimitHeaders(rl, MAX_UPLOADS);

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Upload rate limit exceeded. Please wait a few minutes before uploading more images.' },
        { status: 429, headers: rlHeaders }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: rlHeaders });
    }

    // SECURITY: File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit. Please compress your image.' },
        { status: 400, headers: rlHeaders }
      );
    }

    const mimeType = (file.type || '').toLowerCase();
    const originalName = file.name || 'upload.png';
    const ext = (originalName.split('.').pop() || '').toLowerCase();

    // SECURITY: Whitelist MIME type & file extension against executable scripts (.php, .exe, .sh)
    if (!ALLOWED_MIME_TYPES.has(mimeType) || !ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WEBP, and SVG images are allowed.' },
        { status: 400, headers: rlHeaders }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate sanitized unique file name with alphanumeric characters only
    const safeExt = ext.replace(/[^a-z0-9]/g, '');
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${safeExt}`;

    const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
    const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const r2Endpoint = process.env.R2_ENDPOINT;
    const r2BucketName = process.env.R2_BUCKET_NAME;
    const r2PublicUrl = process.env.R2_PUBLIC_URL;

    // Graceful fallback to Base64 data URL if R2 credentials are missing
    if (!r2AccessKeyId || !r2SecretAccessKey || !r2Endpoint || !r2BucketName) {
      console.warn('Cloudflare R2 credentials missing. Falling back to Base64 Data URL.');
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ url: dataUrl });
    }

    // Initialize S3 client for Cloudflare R2
    const s3 = new S3Client({
      region: 'auto',
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: r2BucketName,
        Key: fileName,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    // Format public URL
    const publicUrl = r2PublicUrl 
      ? `${r2PublicUrl.replace(/\/$/, '')}/${fileName}`
      : `${r2Endpoint.replace(/\/$/, '')}/${r2BucketName}/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('R2 Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
