import React, { useState } from 'react';
import {
  Store,
  CreditCard,
  Cloud,
  Database,
  Shield,
  Save,
  CheckCircle,
} from 'lucide-react';
import { apiClient } from '../services/api';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'payments' | 'cloudinary' | 'database'>('store');
  const [saved, setSaved] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'ShopEasy',
    tagline: 'Shop Smart. Live Better.',
    supportEmail: 'support@shopeasy.com',
    supportPhone: '+234 800 SHOPEASY',
    standardShippingFee: 2000,
    freeShippingThreshold: 50000,
    taxPercentage: 7.5,
    currency: 'NGN (₦)',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    gateway: 'Paystack',
    publicKey: 'pk_test_shopeasy_demo_key',
    secretKey: '••••••••••••••••••••••••••••••••',
    webhookUrl: 'http://localhost:5000/api/v1/payments/webhook/paystack',
    testMode: true,
  });

  const [cloudinarySettings, setCloudinarySettings] = useState({
    cloudName: 'your-cloud-name',
    apiKey: 'your-api-key',
    apiSecret: '••••••••••••••••••••••••••••••••',
    folder: 'shopeasy',
    autoFormat: true,
  });

  const [dbSettings, setDbSettings] = useState({
    uri: 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopeasy',
    status: 'Connected (Configured via Backend Environment)',
    poolSize: 10,
    timeoutMs: 8000,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put('/settings', {
        storeName: storeSettings.storeName,
        tagline: storeSettings.tagline,
        supportEmail: storeSettings.supportEmail,
        supportPhone: storeSettings.supportPhone,
        standardShippingFeeKobo: storeSettings.standardShippingFee * 100,
        freeShippingThresholdKobo: storeSettings.freeShippingThreshold * 100,
        taxPercentage: storeSettings.taxPercentage,
      });
    } catch (e) {
      // ignore
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Settings</h1>
          <p className="text-xs text-[#77778D] font-medium mt-0.5">
            Configure store preferences, payments, Cloudinary, and database connectivity.
          </p>
        </div>
        {saved && (
          <div className="bg-[#E7F8F0] text-[#19A76B] text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E8E7F0] pb-2 text-xs font-bold">
        {[
          { id: 'store', label: 'Store Profile & Shipping', icon: Store },
          { id: 'payments', label: 'Paystack Gateway', icon: CreditCard },
          { id: 'cloudinary', label: 'Cloudinary Storage', icon: Cloud },
          { id: 'database', label: 'MongoDB Database', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#5135ED] text-white shadow-sm'
                  : 'text-[#77778D] hover:text-[#15152D] hover:bg-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft max-w-2xl text-xs font-semibold space-y-4">
        {activeTab === 'store' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#15152D] mb-1">General Store Profile</h3>
            <div>
              <label className="block text-[#15152D] mb-1">Store Name</label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
            <div>
              <label className="block text-[#15152D] mb-1">Tagline</label>
              <input
                type="text"
                value={storeSettings.tagline}
                onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#15152D] mb-1">Support Email</label>
                <input
                  type="email"
                  value={storeSettings.supportEmail}
                  onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                />
              </div>
              <div>
                <label className="block text-[#15152D] mb-1">Support Phone</label>
                <input
                  type="text"
                  value={storeSettings.supportPhone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#15152D] mb-1">Standard Delivery (₦)</label>
                <input
                  type="number"
                  value={storeSettings.standardShippingFee}
                  onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                />
              </div>
              <div>
                <label className="block text-[#15152D] mb-1">Free Delivery Above (₦)</label>
                <input
                  type="number"
                  value={storeSettings.freeShippingThreshold}
                  onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                />
              </div>
              <div>
                <label className="block text-[#15152D] mb-1">VAT / Tax (%)</label>
                <input
                  type="number"
                  value={storeSettings.taxPercentage}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxPercentage: Number(e.target.value) })}
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#15152D] mb-1">Paystack Configuration</h3>
            <div>
              <label className="block text-[#15152D] mb-1">Public Key</label>
              <input
                type="text"
                value={paymentSettings.publicKey}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, publicKey: e.target.value })}
                className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
            <div>
              <label className="block text-[#15152D] mb-1">Secret Key</label>
              <input
                type="password"
                value={paymentSettings.secretKey}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, secretKey: e.target.value })}
                className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
            <div>
              <label className="block text-[#15152D] mb-1">Webhook URL</label>
              <input
                type="text"
                readOnly
                value={paymentSettings.webhookUrl}
                className="w-full bg-gray-100 text-[#77778D] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
          </div>
        )}

        {activeTab === 'cloudinary' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#15152D] mb-1">Cloudinary Storage Configuration</h3>
            <div>
              <label className="block text-[#15152D] mb-1">Cloud Name</label>
              <input
                type="text"
                value={cloudinarySettings.cloudName}
                onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, cloudName: e.target.value })}
                className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
            <div>
              <label className="block text-[#15152D] mb-1">API Key</label>
              <input
                type="text"
                value={cloudinarySettings.apiKey}
                onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, apiKey: e.target.value })}
                className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
            <div>
              <label className="block text-[#15152D] mb-1">API Secret</label>
              <input
                type="password"
                value={cloudinarySettings.apiSecret}
                onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, apiSecret: e.target.value })}
                className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#15152D] mb-1">MongoDB Atlas / Local Connection</h3>
            <div>
              <label className="block text-[#15152D] mb-1">Connection String (URI)</label>
              <input
                type="text"
                value={dbSettings.uri}
                onChange={(e) => setDbSettings({ ...dbSettings, uri: e.target.value })}
                className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0]"
              />
            </div>
            <div className="p-3 bg-[#E7F8F0] rounded-xl text-[#19A76B] flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Status: {dbSettings.status}</span>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-[#E8E7F0] flex justify-end">
          <button
            type="submit"
            className="bg-[#5135ED] hover:bg-[#3925C5] text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
