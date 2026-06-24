import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'application/octet-stream';
    const originalName = file.name || 'upload';
    
    // Generate unique file name
    const ext = originalName.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

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
