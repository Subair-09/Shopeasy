import app from '../src/app';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db';

export default async function handler(req: any, res: any) {
  // If MongoDB is not connected (readyState 1 = connected), attempt connection
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[Vercel Serverless DB Connection Error]:', err);
    }
  }
  return app(req, res);
}
