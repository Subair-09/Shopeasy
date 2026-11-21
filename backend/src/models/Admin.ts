import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type AdminRole =
  | 'Super Admin'
  | 'Store Admin'
  | 'Order Manager'
  | 'Product Manager'
  | 'Customer Support';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Super Admin', 'Store Admin', 'Order Manager', 'Product Manager', 'Customer Support'],
      default: 'Store Admin',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const Admin = model<IAdmin>('Admin', AdminSchema);
