import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  Users,
  Star,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Sparkline } from '../components/Sparkline';
import { apiClient } from '../services/api';

const EMPTY_DASHBOARD = {
  metrics: {
    totalSales: '₦0',
    salesChange: '0%',
    totalOrders: '0',
    ordersChange: '0%',
    totalCustomers: '0',
    customersChange: '0%',
    totalProducts: '0',
    productsChange: '0%',
  },
  salesChart: [] as { date: string; sales: number; orders: number }[],
  topProducts: [] as any[],
  customerGrowth: {
    total: '0',
    newCustomersPercent: 0,
    returningCustomersPercent: 0,
  },
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [data, setData] = useState(EMPTY_DASHBOARD);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/dashboard?range=${timeRange}`);
        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setData({
            metrics: {
              totalSales: d.metrics?.totalSalesFormatted || '₦0',
              salesChange: d.metrics?.salesGrowth || '0%',
              totalOrders: String(d.metrics?.totalOrders || '0'),
              ordersChange: d.metrics?.ordersGrowth || '0%',
              totalCustomers: d.customerGrowth?.totalCustomersFormatted || String(d.metrics?.totalCustomers || '0'),
              customersChange: d.metrics?.customersGrowth || '0%',
              totalProducts: String(d.metrics?.totalProducts || '0'),
              productsChange: d.metrics?.productsGrowth || '0%',
            },
            salesChart: d.salesOverview?.chartData || [],
            topProducts: (d.topSellingProducts || []).map((p: any) => ({
              id: p._id,
              name: p.name,
              price: `₦${(p.price || Math.round((p.discountedPriceKobo || 0) / 100)).toLocaleString()}`,
              sold: `${p.salesCount >= 1000 ? (p.salesCount / 1000).toFixed(1) + 'k' : p.salesCount || 0} sold`,
              image: p.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
            })),
            customerGrowth: {
              total: d.customerGrowth?.totalCustomersFormatted || '0',
              newCustomersPercent: d.customerGrowth?.newCustomersPercentage || 0,
              returningCustomersPercent: d.customerGrowth?.returningCustomersPercentage || 0,
            },
          });
          setOrders(d.recentOrders || []);
        }
      } catch (err) {
        // Clear or show empty
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [timeRange]);

  const donutData = [
    { name: 'New Customers', value: data.customerGrowth.newCustomersPercent, color: '#5135ED' },
    { name: 'Returning Customers', value: data.customerGrowth.returningCustomersPercent, color: '#C4B5FD' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#E7F8F0] text-[#19A76B]';
      case 'Processing':
        return 'bg-[#FFF8E7] text-[#FFBE45]';
      case 'Shipped':
        return 'bg-[#EBF3FF] text-[#3B82F6]';
      case 'Pending':
        return 'bg-[#EEEAFE] text-[#5135ED]';
      case 'Cancelled':
        return 'bg-[#FEECEE] text-[#E94B59]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Dashboard</h1>
          <p className="text-xs text-[#77778D] font-medium mt-0.5">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-[#E8E7F0] shadow-xs text-xs font-semibold text-[#15152D]">
          <Calendar className="w-4 h-4 text-[#77778D]" />
          <span>Last 30 Days</span>
        </div>
      </div>

      {/* ===================== 4 STAT METRICS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] flex items-center justify-center text-[#5135ED] shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Sales</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">{data.metrics.totalSales}</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>{data.metrics.salesChange}</span>
              </p>
            </div>
          </div>
          <Sparkline color="purple" />
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] flex items-center justify-center text-[#3B82F6] shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Orders</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">{data.metrics.totalOrders}</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>{data.metrics.ordersChange}</span>
              </p>
            </div>
          </div>
          <Sparkline color="blue" />
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F8F0] flex items-center justify-center text-[#10B981] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Customers</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">{data.metrics.totalCustomers}</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>{data.metrics.customersChange}</span>
              </p>
            </div>
          </div>
          <Sparkline color="green" />
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-[#F59E0B] shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Products</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">{data.metrics.totalProducts}</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>{data.metrics.productsChange}</span>
              </p>
            </div>
          </div>
          <Sparkline color="yellow" />
        </div>
      </div>

      {/* ===================== MIDDLE GRID: SALES OVERVIEW & RECENT ORDERS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#EEEAFE] flex items-center justify-center text-[#5135ED]">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-[#15152D]">Sales Overview</h3>
            </div>
            {/* Timeframe selector tabs */}
            <div className="flex items-center bg-[#F7F7FC] p-1 rounded-xl border border-[#E8E7F0]">
              {(['7D', '30D', '90D', '1Y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    timeRange === range
                      ? 'bg-[#5135ED] text-white shadow-xs'
                      : 'text-[#77778D] hover:text-[#15152D]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#5135ED" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#5135ED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#77778D"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E8E7F0' }}
                />
                <YAxis
                  stroke="#77778D"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E8E7F0' }}
                  tickFormatter={(val) => `₦${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
                />
                <Tooltip
                  formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Sales']}
                  contentStyle={{
                    backgroundColor: '#15152D',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                  itemStyle={{ color: '#FFC928' }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#5135ED"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <span className="text-amber-500 font-bold">⚡</span>
                <h3 className="font-extrabold text-base text-[#15152D]">Recent Orders</h3>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="text-xs font-bold text-[#5135ED] hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => {
                const item = order.items?.[0];
                return (
                  <div
                    key={order._id || order.orderNumber}
                    onClick={() => navigate('/orders')}
                    className="flex items-center justify-between p-2 hover:bg-[#F7F7FC] rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item?.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100'}
                        alt="Product"
                        className="w-11 h-11 rounded-xl object-cover bg-[#EEEAFE] p-1 border border-[#E8E7F0]"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-[#15152D]">{order.orderNumber}</p>
                        <p className="text-[11px] text-[#77778D] font-medium">
                          {order.orderDate || 'Jul 26, 2025'} • {order.items?.length || 1} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#77778D]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== BOTTOM GRID: TOP SELLING PRODUCTS & CUSTOMER GROWTH ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-[#5135ED]" />
              <h3 className="font-extrabold text-base text-[#15152D]">Top Selling Products</h3>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="text-xs font-bold text-[#5135ED] hover:underline"
            >
              Manage Catalog →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {data.topProducts.map((prod) => (
              <div
                key={prod.id || prod.name}
                onClick={() => navigate('/products')}
                className="bg-[#F7F7FC] hover:bg-[#EEEAFE]/50 rounded-2xl p-3 border border-[#E8E7F0] flex flex-col justify-between transition-all cursor-pointer group"
              >
                <div className="w-full h-24 rounded-xl bg-white flex items-center justify-center p-2 mb-2 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#15152D] truncate" title={prod.name}>
                    {prod.name}
                  </h4>
                  <p className="text-xs font-extrabold text-[#5135ED] mt-0.5">{prod.price}</p>
                  <p className="text-[10px] text-[#77778D] font-medium">{prod.sold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Growth Donut (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E7F0] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#5135ED]" />
                <h3 className="font-extrabold text-base text-[#15152D]">Customer Growth</h3>
              </div>
              <button
                onClick={() => navigate('/customers')}
                className="text-xs font-bold text-[#5135ED] hover:underline flex items-center space-x-1"
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </div>

            <div className="relative h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-extrabold text-[#15152D]">{data.customerGrowth.total}</span>
                <span className="text-[10px] text-[#77778D] font-medium">Total Customers</span>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5135ED]" />
                  <span className="text-[#77778D]">New Customers</span>
                </div>
                <span className="text-[#15152D] font-bold">{data.customerGrowth.newCustomersPercent}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]" />
                  <span className="text-[#77778D]">Returning Customers</span>
                </div>
                <span className="text-[#15152D] font-bold">{data.customerGrowth.returningCustomersPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
