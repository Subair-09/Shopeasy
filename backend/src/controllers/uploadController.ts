import { Request, Response } from 'express';
import { CloudinaryService } from '../services/cloudinary';

export const uploadImage = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file uploaded' });
      return;
    }

    const folder = req.body.folder || 'shopeasy/products';
    const result = await CloudinaryService.uploadBuffer(req.file.buffer, folder);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      data: {
        url: result.secureUrl,
        publicId: result.publicId,
        format: result.format,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
};

export const uploadMultiple = async (req: any, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No image files uploaded' });
      return;
    }

    const folder = req.body.folder || 'shopeasy/products';
    const uploadPromises = files.map((file) =>
      CloudinaryService.uploadBuffer(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);

    res.status(201).json({
      success: true,
      message: `${results.length} images uploaded successfully`,
      data: {
        images: results.map((r) => ({
          url: r.secureUrl,
          publicId: r.publicId,
        })),
        urls: results.map((r) => r.secureUrl),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Batch upload failed' });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      res.status(400).json({ success: false, message: 'publicId is required' });
      return;
    }

    const deleted = await CloudinaryService.deleteImage(publicId);
    res.json({
      success: true,
      message: deleted ? 'Image removed successfully' : 'Could not delete image',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
