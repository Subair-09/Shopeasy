import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import { PaystackService } from '../services/paystack';

export const initializeOrderPayment = async (req: any, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    const customer = req.customer;

    const order = await Order.findOne({
      _id: orderId,
      $or: [{ customer: customer._id }, { customerId: customer._id }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (order.paymentStatus === 'Paid') {
      res.status(400).json({ success: false, message: 'Order has already been paid for' });
      return;
    }

    const orderRef = order.orderNumber || order.orderId;
    const paystackResponse = await PaystackService.initializePayment({
      email: customer.email,
      amountKobo: order.totalKobo,
      reference: `${orderRef}_${Date.now()}`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: orderRef,
        customerId: customer._id.toString(),
      },
    });

    // Save pending payment record
    await Payment.create({
      order: order._id,
      customer: customer._id,
      amountKobo: order.totalKobo,
      currency: 'NGN',
      paymentMethod: 'Paystack',
      paystackReference: paystackResponse.reference,
      status: 'pending',
    });

    res.json({
      success: true,
      data: {
        authorizationUrl: paystackResponse.authorization_url,
        accessCode: paystackResponse.access_code,
        reference: paystackResponse.reference,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOrderPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const reference = String(req.params.reference);

    const verification: any = await PaystackService.verifyPayment(reference);

    if (!verification || (verification.status !== 'success' && verification.data?.status !== 'success')) {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed or was not completed',
        data: verification,
      });
      return;
    }

    const orderId = verification.data?.metadata?.orderId || verification.metadata?.orderId;
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'Paid';
        if (order.orderStatus === 'Pending') {
          order.orderStatus = 'Processing';
        }
        order.timeline.push({
          status: 'Processing',
          timestamp: new Date(),
          note: `Payment verified via Paystack. Ref: ${reference}`,
          updatedBy: 'System',
        });
        await order.save();

        await Payment.findOneAndUpdate(
          { paystackReference: reference },
          {
            status: 'success',
            paidAt: new Date(),
            rawResponse: verification,
          }
        );
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: verification,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const paystackWebhookHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const orderId = metadata?.orderId;

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.paymentStatus !== 'Paid') {
          order.paymentStatus = 'Paid';
          order.orderStatus = 'Processing';
          order.timeline.push({
            status: 'Processing',
            timestamp: new Date(),
            note: 'Paystack webhook confirmed successful payment',
            updatedBy: 'Paystack Webhook',
          });
          await order.save();

          await Payment.findOneAndUpdate(
            { paystackReference: reference },
            {
              status: 'success',
              paidAt: new Date(event.data.paid_at || Date.now()),
              rawResponse: event.data,
            }
          );
        }
      }
    }

    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
