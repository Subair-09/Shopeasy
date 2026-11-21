import { Request, Response } from 'express';
import { StoreSettings } from '../models/StoreSettings';
import { Promotion } from '../models/Promotion';
import { Review } from '../models/Review';
import { Notification } from '../models/Notification';
import { SupportTicket } from '../models/SupportTicket';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

// 1. Get Public Store Settings (for delivery fee, free shipping, currency)
export const customerGetSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({
        storeName: 'ShopEasy',
        tagline: 'Shop Smart. Live Better.',
        contactEmail: 'support@shopeasy.com',
        contactPhone: '+234 812 345 6789',
        currency: 'NGN',
        currencySymbol: '₦',
        deliveryFeeKobo: 200000,
        freeDeliveryThresholdKobo: 5000000,
      });
    }

    res.json({
      success: true,
      data: {
        storeName: settings.storeName,
        tagline: settings.tagline,
        supportEmail: settings.contactEmail,
        supportPhone: settings.contactPhone,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        currency: settings.currency,
        currencySymbol: settings.currencySymbol,
        deliveryFeeKobo: settings.deliveryFeeKobo,
        standardShippingFeeKobo: settings.deliveryFeeKobo,
        freeDeliveryThresholdKobo: settings.freeDeliveryThresholdKobo,
        freeShippingThresholdKobo: settings.freeDeliveryThresholdKobo,
        taxPercentage: 7.5,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Active Promotions / Campaigns
export const customerGetPromotions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const promotions = await Promotion.find({
      isActive: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { promotions },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Validate Promo Code at Checkout
export const customerValidatePromoCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, cartTotalKobo = 0 } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Promo code is required' });
      return;
    }

    const promo = await Promotion.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      res.status(404).json({ success: false, message: 'Invalid or expired promotional code' });
      return;
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      res.status(400).json({ success: false, message: 'This promo code has expired' });
      return;
    }

    if (promo.minOrderValueKobo && cartTotalKobo < promo.minOrderValueKobo) {
      const minNaira = Math.round(promo.minOrderValueKobo / 100).toLocaleString();
      res.status(400).json({
        success: false,
        message: `Minimum order amount of ₦${minNaira} required to apply this code`,
      });
      return;
    }

    let discountKobo = 0;
    if (promo.discountPercentage) {
      discountKobo = Math.round((cartTotalKobo * promo.discountPercentage) / 100);
      if (promo.maxDiscountKobo && discountKobo > promo.maxDiscountKobo) {
        discountKobo = promo.maxDiscountKobo;
      }
    } else if (promo.fixedDiscountKobo) {
      discountKobo = promo.fixedDiscountKobo;
    }

    res.json({
      success: true,
      message: 'Promotional code applied successfully',
      data: {
        code: promo.code,
        discountKobo,
        discountNaira: Math.round(discountKobo / 100),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Product Reviews
export const customerGetProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({
      productId: req.params.id,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerCreateProductReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = (req as any).user?.id;
    const customerName = (req as any).user?.name || 'Valued Customer';
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars' });
      return;
    }

    if (!comment || !comment.trim()) {
      res.status(400).json({ success: false, message: 'Review comment cannot be empty' });
      return;
    }

    const review = await Review.create({
      productId,
      customerId,
      customerName,
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: true,
    });

    // Update Product average rating
    const allReviews = await Review.find({ productId, isApproved: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Number(avgRating.toFixed(1)),
      reviewCount: allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Notifications
export const customerGetNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = (req as any).user?.id;
    const notifications = await Notification.find({
      $or: [
        { recipientType: 'customer', recipientId: customerId },
        { recipientType: 'customer', recipientId: { $exists: false } },
      ],
    }).sort({ createdAt: -1 }).limit(30);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerMarkNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Support Tickets
export const customerCreateSupportTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = (req as any).user?.id;
    const customerName = (req as any).user?.name || req.body.name || 'Customer';
    const customerEmail = (req as any).user?.email || req.body.email || '';
    const { subject, message, priority = 'Medium' } = req.body;

    if (!subject || !message) {
      res.status(400).json({ success: false, message: 'Subject and message are required' });
      return;
    }

    const ticketNumber = `TCK-${Date.now().toString().slice(-6)}`;
    const ticket = await SupportTicket.create({
      ticketNumber,
      customerId,
      customerName,
      customerEmail,
      subject,
      message,
      priority,
      status: 'Open',
      responses: [
        {
          sender: 'customer',
          senderName: customerName,
          message,
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully',
      data: { ticket },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerGetSupportTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = (req as any).user?.id;
    const tickets = await SupportTicket.find({ customerId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { tickets },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
