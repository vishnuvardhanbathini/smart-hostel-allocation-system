import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useToast } from '../context/ToastContext';
import {
  Hotel,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { getHostels, resetToDemo } = useDatabase();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hostelDropdownOpen, setHostelDropdownOpen] = useState(false);
  const hostels = getHostels();

  const handleReset = () => {
    if (window.confirm('Reset local demo database to initial state? All your additions will be restored to seed values.')) {
      resetToDemo();
      addToast('Demo database has been reset to seed data.', 'success');
    }
  };

  const handleLogout = () => {
    logout();
    addToast('You have been logged out successfully.', 'info');
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'warden') return '/warden/dashboard';
    return '/student/dashboard';
  };

  return (
    <nav className="glass-nav text-white sticky top-0 z-40 border-b border-navy-700/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                Smart<span className="text-cyan-400">Hostel</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold tracking-normal hidden md:inline-block">
                  DEMO DB
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">
                Campus Housing Suite
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors">
              Home
            </Link>

            {/* Hostels Dropdown */}
            <div className="relative">
              <button
                onClick={() => setHostelDropdownOpen(!hostelDropdownOpen)}
                onBlur={() => setTimeout(() => setHostelDropdownOpen(false), 200)}
                className="text-sm font-medium text-slate-200 hover:text-cyan-400 flex items-center gap-1.5 transition-colors focus:outline-none"
              >
                <span>Hostels</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${hostelDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {hostelDropdownOpen && (
                <div className="absolute left-0 mt-3 w-72 rounded-2xl bg-navy-900 border border-navy-700 shadow-2xl p-2 z-50 animate-slide-in">
                  <div className="text-xs font-semibold text-slate-400 px-3 py-2 uppercase tracking-wider">
                    University Residences
                  </div>
                  {hostels.map(h => (
                    <Link
                      key={h.id}
                      to={`/hostel/${h.id}`}
                      className="block p-2.5 rounded-xl hover:bg-navy-800 transition-colors group"
                      onClick={() => setHostelDropdownOpen(false)}
                    >
                      <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {h.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-cyan-400">{h.hostel_type} Hostel</span>
                        <span>&bull;</span>
                        <span>{h.total_floors} Floors</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href="#features" className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors">
              About
            </a>

            {/* Reset Demo DB Pill */}
            <button
              onClick={handleReset}
              title="Reset sample database to fresh seed state"
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-600/60 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset Data</span>
            </button>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <ShieldCheck className="w-4 h-4 text-navy-950" />
                  <span>{role.toUpperCase()} PORTAL</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out of current account"
                  className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-rose-400 border border-navy-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-navy-800/80 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-md shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  Register as Student
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-navy-800 text-slate-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-navy-700 px-4 pt-3 pb-6 space-y-3 animate-slide-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Home
          </Link>
          <div className="border-t border-navy-800 pt-2">
            <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Hostels</div>
            {hostels.map(h => (
              <Link
                key={h.id}
                to={`/hostel/${h.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm text-slate-300 hover:text-cyan-400"
              >
                {h.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-navy-800 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 text-center font-bold text-sm"
                >
                  Go to {role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full py-2.5 rounded-xl bg-navy-800 text-rose-300 text-center font-semibold text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-navy-800 text-white text-center font-semibold text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 text-center font-bold text-sm"
                >
                  Register as Student
                </Link>
              </>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); handleReset(); }}
              className="mt-2 py-2 text-xs text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database to Seed</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
