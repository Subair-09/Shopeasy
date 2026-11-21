import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token';
import { Admin, AdminRole } from '../models/Admin';
import { Customer } from '../models/Customer';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
  admin?: any;
  customer?: any;
}

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.adminAccessToken;

    if (!token) {
      res.status(401).json({ success: false, message: 'Admin authentication required' });
      return;
    }

    const payload = verifyAccessToken(token);

    if (payload.type !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied: admin credentials required' });
      return;
    }

    const admin = await Admin.findById(payload.id).select('-password');
    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, message: 'Account disabled or not found' });
      return;
    }

    req.user = payload;
    req.admin = admin;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};

export const requireRoles = (allowedRoles: AdminRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Admin not authenticated' });
      return;
    }

    if (req.admin.role === 'Super Admin' || allowedRoles.includes(req.admin.role)) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: `Permission denied: action restricted to ${allowedRoles.join(', ')}`,
    });
  };
};

export const authenticateCustomer = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      res.status(401).json({ success: false, message: 'Customer authentication required' });
      return;
    }

    const payload = verifyAccessToken(token);
    if (payload.type !== 'customer') {
      res.status(403).json({ success: false, message: 'Invalid customer token' });
      return;
    }

    const customer = await Customer.findById(payload.id).select('-password');
    if (!customer || !customer.isActive) {
      res.status(401).json({ success: false, message: 'Customer account not found or disabled' });
      return;
    }

    req.user = payload;
    req.customer = customer;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired customer session' });
  }
};
