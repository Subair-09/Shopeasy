import React, { useState } from 'react';
import {
  Megaphone,
  Percent,
  Users,
  ShoppingCart,
  Plus,
  Calendar,
  Eye,
  MoreHorizontal,
  Edit2,
  Trash2,
  Tag,
  Gift,
  Mail,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Sparkline } from '../components/Sparkline';

export const Marketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Campaigns');

  const performanceData = [
    { date: 'Oct 1', reach: 6000, sales: 4200 },
    { date: 'Oct 8', reach: 9500, sales: 6800 },
    { date: 'Oct 15', reach: 8000, sales: 5900 },
    { date: 'Oct 22', reach: 13800, sales: 9400 },
    { date: 'Oct 30', reach: 12500, sales: 8800 },
  ];

  const promotions = [
    {
      code: 'SHOP10',
      discount: '10% Off',
      minOrder: '₦10,000',
      validUntil: 'Nov 30, 2026',
      status: 'Active',
    },
    {
      code: 'FREESHIP',
      discount: 'Free Shipping',
      minOrder: '₦0',
      validUntil: 'Nov 30, 2026',
      status: 'Active',
    },
    {
      code: 'WELCOME5',
      discount: '5% Off',
      minOrder: '₦5,000',
      validUntil: 'Dec 31, 2026',
      status: 'Inactive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Marketing</h1>
          <p className="text-xs text-[#77778D] font-medium mt-0.5">
            Create campaigns, manage promotions and grow your business.
          </p>
        </div>
        <button
          onClick={() => alert('New Campaign modal opening...')}
          className="bg-[#5135ED] hover:bg-[#3925C5] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#5135ED]/20 flex items-center space-x-1.5 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* ===================== TABS BAR ===================== */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'Campaigns', label: 'Campaigns', icon: Megaphone },
          { id: 'Discount Codes', label: 'Discount Codes', icon: Tag },
          { id: 'Promotions', label: 'Promotions', icon: Gift },
          { id: 'Email Marketing', label: 'Email Marketing', icon: Mail },
          { id: 'Notifications', label: 'Notifications', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#5135ED] text-white shadow-sm'
                  : 'bg-white text-[#77778D] hover:text-[#15152D] border border-[#E8E7F0]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================== 4 METRICS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5135ED] flex items-center justify-center shrink-0">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Campaigns</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">6</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>20%</span>
              </p>
            </div>
          </div>
          <Sparkline color="purple" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F8F0] text-[#10B981] flex items-center justify-center shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Active Promotions</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">3</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>0%</span>
              </p>
            </div>
          </div>
          <Sparkline color="green" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#3B82F6] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Reach</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">24.5K</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>35%</span>
              </p>
            </div>
          </div>
          <Sparkline color="blue" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Sales from Marketing</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">₦785,000</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>42%</span>
              </p>
            </div>
          </div>
          <Sparkline color="orange" />
        </div>
      </div>

      {/* ===================== MIDDLE GRID: ACTIVE CAMPAIGNS & PERFORMANCE ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-[#5135ED]" />
              <h3 className="font-extrabold text-base text-[#15152D]">Active Campaigns</h3>
            </div>
            <span className="text-xs font-bold text-[#5135ED] cursor-pointer hover:underline">View All →</span>
          </div>

          <div className="space-y-4">
            {/* Banner 1: Special Discount 10% */}
            <div className="bg-gradient-to-r from-[#5135ED] to-[#3925C5] rounded-2xl p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex flex-col items-center justify-center text-center shrink-0 p-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">Special</span>
                  <span className="text-xs font-black text-[#FFC928]">10% OFF</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-sm text-white">10% Off Everything</h4>
                    <span className="bg-[#19A76B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      • Active
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-0.5">Get 10% discount on all products this weekend.</p>
                  <div className="flex items-center space-x-4 text-xs font-semibold text-white/90 mt-2">
                    <span>👥 8.5K Reach</span>
                    <span>🛒 1.2K Orders</span>
                    <span>₦482,000</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-white/70 font-medium">Ends: Nov 30, 2026</span>
                <button className="bg-white text-[#5135ED] font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-gray-100 shadow-sm">
                  View Stats
                </button>
                <button className="text-white/70 hover:text-white p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Banner 2: Free Delivery Campaign */}
            <div className="bg-gradient-to-r from-[#281B9B] to-[#3925C5] rounded-2xl p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex flex-col items-center justify-center text-center shrink-0 p-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#FFC928]">Free</span>
                  <span className="text-[10px] font-black text-white">Delivery</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-sm text-white">Free Delivery Campaign</h4>
                    <span className="bg-[#19A76B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      • Active
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-0.5">Enjoy free delivery on all orders this month.</p>
                  <div className="flex items-center space-x-4 text-xs font-semibold text-white/90 mt-2">
                    <span>👥 12.3K Reach</span>
                    <span>🛒 980 Orders</span>
                    <span>₦390,000</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-white/70 font-medium">Ends: Nov 30, 2026</span>
                <button className="bg-white text-[#5135ED] font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-gray-100 shadow-sm">
                  View Stats
                </button>
                <button className="text-white/70 hover:text-white p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Performance Area Chart (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#5135ED]">📈</span>
                <h3 className="font-extrabold text-base text-[#15152D]">Marketing Performance</h3>
              </div>
              <div className="flex items-center space-x-1 text-xs text-[#77778D] font-semibold bg-[#F7F7FC] px-2.5 py-1 rounded-lg border border-[#E8E7F0]">
                <span>Last 30 Days</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs font-bold mb-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5135ED]" />
                <span className="text-[#15152D]">Reach</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]" />
                <span className="text-[#77778D]">Sales</span>
              </div>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#77778D" fontSize={11} tickLine={false} />
                  <YAxis stroke="#77778D" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#15152D', borderRadius: '10px', color: '#fff', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="reach" stroke="#5135ED" strokeWidth={2.5} fill="#5135ED" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="sales" stroke="#C4B5FD" strokeWidth={2} fill="#C4B5FD" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== BOTTOM GRID: PROMOTIONS & QUICK ACTIONS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Promotions Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-[#5135ED]" />
              <h3 className="font-extrabold text-base text-[#15152D]">Promotions</h3>
            </div>
            <span className="text-xs font-bold text-[#5135ED] cursor-pointer hover:underline">View All →</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7FC] text-[#77778D] font-bold border-b border-[#E8E7F0]">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Min Order</th>
                  <th className="p-3">Valid Until</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E7F0]">
                {promotions.map((promo) => (
                  <tr key={promo.code} className="hover:bg-gray-50/60">
                    <td className="p-3 font-extrabold text-[#5135ED]">{promo.code}</td>
                    <td className="p-3 font-bold text-[#15152D]">{promo.discount}</td>
                    <td className="p-3 text-[#77778D] font-medium">{promo.minOrder}</td>
                    <td className="p-3 text-[#77778D] font-medium">{promo.validUntil}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${promo.status === 'Active' ? 'bg-[#E7F8F0] text-[#19A76B]' : 'bg-gray-100 text-gray-600'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {promo.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2 text-[#77778D]">
                      <button className="hover:text-[#5135ED] p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-[#E94B59] p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-[#5135ED] font-bold">⚡</span>
              <h3 className="font-extrabold text-base text-[#15152D]">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => alert('New Campaign')}
                className="bg-[#F7F7FC] hover:bg-[#EEEAFE] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-[#E8E7F0] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5135ED] mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Megaphone className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#15152D]">Create Campaign</span>
              </button>

              <button
                onClick={() => alert('Add Discount Code')}
                className="bg-[#F7F7FC] hover:bg-[#EEEAFE] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-[#E8E7F0] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5135ED] mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#15152D]">Add Discount Code</span>
              </button>

              <button
                onClick={() => alert('Create Promotion')}
                className="bg-[#F7F7FC] hover:bg-[#EEEAFE] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-[#E8E7F0] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5135ED] mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Gift className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#15152D]">Create Promotion</span>
              </button>

              <button
                onClick={() => alert('Send Newsletter')}
                className="bg-[#F7F7FC] hover:bg-[#EEEAFE] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-[#E8E7F0] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5135ED] mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#15152D]">Send Newsletter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
