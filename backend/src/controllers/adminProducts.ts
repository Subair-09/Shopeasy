import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { recordAuditLog } from '../utils/audit';
import { nairaToKobo } from '../utils/currency';

export const adminGetProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '12',
      search = '',
      category = 'All Categories',
      status = 'All Status',
      sortBy = 'Latest',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All Categories' && category !== 'all') {
      query.category = (category as string).toLowerCase();
    }

    if (status && status !== 'All Status') {
      if (status === 'Active') query.isActive = true;
      if (status === 'Inactive') query.isActive = false;
      if (status === 'Out of Stock') query.stock = 0;
      if (status === 'Featured') query.isFeatured = true;
    }

    let sort: any = { createdAt: -1 };
    if (sortBy === 'Price: Low to High') sort = { discountedPriceKobo: 1 };
    if (sortBy === 'Price: High to Low') sort = { discountedPriceKobo: -1 };
    if (sortBy === 'Rating') sort = { rating: -1 };
    if (sortBy === 'Sales') sort = { salesCount: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Compute stats for header metrics matching the design:
    // Total Products: 156, Active: 142, Out of Stock: 14, Featured: 24
    const totalCount = await Product.countDocuments();
    const activeCount = await Product.countDocuments({ isActive: true });
    const outOfStockCount = await Product.countDocuments({ stock: 0 });
    const featuredCount = await Product.countDocuments({ isFeatured: true });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
        metrics: {
          totalProducts: totalCount,
          activeProducts: activeCount,
          outOfStock: outOfStockCount,
          featuredProducts: featuredCount,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, data: { product } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminCreateProduct = async (req: any, res: Response): Promise<void> => {
  try {
    const {
      name,
      sku,
      description,
      shortDescription,
      category,
      subcategory,
      price,
      originalPrice,
      stock,
      lowStockThreshold = 5,
      images,
      colors,
      sizes,
      isFeatured = false,
      isActive = true,
    } = req.body;

    // Slug generator
    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const regularPriceKobo = nairaToKobo(originalPrice || price);
    const discountedPriceKobo = nairaToKobo(price);

    const product = await Product.create({
      name,
      sku: sku.toUpperCase(),
      slug,
      description,
      shortDescription,
      category: category.toLowerCase(),
      subcategory,
      regularPriceKobo,
      discountedPriceKobo,
      stock,
      lowStockThreshold,
      images: images || [],
      colors: colors || [],
      sizes: sizes || [],
      isFeatured,
      isActive,
    });

    // Record inventory transaction
    await InventoryTransaction.create({
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      previousStock: 0,
      newStock: stock,
      quantityChanged: stock,
      reason: 'Stock In',
      adminId: req.admin?._id,
    });

    // Increment category product count
    await Category.findOneAndUpdate(
      { slug: category.toLowerCase() },
      { $inc: { productCount: 1 } }
    );

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email || 'admin@shopeasy.com',
      action: 'Product Created',
      description: `Created product "${name}" (SKU: ${sku}) priced at ₦${price}`,
      recordType: 'Product',
      recordId: product._id.toString(),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const adminUpdateProduct = async (req: any, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const {
      name,
      description,
      shortDescription,
      category,
      subcategory,
      price,
      originalPrice,
      stock,
      images,
      colors,
      sizes,
      isFeatured,
      isActive,
    } = req.body;

    if (stock !== undefined && stock !== product.stock) {
      await InventoryTransaction.create({
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        previousStock: product.stock,
        newStock: stock,
        quantityChanged: stock - product.stock,
        reason: 'Manual Adjustment',
        adminId: req.admin?._id,
      });
      product.stock = stock;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (category) product.category = category.toLowerCase();
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (price) product.discountedPriceKobo = nairaToKobo(price);
    if (originalPrice !== undefined) product.regularPriceKobo = nairaToKobo(originalPrice);
    if (images) product.images = images;
    if (colors) product.colors = colors;
    if (sizes) product.sizes = sizes;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email || 'admin@shopeasy.com',
      action: 'Product Updated',
      description: `Updated product "${product.name}" (SKU: ${product.sku})`,
      recordType: 'Product',
      recordId: product._id.toString(),
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const adminDeleteProduct = async (req: any, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    await Product.findByIdAndDelete(req.params.id);

    // Decrement category count
    await Category.findOneAndUpdate(
      { slug: product.category },
      { $inc: { productCount: -1 } }
    );

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email || 'admin@shopeasy.com',
      action: 'Product Deleted',
      description: `Deleted product "${product.name}" (SKU: ${product.sku})`,
      recordType: 'Product',
      recordId: req.params.id,
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminToggleProductStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product is now ${product.isActive ? 'Active' : 'Inactive'}`,
      data: { isActive: product.isActive },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
