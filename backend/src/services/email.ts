import axios from 'axios';
import { ENV } from '../config/env';

export class EmailService {
  static async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!ENV.RESEND_API_KEY || ENV.RESEND_API_KEY.includes('dummy')) {
      console.log(`[Email Mock Service] To: ${to} | Subject: "${subject}"`);
      return true;
    }

    try {
      await axios.post(
        'https://api.resend.com/emails',
        {
          from: 'ShopEasy <notifications@shopeasy.com>',
          to: [to],
          subject,
          html,
        },
        {
          headers: {
            Authorization: `Bearer ${ENV.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return true;
    } catch (error: any) {
      console.error('[Resend Email Error]', error.response?.data || error.message);
      return false;
    }
  }

  static async sendOrderConfirmation(email: string, orderId: string, amount: string) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #15152D;">
        <h2 style="color: #5135ED;">Order Confirmed!</h2>
        <p>Thank you for shopping with ShopEasy.</p>
        <p>Your Order <strong>#${orderId}</strong> for <strong>${amount}</strong> has been received and is being prepared.</p>
        <p>Best regards,<br/>The ShopEasy Team</p>
      </div>
    `;
    return this.sendEmail(email, `Order Confirmation #${orderId} - ShopEasy`, html);
  }

  static async sendStatusUpdate(email: string, orderId: string, status: string) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #15152D;">
        <h2 style="color: #5135ED;">Order Status Update</h2>
        <p>Your Order <strong>#${orderId}</strong> status is now: <strong style="color: #5135ED;">${status}</strong>.</p>
        <p>Track your shipment directly in the ShopEasy mobile app.</p>
      </div>
    `;
    return this.sendEmail(email, `Update on Order #${orderId}: ${status}`, html);
  }
}
