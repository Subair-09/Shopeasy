import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Trophy,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Sparkline } from '../components/Sparkline';

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30 Days');

  const salesData = [
    { date: 'Oct 1', sales: 300000, orders: 120 },
    { date: 'Oct 4', sales: 420000, orders: 145 },
    { date: 'Oct 7', sales: 380000, orders: 130 },
    { date: 'Oct 11', sales: 550000, orders: 180 },
    { date: 'Oct 14', sales: 500000, orders: 165 },
    { date: 'Oct 18', sales: 720000, orders: 210 },
    { date: 'Oct 21', sales: 872500, orders: 221 },
    { date: 'Oct 25', sales: 780000, orders: 195 },
    { date: 'Oct 28', sales: 980000, orders: 245 },
    { date: 'Oct 30', sales: 1245780, orders: 342 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 32.5, color: '#3B82F6' },
    { name: 'Fashion', value: 28.1, color: '#5135ED' },
    { name: 'Phones', value: 18.7, color: '#10B981' },
    { name: 'Beauty', value: 11.2, color: '#F59E0B' },
    { name: 'Others', value: 9.5, color: '#EC4899' },
  ];

  const weeklyGrowthData = [
    { name: 'Week 1', customers: 2800 },
    { name: 'Week 2', customers: 4100 },
    { name: 'Week 3', customers: 5600 },
    { name: 'Week 4', customers: 8420 },
  ];

  const topSelling = [
    {
      name: 'Wireless Earbuds',
      sold: '1,245 sold',
      revenue: '₦1,245,000',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100',
    },
    {
      name: 'Sports Shoes',
      sold: '980 sold',
      revenue: '₦980,000',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
    },
    {
      name: 'Smart Watch',
      sold: '760 sold',
      revenue: '₦760,000',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
    },
    {
      name: 'Bluetooth Headphones',
      sold: '650 sold',
      revenue: '₦650,000',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    },
    {
      name: "Men's T-Shirt",
      sold: '520 sold',
      revenue: '₦520,000',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100',
    },
  ];

  const recentActivities = [
    { title: 'New order received #SE250730024', time: '2:30 PM', color: '#5135ED' },
    { title: 'New customer registered Chiamaka Okafor', time: '1:45 PM', color: '#10B981' },
    { title: 'Product out of stock Wireless Earbuds', time: '12:20 PM', color: '#E94B59' },
    { title: 'Order delivered #SE250729023', time: '11:50 AM', color: '#3B82F6' },
  ];

  return (
    <div className="space-y-6">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Analytics</h1>
          <p className="text-xs text-[#77778D] font-medium mt-0.5">
            Track your store performance and gain valuable insights.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E8E7F0] shadow-xs text-xs font-bold">
          {['Today', '7 Days', '30 Days', '90 Days', 'This Year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeRange === range
                  ? 'bg-[#5135ED] text-white shadow-xs'
                  : 'text-[#77778D] hover:text-[#15152D]'
              }`}
            >
              {range}
            </button>
          ))}
          <div className="flex items-center space-x-1 pl-2 text-[#77778D] cursor-pointer hover:text-[#15152D]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Custom Range</span>
          </div>
        </div>
      </div>

      {/* ===================== 4 METRICS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5135ED] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Sales</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">₦1,245,780</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>12.5%</span>
              </p>
            </div>
          </div>
          <Sparkline color="purple" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F8F0] text-[#10B981] flex items-center justify-center shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Orders</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">342</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>8.7%</span>
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
              <p className="text-xs font-semibold text-[#77778D]">Total Customers</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">8,420</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>14.3%</span>
              </p>
            </div>
          </div>
          <Sparkline color="blue" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Products</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">856</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>6.1%</span>
              </p>
            </div>
          </div>
          <Sparkline color="orange" />
        </div>
      </div>

      {/* ===================== MIDDLE GRID: SALES OVERVIEW & TOP SELLING ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#5135ED]">📊</span>
              <h3 className="font-extrabold text-base text-[#15152D]">Sales Overview</h3>
            </div>
            <div className="flex items-center space-x-4 text-xs font-bold">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5135ED]" />
                <span className="text-[#15152D]">Sales</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]" />
                <span className="text-[#77778D]">Orders</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#5135ED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5135ED" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#C4B5FD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#77778D" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#77778D"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₦${val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${Math.round(val / 1000)}k`}`}
                />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'sales' ? `₦${Number(val).toLocaleString()}` : val,
                    name === 'sales' ? 'Sales' : 'Orders',
                  ]}
                  contentStyle={{
                    backgroundColor: '#15152D',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#5135ED" strokeWidth={3} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="orders" stroke="#C4B5FD" strokeWidth={2} fill="url(#ordersGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top-Selling Products */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-[#5135ED]" />
                <h3 className="font-extrabold text-base text-[#15152D]">Top-Selling Products</h3>
              </div>
              <button onClick={() => navigate('/products')} className="text-xs font-bold text-[#5135ED] hover:underline">
                View All →
              </button>
            </div>

            <div className="space-y-3.5">
              {topSelling.map((prod) => (
                <div key={prod.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-contain bg-[#F7F7FC] p-1 border border-[#E8E7F0]" />
                    <div>
                      <p className="text-xs font-extrabold text-[#15152D]">{prod.name}</p>
                      <p className="text-[11px] text-[#77778D] font-medium">{prod.sold}</p>
                    </div>
                  </div>
                  <p className="text-xs font-extrabold text-[#5135ED]">{prod.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== BOTTOM GRID: DONUT, BAR CHART & ACTIVITIES ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales by Category Donut */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft">
          <h3 className="font-extrabold text-base text-[#15152D] mb-4">Sales by Category</h3>
          <div className="flex items-center justify-between">
            <div className="w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={38} outerRadius={54} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs font-semibold">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#77778D] min-w-[70px]">{cat.name}</span>
                  <span className="font-extrabold text-[#15152D]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Growth Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#15152D]">Customer Growth</h3>
              <button onClick={() => navigate('/customers')} className="text-xs font-bold text-[#5135ED] hover:underline">
                View Report →
              </button>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#77778D" fontSize={11} tickLine={false} />
                  <YAxis stroke="#77778D" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#15152D', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
                  />
                  <Bar dataKey="customers" fill="#5135ED" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[#5135ED]" />
                <h3 className="font-extrabold text-base text-[#15152D]">Recent Activities</h3>
              </div>
              <span className="text-xs font-bold text-[#5135ED] cursor-pointer hover:underline">View All →</span>
            </div>

            <div className="space-y-3.5 text-xs font-semibold">
              {recentActivities.map((act, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: act.color }} />
                    <p className="text-[#15152D] leading-tight pr-2">{act.title}</p>
                  </div>
                  <span className="text-[11px] text-[#77778D] shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
