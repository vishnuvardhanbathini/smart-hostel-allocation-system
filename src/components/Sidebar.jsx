import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Hotel,
  LayoutDashboard,
  Users,
  Building,
  Bed,
  FileText,
  Cpu,
  MessageSquare,
  Bell,
  BarChart3,
  UserCheck,
  LogOut,
  X,
  User,
  Shield,
  FileCheck,
  Megaphone
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, role, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'info');
    navigate('/login');
  };

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Students', path: '/admin/students', icon: Users },
    { label: 'Manage Hostels', path: '/admin/hostels', icon: Building },
    { label: 'Manage Rooms', path: '/admin/rooms', icon: Bed },
    { label: 'Applications', path: '/admin/applications', icon: FileText },
    { label: 'Smart Allocation', path: '/admin/smart-allocation', icon: Cpu, badge: 'AUTO' },
    { label: 'Complaints', path: '/admin/complaints', icon: MessageSquare },
    { label: 'Notice Board', path: '/admin/notices', icon: Megaphone },
    { label: 'Analytics & Reports', path: '/admin/reports', icon: BarChart3 },
  ];

  const wardenNav = [
    { label: 'Overview', path: '/warden/dashboard', icon: LayoutDashboard },
    { label: 'Rooms & Occupancy', path: '/warden/rooms', icon: Bed },
    { label: 'Resident Students', path: '/warden/students', icon: Users },
    { label: 'Hostel Complaints', path: '/warden/complaints', icon: MessageSquare },
    { label: 'Hostel Notices', path: '/warden/notices', icon: Megaphone },
  ];

  const studentNav = [
    { label: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Student Profile', path: '/student/profile', icon: User },
    { label: 'Apply for Hostel', path: '/student/apply', icon: FileText },
    { label: 'Application Status', path: '/student/status', icon: FileCheck },
    { label: 'Allocated Room', path: '/student/room-details', icon: Bed },
    { label: 'Maintenance Tickets', path: '/student/complaints', icon: MessageSquare },
    { label: 'Hostel Notices', path: '/student/notices', icon: Megaphone },
    { label: 'Notifications', path: '/student/notifications', icon: Bell },
  ];

  let currentNav = studentNav;
  if (role === 'admin') currentNav = adminNav;
  if (role === 'warden') currentNav = wardenNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-950 border-r border-navy-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-navy-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white">
                Smart<span className="text-cyan-400">Hostel</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {role} Portal
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Navigation Menu
          </div>
          {currentNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-navy-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-navy-800 bg-navy-900/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center font-bold text-cyan-400">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-bold text-white truncate">
                {user?.displayName || user?.username}
              </div>
              <div className="text-xs text-slate-400 capitalize flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>{user?.role}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-navy-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-navy-700 hover:border-rose-800/60 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
