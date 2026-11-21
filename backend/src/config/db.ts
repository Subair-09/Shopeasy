import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('🍃 [MongoDB] Connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB] Connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB] Disconnected from database.');
    });

    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    console.log(`[MongoDB] Database Host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.warn(`[MongoDB Warning] Could not establish connection to ${ENV.MONGODB_URI}`);
    console.warn(`[MongoDB Reason] ${error.message}`);
    console.warn(`[MongoDB Notice] For local/Atlas connection, update MONGODB_URI in backend/.env`);
    return null;
  }
};

export const checkDBHealth = async (): Promise<{ isConnected: boolean; state: string; host?: string; dbName?: string }> => {
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const stateCode = mongoose.connection.readyState;
  const isConnected = stateCode === 1;

  return {
    isConnected,
    state: stateMap[stateCode] || 'unknown',
    host: mongoose.connection.host,
    dbName: mongoose.connection.name,
  };
};
