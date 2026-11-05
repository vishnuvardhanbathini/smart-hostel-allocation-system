import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { Menu, Hotel, RotateCcw, Home } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useToast } from '../context/ToastContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, role } = useAuth();
  const { resetToDemo } = useDatabase();
  const { addToast } = useToast();

  const handleReset = () => {
    if (window.confirm('Reset local demo database to initial state?')) {
      resetToDemo();
      addToast('Demo database has been restored to default values.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-navy-900/90 backdrop-blur-md border-b border-navy-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-navy-800 text-slate-200 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Session
              </span>
              <div className="text-sm font-bold text-white capitalize">
                {role} Workspace &bull; <span className="text-cyan-400">{user?.displayName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              title="Return to Public Homepage"
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-cyan-400 border border-navy-700 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <button
              onClick={handleReset}
              title="Reset Sample Database"
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-cyan-400 border border-navy-700 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Data</span>
            </button>

            <NotificationBell />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <footer className="py-4 px-6 bg-navy-900/40 border-t border-navy-800/80 text-center text-xs text-slate-500">
          Smart Hostel Allocation and Management System &bull; University Residential Services &bull; Persistent Demo Mode
        </footer>
      </div>
    </div>
  );
}
