import app from './app';
import { ENV } from './config/env';
import { connectDB } from './config/db';

const PORT = parseInt(ENV.PORT, 10) || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`===============================================`);
      console.log(`🚀 ShopEasy Backend API Server Running!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🔐 Admin API: http://localhost:${PORT}/api/v1/admin`);
      console.log(`📱 Customer API: http://localhost:${PORT}/api/v1/customer`);
      console.log(`💳 Payments API: http://localhost:${PORT}/api/v1/payments`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
