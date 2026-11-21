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
  Loader2,
} from 'lucide-react';
import { useAuth, ALLOWED_ADMIN_EMAIL } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Form Validation Errors
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (emailVal: string, passwordVal: string) => {
    const errs: { email?: string; password?: string } = {};
    const emailTrimmed = emailVal.trim();

    if (!emailTrimmed) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = 'Please enter a valid email address';
    } else if (emailTrimmed.toLowerCase() !== ALLOWED_ADMIN_EMAIL) {
      errs.email = `Only authorized administrator (${ALLOWED_ADMIN_EMAIL}) may log in`;
    }

    if (!passwordVal) {
      errs.password = 'Password is required';
    } else if (passwordVal.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (serverError) setServerError(null);
    if (touched.email) validate(val, password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (serverError) setServerError(null);
    if (touched.password) validate(email, val);
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(email, password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError(null);

    const isValid = validate(email, password);
    if (!isValid) return;

    const result = await login(email, password, rememberMe);
    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.message || 'Invalid email or password.');
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
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBE45]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#19A76B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                </div>
                <span className="text-[10px] font-bold text-white/70">ShopEasy Analytics</span>
              </div>

              <div className="flex items-end justify-between h-20 px-2 pt-2">
                {[35, 60, 45, 80, 65, 95, 75].map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-1">
                    <div
                      style={{ height: `${val * 0.7}px` }}
                      className="w-4 bg-gradient-to-t from-white/40 to-[#FFC928] rounded-t-sm"
                    />
                    <span className="text-[8px] text-white/60">D{idx + 1}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-white/80">
                <span>Revenue Growth</span>
                <span className="font-extrabold text-[#19A76B] bg-white/90 px-1.5 py-0.5 rounded text-[9px]">
                  +28.5%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/60">
          © 2026 ShopEasy Inc. All rights reserved.
        </div>
      </div>

      {/* ===================== RIGHT LOGIN FORM ===================== */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#5135ED]/5 border border-[#E8E7F0]">
          {/* Header Shield & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EEEAFE] text-[#5135ED] mb-3 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#15152D] tracking-tight">Admin Login</h2>
            <p className="text-xs text-[#77778D] font-medium mt-1">
              Access your ShopEasy administrative dashboard
            </p>
          </div>

          {/* Error Banner */}
          {serverError && (
            <div className="mb-6 p-3.5 bg-[#FFF2F4] border border-[#E94B59]/20 rounded-xl flex items-start space-x-2.5 text-[#E94B59]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#15152D] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77778D]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="nuddywale@gmail.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                    fieldErrors.email
                      ? 'border-[#E94B59] bg-[#FFF2F4]/40 focus:border-[#E94B59] focus:ring-2 focus:ring-[#E94B59]/10'
                      : 'border-[#E8E7F0] bg-[#F7F7FC] focus:bg-white focus:border-[#5135ED] focus:ring-2 focus:ring-[#5135ED]/10'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] font-semibold text-[#E94B59] mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#15152D]">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Please contact store administrator to reset credentials.')}
                  className="text-xs font-semibold text-[#5135ED] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77778D]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your admin password"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                    fieldErrors.password
                      ? 'border-[#E94B59] bg-[#FFF2F4]/40 focus:border-[#E94B59] focus:ring-2 focus:ring-[#E94B59]/10'
                      : 'border-[#E8E7F0] bg-[#F7F7FC] focus:bg-white focus:border-[#5135ED] focus:ring-2 focus:ring-[#5135ED]/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#77778D] hover:text-[#15152D] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] font-semibold text-[#E94B59] mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <label className="flex items-center space-x-2 text-xs font-semibold text-[#77778D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5135ED] focus:ring-[#5135ED] border-[#E8E7F0] accent-[#5135ED]"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#5135ED] hover:bg-[#3925C5] disabled:opacity-60 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-[#5135ED]/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-[#E8E7F0] text-center">
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-[#19A76B] bg-[#EAF7EE] px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted 256-Bit SSL Encrypted Admin Portal</span>
            </div>
            <p className="text-[10px] text-[#77778D] font-medium mt-2">
              Unauthorized access attempts are monitored and recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
