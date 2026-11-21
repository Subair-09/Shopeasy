import { Request, Response } from 'express';
import { StoreSettings } from '../models/StoreSettings';
import { Promotion } from '../models/Promotion';
import { AuditLog } from '../models/AuditLog';
import { recordAuditLog } from '../utils/audit';

export const adminGetSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({
        storeName: 'ShopEasy',
        tagline: 'Shop Smart. Live Better.',
        supportEmail: 'support@shopeasy.com',
        supportPhone: '+234 800 SHOPEASY',
        currency: 'NGN',
        currencySymbol: '₦',
        standardShippingFeeKobo: 200000, // ₦2,000
        freeShippingThresholdKobo: 5000000, // ₦50,000
        taxPercentage: 7.5,
      });
    }

    res.json({ success: true, data: { settings } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateSettings = async (req: any, res: Response): Promise<void> => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action: 'Update Store Settings',
      targetResource: 'StoreSettings',
      description: 'Updated store configuration and settings',
    });

    res.json({
      success: true,
      message: 'Store settings updated successfully',
      data: { settings },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetPromotions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { promotions } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminCreatePromotion = async (req: any, res: Response): Promise<void> => {
  try {
    const { code, discountType, discountValue, minimumSpendKobo, expiresAt, maxUses } = req.body;

    const existing = await Promotion.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Promotion code already exists' });
      return;
    }

    const promo = await Promotion.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minimumSpendKobo: minimumSpendKobo || 0,
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxUses: maxUses || 100,
      usedCount: 0,
      isActive: true,
    });

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action: 'Create Promotion',
      targetResource: 'Promotion',
      targetId: promo._id.toString(),
      description: `Created promotion code ${promo.code}`,
    });

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: { promotion: promo },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        logs,
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
