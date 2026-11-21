import { Schema, model, Document } from 'mongoose';

export interface IStoreSettings extends Document {
  storeName: string;
  tagline: string;
  storeLogo: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  currency: string;
  currencySymbol: string;
  deliveryFeeKobo: number;
  freeDeliveryThresholdKobo: number;
  codEnabled: boolean;
  isOpen: boolean;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: 'ShopEasy' },
    tagline: { type: String, default: 'Shop Smart. Live Better.' },
    storeLogo: { type: String, default: '' },
    description: { type: String, default: 'Nigeria’s premium e-commerce shopping experience.' },
    contactEmail: { type: String, default: 'support@shopeasy.com' },
    contactPhone: { type: String, default: '+234 812 345 6789' },
    storeAddress: { type: String, default: '14 Admiralty Way, Lekki Phase 1, Lagos' },
    currency: { type: String, default: 'NGN' },
    currencySymbol: { type: String, default: '₦' },
    deliveryFeeKobo: { type: Number, default: 200000 }, // ₦2,000
    freeDeliveryThresholdKobo: { type: Number, default: 8000000 }, // ₦80,000
    codEnabled: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const StoreSettings = model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
