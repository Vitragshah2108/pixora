import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file provided' },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dsge8blb5';
    const apiKey = process.env.CLOUDINARY_API_KEY || '983422833616822';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || '09ZR_7OhIXDwqSDeH5hiaoExxQI';
    const timestamp = Math.round(Date.now() / 1000);

    const signatureStr = `folder=image-sharing-app&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', dataUri);
    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('signature', signature);
    cloudinaryFormData.append('folder', 'image-sharing-app');

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    const cloudinaryData = await cloudinaryRes.json();

    if (!cloudinaryRes.ok) {
      console.error('Cloudinary upload error:', cloudinaryData);
      return NextResponse.json(
        {
          success: false,
          message: cloudinaryData.error?.message || 'Failed to upload image to Cloudinary',
        },
        { status: cloudinaryRes.status }
      );
    }

    const fileSizeKB = Math.round(file.size / 1024);

    return NextResponse.json({
      statusCode: 200,
      data: {
        imageUrl: cloudinaryData.secure_url || cloudinaryData.url,
        publicId: cloudinaryData.public_id,
        imageSize: fileSizeKB,
      },
      message: 'Temporary image uploaded successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error in upload-temp route:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

