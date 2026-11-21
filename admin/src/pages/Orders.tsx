import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  SlidersHorizontal,
  Calendar,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { Sparkline } from '../components/Sparkline';
import { apiClient, MOCK_ORDERS } from '../services/api';

export const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<string>('Pending');

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/orders', {
        params: { status: activeTab, search },
      });
      if (res.data?.success && res.data?.data?.orders) {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      // Keep mock orders
    }
  };

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    setStatusUpdate(order.orderStatus);
    setModalOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
      await apiClient.patch(`/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by admin`,
      });
      fetchOrders();
    } catch (e) {
      // Optimistic update
      setOrders((prev: any) =>
        prev.map((o: any) =>
          o._id === selectedOrder._id ? { ...o, orderStatus: newStatus } : o
        )
      );
    }
    setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    setStatusUpdate(newStatus);
  };

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

  const filteredOrders = orders.filter((o) => {
    if (activeTab !== 'All' && o.orderStatus !== activeTab) return false;
    if (search && !o.orderNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Orders</h1>
          <p className="text-xs text-[#77778D] font-medium mt-0.5">
            Manage and track all customer orders.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-[#E8E7F0] shadow-xs text-xs font-semibold text-[#15152D]">
          <Calendar className="w-4 h-4 text-[#77778D]" />
          <span>Last 30 Days</span>
        </div>
      </div>

      {/* ===================== 4 METRICS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5135ED] flex items-center justify-center shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Orders</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">248</h3>
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
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Delivered Orders</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">180</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>10.2%</span>
              </p>
            </div>
          </div>
          <Sparkline color="green" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Processing Orders</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">46</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>8.1%</span>
              </p>
            </div>
          </div>
          <Sparkline color="orange" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#3B82F6] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Pending Orders</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">22</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>5.7%</span>
              </p>
            </div>
          </div>
          <Sparkline color="blue" />
        </div>
      </div>

      {/* ===================== FILTER TABS & SEARCH BAR ===================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
          {[
            { label: 'All', count: 248 },
            { label: 'Pending', count: 22 },
            { label: 'Processing', count: 46 },
            { label: 'Shipped', count: 38 },
            { label: 'Delivered', count: 180 },
            { label: 'Cancelled', count: 12 },
          ].map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#5135ED] text-white shadow-sm'
                    : 'bg-white text-[#77778D] hover:text-[#15152D] border border-[#E8E7F0]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* Search by order ID */}
        <div className="flex items-center space-x-2">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-[#77778D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-[#15152D] text-xs rounded-xl pl-10 pr-4 py-2 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED]"
            />
          </div>
          <button className="p-2 rounded-xl bg-white border border-[#E8E7F0] text-[#77778D] hover:text-[#15152D]">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===================== ORDERS TABLE ===================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7FC] text-[#77778D] font-bold border-b border-[#E8E7F0]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Products</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Order Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E7F0]">
              {filteredOrders.map((order) => {
                const totalFormatted = `₦${(order.totalAmount || Math.round(order.totalKobo / 100)).toLocaleString()}`;
                const customer = order.customer || { name: 'Customer', email: 'user@example.com' };
                const extraItems = (order.items?.length || 1) - 1;

                return (
                  <tr key={order._id || order.orderNumber} className="hover:bg-gray-50/60 transition-colors">
                    {/* Order ID & timestamp */}
                    <td className="p-4">
                      <p className="font-extrabold text-[#15152D]">{order.orderNumber}</p>
                      <p className="text-[11px] text-[#77778D]">{order.orderDate || 'Jul 26, 2025 • 2:14 PM'}</p>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={customer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                          alt={customer.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#E8E7F0]"
                        />
                        <div>
                          <p className="font-bold text-[#15152D]">{customer.name}</p>
                          <p className="text-[11px] text-[#77778D]">{customer.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Product Thumbnails */}
                    <td className="p-4">
                      <div className="flex items-center space-x-1.5">
                        {order.items?.slice(0, 2).map((item: any, i: number) => (
                          <img
                            key={i}
                            src={item.image}
                            alt="thumb"
                            className="w-9 h-9 rounded-lg object-contain bg-[#F7F7FC] p-1 border border-[#E8E7F0]"
                          />
                        ))}
                        {extraItems > 0 && (
                          <span className="text-[10px] font-bold text-[#77778D] bg-[#F7F7FC] border border-[#E8E7F0] px-1.5 py-1 rounded-md">
                            +{extraItems} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="p-4 font-extrabold text-[#15152D]">
                      {totalFormatted}
                    </td>

                    {/* Order Date */}
                    <td className="p-4 text-[#15152D] font-medium">
                      <p>{order.orderDate?.split('•')[0] || 'Jul 26, 2025'}</p>
                      <p className="text-[11px] text-[#77778D]">{order.orderDate?.split('•')[1] || '2:14 PM'}</p>
                    </td>

                    {/* Status Pill */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(order.orderStatus)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {order.orderStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenDetails(order)}
                          className="border border-[#E8E7F0] hover:border-[#5135ED] text-[#5135ED] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button className="text-[#77778D] hover:text-[#15152D] p-1.5 rounded-lg hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#E8E7F0] flex items-center justify-between text-xs text-[#77778D] font-semibold">
          <p>Showing 1 – 5 of 248 orders</p>
          <div className="flex items-center space-x-1">
            <button className="p-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#5135ED] text-white font-bold">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="px-3 py-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">50</button>
            <button className="p-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================== ORDER DETAILS MODAL ===================== */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E7F0] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E7F0] mb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#15152D]">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-[#77778D] mt-0.5">{selectedOrder.orderDate || 'Jul 26, 2025 • 2:14 PM'}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#77778D] hover:text-[#15152D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Transition Control */}
            <div className="bg-[#F7F7FC] p-3.5 rounded-2xl mb-4 border border-[#E8E7F0]">
              <label className="block text-xs font-bold text-[#15152D] mb-2">Update Order Status</label>
              <div className="flex flex-wrap gap-2">
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedOrder.orderStatus === st
                        ? 'bg-[#5135ED] text-white shadow-sm'
                        : 'bg-white text-[#77778D] border border-[#E8E7F0] hover:text-[#15152D]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Shipping info */}
            <div className="space-y-3 text-xs mb-5">
              <div className="p-3 bg-white rounded-xl border border-[#E8E7F0]">
                <p className="font-bold text-[#15152D] mb-1">Customer Information</p>
                <p className="text-[#77778D]"><span className="font-semibold text-[#15152D]">Name:</span> {selectedOrder.customer?.name}</p>
                <p className="text-[#77778D]"><span className="font-semibold text-[#15152D]">Email:</span> {selectedOrder.customer?.email}</p>
                <p className="text-[#77778D]"><span className="font-semibold text-[#15152D]">Payment:</span> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
              </div>

              {/* Items List */}
              <div className="p-3 bg-white rounded-xl border border-[#E8E7F0]">
                <p className="font-bold text-[#15152D] mb-2">Ordered Items ({selectedOrder.items?.length || 1})</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img src={item.image} alt="product" className="w-10 h-10 rounded-lg object-contain bg-[#F7F7FC] p-1 border border-[#E8E7F0]" />
                        <div>
                          <p className="font-bold text-[#15152D]">{item.name}</p>
                          <p className="text-[11px] text-[#77778D]">Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <p className="font-bold text-[#5135ED]">
                        ₦{((item.priceKobo ? item.priceKobo / 100 : 25000) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 bg-[#EEEAFE] rounded-xl flex items-center justify-between font-extrabold text-[#5135ED]">
                <span>Total Amount</span>
                <span className="text-base">
                  ₦{(selectedOrder.totalAmount || Math.round(selectedOrder.totalKobo / 100)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full bg-[#5135ED] text-white font-bold py-2.5 rounded-xl hover:bg-[#3925C5]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
