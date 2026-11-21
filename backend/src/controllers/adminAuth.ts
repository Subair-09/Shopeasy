import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { recordAuditLog } from '../utils/audit';

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (!admin.isActive) {
      res.status(403).json({ success: false, message: 'Account has been deactivated. Contact super administrator.' });
      return;
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await recordAuditLog({
        adminEmail: email,
        action: 'Failed Login',
        description: 'Failed login attempt with incorrect password',
      });
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    admin.lastLogin = new Date();
    await admin.save();

    const tokenPayload = {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      type: 'admin' as const,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await recordAuditLog({
      adminId: admin._id.toString(),
      adminEmail: admin.email,
      action: 'Admin Login',
      description: `Successful login to ShopEasy Admin Panel as ${admin.role}`,
    });

    res.cookie('adminRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatar: admin.avatar,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const adminGetMe = async (req: any, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: {
        admin: req.admin,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminRefreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.adminRefreshToken;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'Refresh token required' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    const admin = await Admin.findById(payload.id);

    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, message: 'Account invalid or inactive' });
      return;
    }

    const newAccessToken = generateAccessToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      type: 'admin',
    });

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const adminLogout = async (req: any, res: Response): Promise<void> => {
  try {
    res.clearCookie('adminRefreshToken');
    if (req.admin) {
      await recordAuditLog({
        adminId: req.admin._id,
        adminEmail: req.admin.email,
        action: 'Admin Logout',
        description: 'Admin logged out of session',
      });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminForgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase() });
    if (!admin) {
      // Do not disclose whether admin exists
      res.json({ success: true, message: 'If this email belongs to an administrator, a reset link has been dispatched.' });
      return;
    }

    const resetToken = Math.random().toString(36).substring(2, 10);
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await admin.save();

    await recordAuditLog({
      adminId: admin._id.toString(),
      adminEmail: admin.email,
      action: 'Password Reset Request',
      description: 'Admin requested a password reset link',
    });

    res.json({
      success: true,
      message: 'If this email belongs to an administrator, a reset link has been dispatched.',
      // In dev mode provide the token for instant testing
      devResetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminResetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!admin) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
      return;
    }

    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    await recordAuditLog({
      adminId: admin._id.toString(),
      adminEmail: admin.email,
      action: 'Password Reset Completed',
      description: 'Admin password reset was successfully completed',
    });

    res.json({ success: true, message: 'Password has been reset successfully. You can now login.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
