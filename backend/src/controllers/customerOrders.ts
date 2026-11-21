import { Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Cart } from '../models/Cart';
import { Customer } from '../models/Customer';
import { Notification } from '../models/Notification';

export const customerCreateOrder = async (req: any, res: Response): Promise<void> => {
  try {
    const customer = req.customer;
    const {
      items,
      shippingAddress,
      paymentMethod = 'Paystack',
      promoCode,
    } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cannot create order with an empty item list' });
      return;
    }

    const street = shippingAddress?.street || shippingAddress?.addressLine1;
    if (!shippingAddress || !street || !shippingAddress.city) {
      res.status(400).json({ success: false, message: 'Valid delivery address is required' });
      return;
    }

    let subtotalKobo = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product || !product.isActive) {
        res.status(400).json({ success: false, message: `Product ${item.name || ''} is no longer available` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({ success: false, message: `Only ${product.stock} items of ${product.name} left in stock` });
        return;
      }

      const unitPriceKobo = product.discountedPriceKobo || product.regularPriceKobo;
      const itemSubtotal = unitPriceKobo * item.quantity;
      subtotalKobo += itemSubtotal;

      orderItems.push({
        productId: product._id,
        product: product._id,
        name: product.name,
        sku: product.sku,
        image: product.images[0] || '',
        unitPriceKobo,
        priceKobo: unitPriceKobo,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        subtotalKobo: itemSubtotal,
      });

      // Decrement stock
      product.stock -= item.quantity;
      product.salesCount += item.quantity;
      await product.save();
    }

    const shippingFeeKobo = subtotalKobo > 5000000 ? 0 : 200000;
    const taxKobo = Math.round(subtotalKobo * 0.075);
    const discountKobo = 0;
    const totalKobo = subtotalKobo + shippingFeeKobo + taxKobo - discountKobo;

    // Generate unique order number (format e.g. SE250726001)
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SE${dateStr}${randomSuffix}`;
    const addressStr = typeof shippingAddress === 'string'
      ? shippingAddress
      : `${shippingAddress.street || shippingAddress.addressLine1 || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''}`;

    const order = await Order.create({
      orderId: orderNumber,
      orderNumber,
      customer: customer._id,
      customerId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || '',
      items: orderItems,
      subtotalKobo,
      deliveryFeeKobo: shippingFeeKobo,
      shippingFeeKobo,
      taxKobo,
      discountKobo,
      totalKobo,
      deliveryAddress: addressStr,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending',
      orderStatus: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order placed by customer',
          changedBy: 'Customer',
        },
      ],
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order placed by customer',
          updatedBy: 'Customer',
        },
      ],
    });

    // Update customer stats
    customer.totalOrders += 1;
    customer.totalSpentKobo += totalKobo;
    await customer.save();

    // Clear cart if ordered from cart
    await Cart.findOneAndUpdate({ customer: customer._id }, { items: [], subtotalKobo: 0, totalKobo: 0 });

    // Send customer notification
    await Notification.create({
      recipientType: 'customer',
      recipientId: customer._id,
      title: 'Order Placed Successfully!',
      message: `Your order #${order.orderNumber} for ₦${(totalKobo / 100).toLocaleString()} has been placed.`,
      type: 'order',
      metadata: { orderId: order._id.toString() },
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerGetOrders = async (req: any, res: Response): Promise<void> => {
  try {
    const customerId = req.customer?._id;
    const { status } = req.query;

    const query: any = {
      $or: [{ customer: customerId }, { customerId: customerId }],
    };
    if (status && status !== 'All' && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { orders },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerGetOrderById = async (req: any, res: Response): Promise<void> => {
  try {
    const customerId = req.customer?._id;
    const order = await Order.findOne({
      _id: req.params.id,
      $or: [{ customer: customerId }, { customerId: customerId }],
    });

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

export const customerCancelOrder = async (req: any, res: Response): Promise<void> => {
  try {
    const customerId = req.customer?._id;
    const { reason = 'Cancelled by customer' } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      $or: [{ customer: customerId }, { customerId: customerId }],
    });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (order.orderStatus !== 'Pending') {
      res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus.toLowerCase()}`,
      });
      return;
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason;
    order.timeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: reason,
      updatedBy: 'Customer',
    });

    await order.save();

    // Restock items
    for (const item of order.items) {
      const pId = item.productId || item.product;
      if (pId) {
        await Product.findByIdAndUpdate(pId, {
          $inc: { stock: item.quantity, salesCount: -item.quantity },
        });
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
