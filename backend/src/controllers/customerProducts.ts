import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

export const customerGetProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, sort, isFeatured, limit = '20', page = '1' } = req.query;

    const query: any = { isActive: true };

    if (category && category !== 'All' && category !== 'all') {
      query.category = (category as string).toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ];
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    let sortObj: any = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { discountedPriceKobo: 1 };
    if (sort === 'price_desc') sortObj = { discountedPriceKobo: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'popular') sortObj = { salesCount: -1 };

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerGetProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4);

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerGetCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json({
      success: true,
      data: { categories },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
