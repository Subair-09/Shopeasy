import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Grid,
  Users,
  BarChart2,
  Megaphone,
  Settings,
  Headphones,
  ChevronRight,
  ChevronDown,
  Bell,
  Search,
  LogOut,
  Rocket,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package, hasSubmenu: true },
    { name: 'Orders', path: '/orders', icon: ShoppingCart, badge: '12' },
    { name: 'Categories', path: '/categories', icon: Grid },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Marketing', path: '/marketing', icon: Megaphone },
    { name: 'Settings', path: '/settings', icon: Settings, hasSubmenu: true },
    { name: 'Help & Support', path: '/help', icon: Headphones },
  ];

  return (
    <div className="flex min-h-screen bg-[#F7F7FC] text-[#15152D] font-sans">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="w-[260px] bg-[#5135ED] text-white flex flex-col justify-between py-6 px-4 shrink-0 shadow-xl">
        <div>
          {/* Logo Branding */}
          <div className="flex items-center space-x-3 px-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center text-xl font-extrabold tracking-tight">
                <span className="text-white">Shop</span>
                <span className="text-[#FFC928]">Easy</span>
              </div>
              <p className="text-[10px] text-white/70 tracking-wide font-medium">Shop Smart. Live Better.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#5135ED] shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#5135ED]' : 'text-white/80'}`} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {item.badge && (
                      <span className="bg-[#E94B59] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    {item.hasSubmenu && !isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                    )}
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4 pt-6">
          {/* Rocket Campaign Banner */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Grow Your Store</h4>
                <p className="text-[11px] text-white/70 leading-tight mb-2.5">
                  Run promotions and reach more customers.
                </p>
                <button
                  onClick={() => navigate('/marketing')}
                  className="bg-[#FFC928] hover:bg-[#ffbe1a] text-[#15152D] font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition-transform active:scale-95 flex items-center space-x-1"
                >
                  <span>Create Campaign</span>
                  <span>→</span>
                </button>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5 text-white transform -rotate-12" />
              </div>
            </div>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-2 border border-white/10">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <img
                src={admin?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                alt="Admin"
                className="w-9 h-9 rounded-full object-cover border-2 border-white/30 shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white leading-tight truncate">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] text-white/60 leading-tight truncate">{admin?.email || 'admin@shopeasy.com'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 bg-white border-b border-[#E8E7F0] px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Global Search Bar */}
          <div className="relative w-80 max-w-md">
            <Search className="w-4 h-4 text-[#77778D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F7FC] text-[#15152D] text-sm rounded-full pl-10 pr-4 py-2 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED] transition-colors"
            />
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-full bg-[#F7F7FC] border border-[#E8E7F0] flex items-center justify-center text-[#15152D] hover:bg-[#EEEAFE] hover:text-[#5135ED] transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-[#E94B59] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E8E7F0] p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E7F0] mb-2">
                    <h4 className="font-bold text-sm text-[#15152D]">Notifications</h4>
                    <span className="text-[11px] font-semibold text-[#5135ED] cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-[#EEEAFE] border border-[#5135ED]/20">
                      <p className="font-semibold text-[#5135ED]">New Order #SE250726001</p>
                      <p className="text-[#77778D] text-[11px]">Chioma Okafor paid ₦82,000 via Paystack</p>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-gray-50 border border-transparent">
                      <p className="font-semibold text-[#15152D]">Low Stock Alert</p>
                      <p className="text-[#77778D] text-[11px]">Laptop (SE-LP-006) has 12 units remaining</p>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-gray-50 border border-transparent">
                      <p className="font-semibold text-[#15152D]">New Customer Registration</p>
                      <p className="text-[#77778D] text-[11px]">Ngozi James joined ShopEasy</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2.5 bg-[#F7F7FC] hover:bg-[#EEEAFE] rounded-full p-1.5 pr-3 border border-[#E8E7F0] transition-colors"
              >
                <img
                  src={admin?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-[#15152D]">{admin?.name || 'Admin'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#77778D]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E8E7F0] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#E8E7F0]">
                    <p className="font-bold text-xs text-[#15152D]">{admin?.name || 'Admin'}</p>
                    <p className="text-[11px] text-[#77778D] truncate">{admin?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#15152D] hover:bg-[#EEEAFE] hover:text-[#5135ED] flex items-center space-x-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#E94B59] hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
