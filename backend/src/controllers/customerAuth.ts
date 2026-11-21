import { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { generateAccessToken, generateRefreshToken } from '../utils/token';

export const customerRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email address is already in use' });
      return;
    }

    const customer = await Customer.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      isActive: true,
      totalOrders: 0,
      totalSpentKobo: 0,
      addressList: [],
    });

    const tokenPayload = {
      id: customer._id.toString(),
      email: customer.email,
      role: 'customer',
      type: 'customer' as const,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          avatar: customer.avatar,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (!customer.isActive) {
      res.status(403).json({ success: false, message: 'Account is deactivated. Contact customer support.' });
      return;
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    customer.lastLogin = new Date();
    await customer.save();

    const tokenPayload = {
      id: customer._id.toString(),
      email: customer.email,
      role: 'customer',
      type: 'customer' as const,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          avatar: customer.avatar,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerGetProfile = async (req: any, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: {
        customer: req.customer,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerUpdateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, phone, avatar } = req.body;
    const customer = req.customer;

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (avatar) customer.avatar = avatar;

    await customer.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { customer },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerAddAddress = async (req: any, res: Response): Promise<void> => {
  try {
    const customer = req.customer;
    const { fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;

    if (isDefault) {
      customer.addressList.forEach((a: any) => (a.isDefault = false));
    }

    customer.addressList.push({
      fullName: fullName || customer.name,
      phone: phone || customer.phone,
      street,
      city,
      state,
      postalCode,
      country: country || 'Nigeria',
      isDefault: isDefault || customer.addressList.length === 0,
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: { addresses: customer.addressList },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
