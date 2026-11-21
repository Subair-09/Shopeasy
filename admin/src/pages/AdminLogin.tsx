import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@shopeasy.com');
  const [password, setPassword] = useState('Admin@123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password, rememberMe);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F7FC] text-[#15152D] font-sans selection:bg-[#5135ED] selection:text-white">
      {/* ===================== LEFT BRANDING PANEL ===================== */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#5135ED] via-[#3925C5] to-[#281B9B] text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Background Decorative Rings */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-md">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center text-2xl font-extrabold tracking-tight">
              <span className="text-white">Shop</span>
              <span className="text-[#FFC928]">Easy</span>
            </div>
            <p className="text-xs text-white/80 font-medium">Shop Smart. Live Better.</p>
          </div>
        </div>

        {/* Center Marketing Copy & Features */}
        <div className="relative z-10 my-10 lg:my-0 max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
            Admin Panel <br />
            <span className="text-[#FFC928]">Dashboard</span>
          </h1>
          <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-8">
            Manage your store, products, orders and customers with ease.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10">
            {[
              'Add & Manage Products',
              'View Orders & Sales',
              'Track Performance',
              'Grow Your Business',
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs lg:text-sm font-semibold text-white/95">{feature}</span>
              </div>
            ))}
          </div>

          {/* 3D Illustration Graphic Container */}
          <div className="relative mx-auto max-w-md flex items-center justify-center pt-4">
            <div className="w-72 h-44 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-4 flex flex-col justify-between transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] text-white/70 font-mono">analytics.shopeasy.com</span>
              </div>
              <div className="flex items-end justify-between h-20 px-2 pt-2">
                <div className="w-8 bg-[#FFC928] rounded-t-md h-[40%]" />
                <div className="w-8 bg-white/70 rounded-t-md h-[65%]" />
                <div className="w-8 bg-[#FFC928] rounded-t-md h-[50%]" />
                <div className="w-8 bg-white/80 rounded-t-md h-[85%]" />
                <div className="w-8 bg-[#FFC928] rounded-t-md h-[100%]" />
              </div>
            </div>
            {/* Shopping Bag floating badge */}
            <div className="absolute -bottom-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3 shadow-lg flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-[#FFC928]" />
              <div>
                <p className="text-[10px] text-white/70 font-medium">Orders Today</p>
                <p className="text-sm font-extrabold text-white">+842</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/60">
          © 2025 ShopEasy. All rights reserved.
        </div>
      </div>

      {/* ===================== RIGHT LOGIN FORM PANEL ===================== */}
      <div className="lg:w-1/2 flex flex-col items-center justify-between p-6 lg:p-14">
        <div className="w-full flex justify-end">
          <span className="text-xs text-[#77778D] font-medium">
            Super Admin: <span className="text-[#5135ED] font-semibold">admin@shopeasy.com</span>
          </span>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-[#E8E7F0] p-8 lg:p-10 my-auto">
          {/* Header Icon & Title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#EEEAFE] text-[#5135ED] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Admin Login</h2>
            <p className="text-xs text-[#77778D] mt-1 font-medium">
              Access your ShopEasy admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#15152D] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#77778D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shopeasy.com"
                  className="w-full bg-[#F7F7FC] text-[#15152D] text-sm rounded-xl pl-10 pr-4 py-3 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#15152D] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#77778D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F7F7FC] text-[#15152D] text-sm rounded-xl pl-10 pr-10 py-3 border border-[#E8E7F0] focus:outline-none focus:border-[#5135ED] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77778D] hover:text-[#15152D]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5135ED] focus:ring-[#5135ED] border-[#E8E7F0]"
                />
                <span className="font-semibold text-[#15152D]">Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to registered email.')}
                className="font-semibold text-[#5135ED] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5135ED] hover:bg-[#3925C5] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-[#5135ED]/25 transition-all active:scale-[0.99] flex items-center justify-center space-x-2 mt-2 disabled:opacity-70"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Signing in...' : 'Login to Admin Panel'}</span>
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E7F0]" />
            </div>
            <span className="relative bg-white px-3 text-xs text-[#77778D] font-medium">or</span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => {
              setEmail('admin@shopeasy.com');
              setPassword('Admin@123456');
            }}
            className="w-full bg-white hover:bg-gray-50 border border-[#E8E7F0] text-[#15152D] font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-xs"
          >
            <span className="text-base font-bold text-red-500">G</span>
            <span>Continue with Google</span>
          </button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-1.5 text-[11px] font-semibold text-[#5135ED]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Access Only</span>
          </div>
        </div>

        <div className="text-xs text-[#77778D]">
          Powered by <span className="font-bold text-[#5135ED]">ShopEasy</span>
        </div>
      </div>
    </div>
  );
};
