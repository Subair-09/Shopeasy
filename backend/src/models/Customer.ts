import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICustomerAddress {
  title: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface ICustomer extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  avatar?: string;
  isActive: boolean;
  addresses: ICustomerAddress[];
  totalOrders: number;
  totalSpentKobo: number;
  lastLogin?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    phone: { type: String, default: '' },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    isActive: { type: Boolean, default: true },
    addresses: [
      {
        title: { type: String, default: 'Home' },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    totalOrders: { type: Number, default: 0 },
    totalSpentKobo: { type: Number, default: 0 },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

CustomerSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const Customer = model<ICustomer>('Customer', CustomerSchema);
