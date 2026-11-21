import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { recordAuditLog } from '../utils/audit';

export const adminGetCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '' } = req.query;
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const categories = await Category.find(query).sort({ displayOrder: 1, name: 1 });

    // Sync product counts
    const populated = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat.slug, isActive: true });
        if (cat.productCount !== count) {
          cat.productCount = count;
          await cat.save();
        }
        return cat;
      })
    );

    res.json({
      success: true,
      data: {
        categories: populated,
        total: populated.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminCreateCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, description, image, icon, displayOrder } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      res.status(400).json({ success: false, message: 'A category with this name already exists' });
      return;
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      icon: icon || 'grid-outline',
      displayOrder: displayOrder || 0,
      productCount: 0,
      isActive: true,
    });

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action: 'Create Category',
      targetResource: 'Category',
      targetId: category._id.toString(),
      description: `Created category ${category.name}`,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image, icon, displayOrder, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    if (name && name !== category.name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action: 'Update Category',
      targetResource: 'Category',
      targetId: category._id.toString(),
      description: `Updated category ${category.name}`,
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const linkedProducts = await Product.countDocuments({ category: category.slug });
    if (linkedProducts > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category: ${linkedProducts} products are assigned to it. Please reassign or delete the products first.`,
      });
      return;
    }

    await Category.findByIdAndDelete(id);

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action: 'Delete Category',
      targetResource: 'Category',
      targetId: id,
      description: `Deleted category ${category.name}`,
    });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
