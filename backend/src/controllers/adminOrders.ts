import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Customer } from '../models/Customer';
import { Notification } from '../models/Notification';
import { recordAuditLog } from '../utils/audit';

export const adminGetOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status = 'All',
      search = '',
      sortBy = 'Latest',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const query: any = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    let sort: any = { createdAt: -1 };
    if (sortBy === 'Oldest') sort = { createdAt: 1 };
    if (sortBy === 'Amount: High to Low') sort = { totalKobo: -1 };
    if (sortBy === 'Amount: Low to High') sort = { totalKobo: 1 };

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email avatar phone')
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Compute status counts for tabs and top stat cards
    const [
      totalCount,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Processing' }),
      Order.countDocuments({ orderStatus: 'Shipped' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.countDocuments({ orderStatus: 'Cancelled' }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
        counts: {
          all: totalCount,
          pending: pendingCount,
          processing: processingCount,
          shipped: shippedCount,
          delivered: deliveredCount,
          cancelled: cancelledCount,
        },
        metrics: {
          totalOrders: totalCount,
          deliveredOrders: deliveredCount,
          processingOrders: processingCount,
          pendingOrders: pendingCount,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email avatar phone addressList')
      .populate('items.product', 'name sku images priceKobo discountedPriceKobo');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateOrderStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note, trackingNumber } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'Paid';
    } else if (status === 'Cancelled') {
      order.cancelledAt = new Date();
      order.cancelReason = note || 'Cancelled by store administrator';
    }

    // Add status history entry
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Order updated to ${status} by admin`,
      updatedBy: req.admin?.name || 'Administrator',
    });

    await order.save();

    // Send in-app notification to customer
    if (order.customer) {
      await Notification.create({
        recipientType: 'customer',
        customer: order.customer,
        title: `Order #${order.orderNumber} ${status}`,
        message: `Your order #${order.orderNumber} is now ${status.toLowerCase()}.${
          trackingNumber ? ` Tracking number: ${trackingNumber}` : ''
        }`,
        type: 'order_status',
        data: { orderId: order._id.toString(), status },
      });
    }

    // Record audit log
    await recordAuditLog({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action: 'Update Order Status',
      targetResource: 'Order',
      targetId: order._id.toString(),
      description: `Updated order #${order.orderNumber} status from ${previousStatus} to ${status}`,
    });

    res.json({
      success: true,
      message: `Order status successfully changed to ${status}`,
      data: { order },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
