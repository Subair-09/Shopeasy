import { Router } from 'express';
import {
  adminLogin,
  adminGetMe,
  adminRefreshToken,
  adminLogout,
  adminForgotPassword,
  adminResetPassword,
} from '../controllers/adminAuth';
import {
  adminGetProducts,
  adminGetProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../controllers/adminProducts';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../controllers/adminCategories';
import {
  adminGetOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
} from '../controllers/adminOrders';
import {
  adminGetCustomers,
  adminGetCustomerById,
  adminCreateCustomer,
  adminToggleCustomerStatus,
} from '../controllers/adminCustomers';
import { adminGetDashboardData } from '../controllers/adminDashboard';
import {
  adminGetSettings,
  adminUpdateSettings,
  adminGetPromotions,
  adminCreatePromotion,
  adminGetAuditLogs,
} from '../controllers/adminSettings';
import {
  uploadImage,
  uploadMultiple,
  deleteImage,
} from '../controllers/uploadController';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/upload';
import { authenticateAdmin, requireRoles } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AdminLoginSchema, ProductCreateSchema, CategoryCreateSchema, OrderStatusUpdateSchema } from '../validators';

const router = Router();

// ==================== Public Admin Auth Routes ====================
router.post('/auth/login', validate(AdminLoginSchema), adminLogin);
router.post('/auth/refresh-token', adminRefreshToken);
router.post('/auth/forgot-password', adminForgotPassword);
router.post('/auth/reset-password', adminResetPassword);

// ==================== Protected Admin Routes ====================
router.use(authenticateAdmin);

// Auth & Profile
router.get('/auth/me', adminGetMe);
router.post('/auth/logout', adminLogout);

// Dashboard
router.get('/dashboard', adminGetDashboardData);

// Products Management
router.get('/products', adminGetProducts);
router.get('/products/:id', adminGetProductById);
router.post('/products', requireRoles(['Super Admin', 'Store Admin', 'Product Manager']), validate(ProductCreateSchema), adminCreateProduct);
router.put('/products/:id', requireRoles(['Super Admin', 'Store Admin', 'Product Manager']), adminUpdateProduct);
router.delete('/products/:id', requireRoles(['Super Admin', 'Store Admin']), adminDeleteProduct);

// Categories Management
router.get('/categories', adminGetCategories);
router.post('/categories', requireRoles(['Super Admin', 'Store Admin', 'Product Manager']), validate(CategoryCreateSchema), adminCreateCategory);
router.put('/categories/:id', requireRoles(['Super Admin', 'Store Admin', 'Product Manager']), adminUpdateCategory);
router.delete('/categories/:id', requireRoles(['Super Admin', 'Store Admin']), adminDeleteCategory);

// Orders Management
router.get('/orders', adminGetOrders);
router.get('/orders/:id', adminGetOrderById);
router.patch('/orders/:id/status', requireRoles(['Super Admin', 'Store Admin', 'Order Manager']), validate(OrderStatusUpdateSchema), adminUpdateOrderStatus);

// Customers Management
router.get('/customers', adminGetCustomers);
router.get('/customers/:id', adminGetCustomerById);
router.post('/customers', requireRoles(['Super Admin', 'Store Admin', 'Customer Support']), adminCreateCustomer);
router.patch('/customers/:id/status', requireRoles(['Super Admin', 'Store Admin']), adminToggleCustomerStatus);

// Settings, Promotions & Audit
router.get('/settings', adminGetSettings);
router.put('/settings', requireRoles(['Super Admin', 'Store Admin']), adminUpdateSettings);
router.get('/promotions', adminGetPromotions);
router.post('/promotions', requireRoles(['Super Admin', 'Store Admin']), adminCreatePromotion);
router.get('/audit-logs', requireRoles(['Super Admin']), adminGetAuditLogs);

// Cloudinary Image Upload
router.post('/upload', uploadSingleImage, uploadImage);
router.post('/upload/multiple', uploadMultipleImages, uploadMultiple);
router.delete('/upload', deleteImage);

export default router;
