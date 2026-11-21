import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Star,
  Crown,
  Download,
  Plus,
  Search,
  Calendar,
  LayoutGrid,
  List,
  Eye,
  Edit2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { Sparkline } from '../components/Sparkline';
import { apiClient, MOCK_CUSTOMERS } from '../services/api';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Customers');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const fetchCustomers = async () => {
    try {
      const res = await apiClient.get('/customers', {
        params: { status: statusFilter, search },
      });
      if (res.data?.success && res.data?.data?.customers) {
        setCustomers(res.data.data.customers);
      }
    } catch (err) {
      // Keep mock customers
    }
  };

  const handleOpenDetails = (c: any) => {
    setSelectedCustomer(c);
    setModalOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiClient.patch(`/customers/${id}/status`);
      fetchCustomers();
    } catch (e) {
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
      );
    }
    if (selectedCustomer && selectedCustomer._id === id) {
      setSelectedCustomer({ ...selectedCustomer, isActive: !selectedCustomer.isActive });
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/customers', newCustomer);
      fetchCustomers();
    } catch (err) {
      const mockNew = {
        _id: `c_${Date.now()}`,
        ...newCustomer,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        totalOrders: 0,
        totalSpent: 0,
        totalSpentKobo: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [mockNew, ...prev]);
    }
    setAddModalOpen(false);
    setNewCustomer({ name: '', email: '', phone: '' });
  };

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter === 'Active' && !c.isActive) return false;
    if (statusFilter === 'Inactive' && c.isActive) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.email.toLowerCase().includes(search.toLowerCase()) &&
      !c.phone?.includes(search)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Customers</h1>
          <p className="text-xs text-[#77778D] font-medium mt-0.5">
            Manage your store customers and their information.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => alert('Exporting customer data to CSV...')}
            className="bg-[#EEEAFE] hover:bg-[#5135ED]/15 text-[#5135ED] font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Customers</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[#5135ED] hover:bg-[#3925C5] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#5135ED]/20 flex items-center space-x-1.5 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* ===================== 4 METRICS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5135ED] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Total Customers</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">12,450</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>15.7%</span>
              </p>
            </div>
          </div>
          <Sparkline color="purple" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F8F0] text-[#10B981] flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">Active Customers</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">11,980</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>14.2%</span>
              </p>
            </div>
          </div>
          <Sparkline color="green" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">New Customers</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">892</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>20.1%</span>
              </p>
            </div>
          </div>
          <Sparkline color="orange" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E7F0] shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#3B82F6] flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#77778D]">VIP Customers</p>
              <h3 className="text-xl font-extrabold text-[#15152D] mt-0.5">1,245</h3>
              <p className="text-[11px] font-bold text-[#19A76B] flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>18.3%</span>
              </p>
            </div>
          </div>
          <Sparkline color="blue" />
        </div>
      </div>

      {/* ===================== FILTER BAR ===================== */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E7F0] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#77778D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F7F7FC] text-[#15152D] text-xs rounded-xl pl-10 pr-4 py-2.5 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7FC] border border-[#E8E7F0] rounded-xl px-3 py-2 text-[#15152D] font-semibold focus:outline-none"
          >
            <option>All Customers</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select className="bg-[#F7F7FC] border border-[#E8E7F0] rounded-xl px-3 py-2 text-[#15152D] font-semibold focus:outline-none">
            <option>Sort by: Latest</option>
            <option>Orders: High to Low</option>
            <option>Spent: High to Low</option>
          </select>

          <div className="flex items-center space-x-1.5 bg-[#F7F7FC] px-3 py-2 rounded-xl border border-[#E8E7F0] font-semibold text-[#15152D]">
            <Calendar className="w-3.5 h-3.5 text-[#77778D]" />
            <span>Last 30 Days</span>
          </div>

          <div className="flex items-center bg-[#F7F7FC] p-1 rounded-xl border border-[#E8E7F0]">
            <button className="p-1.5 rounded-lg text-[#77778D] hover:text-[#15152D]">
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-lg bg-[#5135ED] text-white">
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================== CUSTOMERS TABLE ===================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7FC] text-[#77778D] font-bold border-b border-[#E8E7F0]">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E7F0]">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={customer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                      alt={customer.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#E8E7F0]"
                    />
                    <div>
                      <p className="font-bold text-[#15152D]">{customer.name}</p>
                      <p className="text-[11px] text-[#77778D]">{customer.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[#77778D] font-medium">{customer.email}</td>
                  <td className="p-4 text-[#77778D] font-medium">{customer.phone}</td>
                  <td className="p-4 font-bold text-[#15152D]">{customer.totalOrders}</td>
                  <td className="p-4 font-extrabold text-[#15152D]">
                    ₦{(customer.totalSpent || Math.round((customer.totalSpentKobo || 0) / 100)).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(customer._id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${
                        customer.isActive ? 'bg-[#E7F8F0] text-[#19A76B]' : 'bg-[#FEECEE] text-[#E94B59]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2 text-[#77778D]">
                      <button
                        onClick={() => handleOpenDetails(customer)}
                        className="p-1.5 hover:text-[#5135ED] hover:bg-[#EEEAFE] rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDetails(customer)}
                        className="p-1.5 hover:text-[#5135ED] hover:bg-[#EEEAFE] rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 hover:text-[#15152D] hover:bg-gray-100 rounded-lg">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#E8E7F0] flex items-center justify-between text-xs text-[#77778D] font-semibold">
          <p>Showing 1 – 5 of 12,450 customers</p>
          <div className="flex items-center space-x-1">
            <button className="px-2 py-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">«</button>
            <button className="p-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#5135ED] text-white font-bold">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="px-3 py-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">2,490</button>
            <button className="p-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button className="px-2 py-1.5 rounded-lg border border-[#E8E7F0] hover:bg-gray-50">»</button>
          </div>
        </div>
      </div>

      {/* ===================== ADD CUSTOMER MODAL ===================== */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E7F0]">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E7F0] mb-4">
              <h3 className="font-extrabold text-base text-[#15152D]">Add New Customer</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-[#77778D] hover:text-[#15152D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#15152D] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="e.g. Nurudeen Adewale"
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED]"
                />
              </div>

              <div>
                <label className="block text-[#15152D] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="customer@example.com"
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED]"
                />
              </div>

              <div>
                <label className="block text-[#15152D] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+234 801 234 5678"
                  className="w-full bg-[#F7F7FC] rounded-xl px-3.5 py-2.5 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E7F0]">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E7F0] text-[#77778D] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5135ED] text-white font-bold hover:bg-[#3925C5]"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== VIEW CUSTOMER DETAILS MODAL ===================== */}
      {modalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E7F0]">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E7F0] mb-4">
              <h3 className="font-extrabold text-base text-[#15152D]">Customer Profile</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#77778D] hover:text-[#15152D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-5">
              <img
                src={selectedCustomer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#5135ED]/30"
              />
              <div>
                <h4 className="font-extrabold text-base text-[#15152D]">{selectedCustomer.name}</h4>
                <p className="text-xs text-[#77778D]">{selectedCustomer.email}</p>
                <p className="text-xs text-[#77778D]">{selectedCustomer.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-center">
              <div className="bg-[#EEEAFE] p-3 rounded-2xl">
                <p className="text-xs text-[#77778D] font-semibold">Total Orders</p>
                <p className="text-xl font-extrabold text-[#5135ED]">{selectedCustomer.totalOrders}</p>
              </div>
              <div className="bg-[#E7F8F0] p-3 rounded-2xl">
                <p className="text-xs text-[#77778D] font-semibold">Total Spent</p>
                <p className="text-xl font-extrabold text-[#10B981]">
                  ₦{(selectedCustomer.totalSpent || Math.round((selectedCustomer.totalSpentKobo || 0) / 100)).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#F7F7FC] rounded-2xl mb-5 text-xs font-bold">
              <span>Account Status</span>
              <button
                onClick={() => handleToggleStatus(selectedCustomer._id)}
                className={`px-3 py-1 rounded-full ${selectedCustomer.isActive ? 'bg-[#E7F8F0] text-[#19A76B]' : 'bg-[#FEECEE] text-[#E94B59]'}`}
              >
                {selectedCustomer.isActive ? 'Active (Click to Deactivate)' : 'Inactive (Click to Activate)'}
              </button>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full bg-[#5135ED] text-white font-bold py-2.5 rounded-xl hover:bg-[#3925C5]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
