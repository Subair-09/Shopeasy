import { Router } from 'express';
import {
  initializeOrderPayment,
  verifyOrderPayment,
  paystackWebhookHandler,
} from '../controllers/paymentController';
import { authenticateCustomer } from '../middleware/auth';

const router = Router();

// Webhook endpoint (called directly by Paystack)
router.post('/webhook/paystack', paystackWebhookHandler);

// Verification endpoint (can be public or authenticated)
router.get('/verify/:reference', verifyOrderPayment);

// Initialization endpoint (requires customer auth)
router.post('/initialize', authenticateCustomer, initializeOrderPayment);

export default router;
