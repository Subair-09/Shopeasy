import { Router } from 'express';
import {
  customerRegister,
  customerLogin,
  customerGetProfile,
  customerUpdateProfile,
  customerAddAddress,
} from '../controllers/customerAuth';
import {
  customerGetProducts,
  customerGetProductById,
  customerGetCategories,
} from '../controllers/customerProducts';
import {
  customerGetCart,
  customerAddToCart,
  customerUpdateCartItem,
  customerRemoveCartItem,
  customerClearCart,
} from '../controllers/customerCart';
import {
  customerCreateOrder,
  customerGetOrders,
  customerGetOrderById,
  customerCancelOrder,
} from '../controllers/customerOrders';
import { authenticateCustomer } from '../middleware/auth';
import { uploadSingleImage } from '../middleware/upload';
import { uploadImage } from '../controllers/uploadController';
import { validate } from '../middleware/validate';
import { CustomerRegisterSchema, CustomerLoginSchema } from '../validators';

const router = Router();

// ==================== Public Catalog Routes ====================
router.get('/products', customerGetProducts);
router.get('/products/:id', customerGetProductById);
router.get('/categories', customerGetCategories);

// ==================== Customer Auth Routes ====================
router.post('/auth/register', validate(CustomerRegisterSchema), customerRegister);
router.post('/auth/login', validate(CustomerLoginSchema), customerLogin);

// ==================== Protected Customer Routes ====================
router.use(authenticateCustomer);

// Profile & Addresses
router.get('/auth/profile', customerGetProfile);
router.put('/auth/profile', customerUpdateProfile);
router.post('/auth/address', customerAddAddress);
router.post('/upload', uploadSingleImage, uploadImage);

// Cart
router.get('/cart', customerGetCart);
router.post('/cart/items', customerAddToCart);
router.put('/cart/items/:itemId', customerUpdateCartItem);
router.delete('/cart/items/:itemId', customerRemoveCartItem);
router.delete('/cart', customerClearCart);

// Orders
router.post('/orders', customerCreateOrder);
router.get('/orders', customerGetOrders);
router.get('/orders/:id', customerGetOrderById);
router.post('/orders/:id/cancel', customerCancelOrder);

export default router;
