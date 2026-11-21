import { z } from 'zod';

export const AdminLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
  }),
});

export const CustomerRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
  }),
});

export const CustomerLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const ProductCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    sku: z.string().min(2, 'SKU is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    shortDescription: z.string().optional(),
    category: z.string().min(2, 'Category is required'),
    subcategory: z.string().optional(),
    price: z.number().positive('Price must be greater than 0'),
    originalPrice: z.number().positive().optional(),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    lowStockThreshold: z.number().int().nonnegative().optional(),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const CategoryCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name is required'),
    description: z.string().optional(),
    image: z.string().optional(),
    icon: z.string().optional(),
    displayOrder: z.number().optional(),
  }),
});

export const OrderStatusUpdateSchema = z.object({
  body: z.object({
    status: z.enum([
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
      'Refunded',
    ]),
    note: z.string().optional(),
    trackingNumber: z.string().optional(),
  }),
});
