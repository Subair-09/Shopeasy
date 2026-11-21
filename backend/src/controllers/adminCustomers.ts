import { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { Order } from '../models/Order';
import { recordAuditLog } from '../utils/audit';
import bcrypt from 'bcryptjs';

export const adminGetCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      search = '',
      status = 'All Customers',
      sortBy = 'Latest',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (status === 'Active') query.isActive = true;
    if (status === 'Inactive') query.isActive = false;

    let sort: any = { createdAt: -1 };
    if (sortBy === 'Oldest') sort = { createdAt: 1 };
    if (sortBy === 'Orders: High to Low') sort = { totalOrders: -1 };
    if (sortBy === 'Spent: High to Low') sort = { totalSpentKobo: -1 };

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .select('-password')
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Compute metrics matching the reference design
    const totalCount = await Customer.countDocuments();
    const activeCount = await Customer.countDocuments({ isActive: true });
    // New customers in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCount = await Customer.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    // VIP customers: spent > 100,000 Naira (10,000,000 kobo) or > 5 orders
    const vipCount = await Customer.countDocuments({
      $or: [{ totalSpentKobo: { $gte: 10000000 } }, { totalOrders: { $gte: 5 } }],
    });

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
        metrics: {
          totalCustomers: totalCount,
          activeCustomers: activeCount,
          newCustomers: newCount,
          vipCustomers: vipCount,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password');
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const orders = await Order.find({ customer: customer._id }).sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      data: {
        customer,
        orders,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminCreateCustomer = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password = 'Password@123' } = req.body;

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'A customer with this email already exists' });
      return;
    }

    const customer = await Customer.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      isActive: true,
      totalOrders: 0,
      totalSpentKobo: 0,
    });

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action: 'Create Customer',
      targetResource: 'Customer',
      targetId: customer._id.toString(),
      description: `Manually registered customer ${customer.email}`,
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          isActive: customer.isActive,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminToggleCustomerStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action: customer.isActive ? 'Activate Customer' : 'Deactivate Customer',
      targetResource: 'Customer',
      targetId: customer._id.toString(),
      description: `Customer ${customer.email} marked as ${customer.isActive ? 'Active' : 'Inactive'}`,
    });

    res.json({
      success: true,
      message: `Customer status updated to ${customer.isActive ? 'Active' : 'Inactive'}`,
      data: { customer },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
