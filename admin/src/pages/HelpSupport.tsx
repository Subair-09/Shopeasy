import React from 'react';
import { Headphones, Mail, Phone, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

export const HelpSupport: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Help & Support</h1>
        <p className="text-xs text-[#77778D] font-medium mt-0.5">
          Get assistance, access developer guides, or contact technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5135ED] flex items-center justify-center mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-sm text-[#15152D]">Email Support</h3>
          <p className="text-xs text-[#77778D] mt-1 mb-4">Dedicated support for store operations</p>
          <a href="mailto:support@shopeasy.com" className="text-xs font-bold text-[#5135ED] hover:underline">
            support@shopeasy.com
          </a>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E7F8F0] text-[#10B981] flex items-center justify-center mb-3">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-sm text-[#15152D]">Phone Support</h3>
          <p className="text-xs text-[#77778D] mt-1 mb-4">Available Mon-Fri 8:00 AM - 6:00 PM</p>
          <span className="text-xs font-bold text-[#10B981]">+234 800 SHOPEASY</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#3B82F6] flex items-center justify-center mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-sm text-[#15152D]">Live Chat</h3>
          <p className="text-xs text-[#77778D] mt-1 mb-4">Instant support with our specialists</p>
          <button className="text-xs font-bold text-[#3B82F6] hover:underline">
            Start Chat Session →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft">
        <h3 className="font-extrabold text-base text-[#15152D] mb-4">Documentation & Resources</h3>
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#F7F7FC] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#15152D]">ShopEasy API Documentation</p>
              <p className="text-[#77778D]">REST API endpoints, JWT token authentication & webhooks</p>
            </div>
            <a href="http://localhost:5000/api/v1/health" target="_blank" rel="noreferrer" className="text-[#5135ED] font-bold flex items-center space-x-1">
              <span>View API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-3 bg-[#F7F7FC] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#15152D]">Cloudinary Image Management Guide</p>
              <p className="text-[#77778D]">Automatic WEBP transformations and high-speed CDN delivery</p>
            </div>
            <span className="text-xs font-bold text-[#19A76B] flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Active</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
