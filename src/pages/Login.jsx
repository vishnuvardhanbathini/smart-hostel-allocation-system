import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Hotel, Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, quickLogin, user, role } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // If already logged in, redirect to respective dashboard
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'warden') navigate('/warden/dashboard');
      else navigate('/student/dashboard');
    }
  }, [user, role, navigate]);

  // Pre-fill if role is in query parameter
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (roleParam === 'warden') {
      setUsername('warden_boys');
      setPassword('warden123');
    } else if (roleParam === 'student') {
      setUsername('rahul_sharma');
      setPassword('student123');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      addToast('Please enter both username and password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const session = await login(username, password);
      addToast(`Signed in successfully as ${session.displayName}!`, 'success');
      if (session.role === 'admin') navigate('/admin/dashboard');
      else if (session.role === 'warden') navigate('/warden/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      addToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleName) => {
    setLoading(true);
    try {
      const session = await quickLogin(roleName);
      addToast(`Logged in with demo ${roleName} account!`, 'success');
      if (session.role === 'admin') navigate('/admin/dashboard');
      else if (session.role === 'warden') navigate('/warden/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      addToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-navy-950">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 items-center justify-center shadow-xl shadow-cyan-500/20 mb-4">
            <Hotel className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Sign in to Portal
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Access your university hostel management dashboard
          </p>
        </div>

        {/* 1-Click Instant Demo Login Card */}
        <div className="p-4 rounded-2xl bg-navy-900 border border-navy-700 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Logins</span>
            </span>
            <span className="text-[10px] text-slate-400">1-click test</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl bg-navy-800 hover:bg-rose-950/60 border border-navy-700 hover:border-rose-500/50 text-center transition group"
            >
              <div className="text-xs font-bold text-rose-400 group-hover:scale-105 transition-transform">Admin</div>
              <div className="text-[10px] text-slate-400 mt-0.5">admin</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('warden')}
              className="p-2 rounded-xl bg-navy-800 hover:bg-emerald-950/60 border border-navy-700 hover:border-emerald-500/50 text-center transition group"
            >
              <div className="text-xs font-bold text-emerald-400 group-hover:scale-105 transition-transform">Warden</div>
              <div className="text-[10px] text-slate-400 mt-0.5">warden_boys</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="p-2 rounded-xl bg-navy-800 hover:bg-blue-950/60 border border-navy-700 hover:border-blue-500/50 text-center transition group"
            >
              <div className="text-xs font-bold text-blue-400 group-hover:scale-105 transition-transform">Student</div>
              <div className="text-[10px] text-slate-400 mt-0.5">rahul_sharma</div>
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username/Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Username or University Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 transition outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-slate-400">Demo passwords in cards above</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-navy-950 border border-navy-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-cyan-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-navy-700 bg-navy-950 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-6 border-t border-navy-800 text-center text-xs text-slate-400">
            <span>Don't have a student account? </span>
            <Link to="/register" className="font-bold text-cyan-400 hover:underline">
              Register as Student
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
