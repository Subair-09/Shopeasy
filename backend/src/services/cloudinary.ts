import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ENV } from '../config/env';

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export class CloudinaryService {
  private static isConfigured(): boolean {
    const cloudName = ENV.CLOUDINARY_CLOUD_NAME;
    const apiKey = ENV.CLOUDINARY_API_KEY;
    const apiSecret = ENV.CLOUDINARY_API_SECRET;
    return Boolean(
      cloudName &&
      apiKey &&
      apiSecret &&
      !cloudName.includes('dummy') &&
      !cloudName.includes('your_')
    );
  }

  /**
   * Upload an in-memory buffer to Cloudinary
   */
  static async uploadBuffer(
    buffer: Buffer,
    folder: string = 'shopeasy/products',
    tags: string[] = ['shopeasy']
  ): Promise<UploadResult> {
    if (!this.isConfigured()) {
      // Graceful dev fallback if credentials are not yet set
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const mockUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80`;
      console.warn(`[Cloudinary Warning] CLOUDINARY credentials not configured in backend/.env. Using placeholder image.`);
      return {
        url: mockUrl,
        secureUrl: mockUrl,
        publicId: `shopeasy/${folder}/${mockId}`,
        format: 'jpg',
        width: 800,
        height: 800,
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          tags,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Stream Error]:', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary returned empty result'));
          }
          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
      );

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  /**
   * Upload Base64 image string to Cloudinary
   */
  static async uploadBase64(
    base64Data: string,
    folder: string = 'shopeasy/products'
  ): Promise<UploadResult> {
    if (!this.isConfigured()) {
      const mockId = `mock_${Date.now()}`;
      const mockUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80`;
      return {
        url: mockUrl,
        secureUrl: mockUrl,
        publicId: `shopeasy/${folder}/${mockId}`,
        format: 'jpg',
      };
    }

    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: 'image',
    });

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  }

  /**
   * Delete an image from Cloudinary by public ID
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    if (!this.isConfigured()) return true;
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('[Cloudinary Delete Error]:', error);
      return false;
    }
  }
}
