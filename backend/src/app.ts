import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { checkDBHealth } from './config/db';
import adminRoutes from './routes/adminRoutes';
import customerRoutes from './routes/customerRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app: Application = express();

// Security and middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: true, // Allow all origins for dev / mobile / admin panel
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root & Health check
app.get('/', async (_req: Request, res: Response) => {
  const dbHealth = await checkDBHealth();
  res.json({
    success: true,
    message: 'Welcome to ShopEasy API Service 🚀',
    version: '1.0.0',
    status: 'online',
    database: {
      connected: dbHealth.isConnected,
      state: dbHealth.state,
    },
    endpoints: {
      health: '/health',
      apiHealth: '/api/v1/health',
      dbHealth: '/api/v1/health/db',
      customerProducts: '/api/v1/customer/products',
      customerCategories: '/api/v1/customer/categories',
      adminAuth: '/api/v1/admin/auth/login',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (_req: Request, res: Response) => {
  res.redirect('/');
});

app.get('/api/v1', (_req: Request, res: Response) => {
  res.redirect('/');
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ShopEasy API Service',
  });
});

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ShopEasy API Service v1',
  });
});

app.get('/api/v1/health/db', async (_req: Request, res: Response) => {
  const dbHealth = await checkDBHealth();
  res.status(dbHealth.isConnected ? 200 : 503).json({
    status: dbHealth.isConnected ? 'ok' : 'degraded',
    database: dbHealth,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/customer', customerRoutes);
app.use('/api/v1/payments', paymentRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ShopEasy API Error]:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

export default app;
