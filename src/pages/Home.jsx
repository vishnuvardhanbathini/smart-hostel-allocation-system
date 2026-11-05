import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Hotel,
  Shield,
  ArrowRight,
  UserCheck,
  Building,
  Bed,
  CheckCircle,
  Sparkles,
  Cpu,
  Lock,
  PhoneCall,
  Wifi,
  Coffee,
  BookOpen
} from 'lucide-react';

export default function Home() {
  const { getHostels, getRooms, getStudents } = useDatabase();
  const { quickLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const hostels = getHostels();
  const rooms = getRooms();
  const students = getStudents();

  const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupied_beds, 0);

  const handleQuickLogin = async (role) => {
    try {
      const session = await quickLogin(role);
      addToast(`Logged in as ${session.displayName} (${session.role})!`, 'success');
      if (session.role === 'admin') navigate('/admin/dashboard');
      else if (session.role === 'warden') navigate('/warden/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      addToast(err.message, 'danger');
    }
  };

  return (
    <div className="bg-navy-950 text-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-navy-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-navy-950 to-navy-950 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SESD University Housing Suite</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Smart Hostel Allocation <br className="hidden sm:inline" />
                <span className="gradient-text-cyan">and Management System</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Modern university residential management with automated merit-based room allocation, student application tracking, digital maintenance desk, and warden consoles.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-base shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Access Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-base border border-navy-700 shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Student Registration</span>
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-navy-800/80">
                <div>
                  <div className="text-3xl font-extrabold text-cyan-400">{hostels.length}</div>
                  <div className="text-xs text-slate-400 font-medium">Campus Hostels</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{rooms.length}</div>
                  <div className="text-xs text-slate-400 font-medium">Total Rooms</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-cyan-400">{totalBeds}</div>
                  <div className="text-xs text-slate-400 font-medium">Bed Capacity</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{students.length}</div>
                  <div className="text-xs text-slate-400 font-medium">Registered Students</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative rounded-3xl overflow-hidden border border-navy-700/80 shadow-2xl bg-navy-900">
                  <img
                    src="/images/hostelimage.jpg"
                    alt="Smart Hostel Campus Residence"
                    className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent p-6">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-bold text-xs mb-1 border border-cyan-500/30">
                      University Campus Residences
                    </span>
                    <h3 className="font-bold text-base text-white">Modern Living, Learning & Safety</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1-Click Interactive Demo Credentials Bar */}
      <section className="bg-navy-900/90 border-b border-navy-800 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center lg:text-left">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>DEMO CREDENTIALS</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    1-Click Login Active
                  </span>
                </div>
                <div className="text-xs text-slate-400">Click any role to test instant dashboard access</div>
              </div>
            </div>

            {/* Quick Login Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              {/* Admin Button */}
              <button
                onClick={() => handleQuickLogin('admin')}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 flex items-center justify-between gap-3 text-xs transition group"
              >
                <div className="text-left">
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">ADMIN</span>
                  <div className="font-semibold text-white mt-0.5">admin / admin123</div>
                </div>
                <span className="text-cyan-400 font-bold group-hover:underline">Login &rarr;</span>
              </button>

              {/* Warden Button */}
              <button
                onClick={() => handleQuickLogin('warden')}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 flex items-center justify-between gap-3 text-xs transition group"
              >
                <div className="text-left">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">WARDEN</span>
                  <div className="font-semibold text-white mt-0.5">warden_boys / warden123</div>
                </div>
                <span className="text-cyan-400 font-bold group-hover:underline">Login &rarr;</span>
              </button>

              {/* Student Button */}
              <button
                onClick={() => handleQuickLogin('student')}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 flex items-center justify-between gap-3 text-xs transition group"
              >
                <div className="text-left">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">STUDENT</span>
                  <div className="font-semibold text-white mt-0.5">rahul_sharma / student123</div>
                </div>
                <span className="text-cyan-400 font-bold group-hover:underline">Login &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Hostels Showcase */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            University Accommodation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Campus Hostels & Residence Halls
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Secure, fully-equipped residential hostels with dedicated wardens, high-speed Wi-Fi, study lounges, and modern facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hostels.map(hostel => {
            const hostelRooms = rooms.filter(r => r.hostel_id === hostel.id);
            const hostelCapacity = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
            const hostelOccupied = hostelRooms.reduce((sum, r) => sum + r.occupied_beds, 0);
            const availableBeds = hostelCapacity - hostelOccupied;

            return (
              <div
                key={hostel.id}
                className="rounded-3xl bg-navy-900 border border-navy-800 overflow-hidden shadow-xl hover:border-cyan-500/50 transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-60 sm:h-72 overflow-hidden bg-navy-950">
                  <img
                    src={hostel.image_url}
                    alt={hostel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-md ${
                      hostel.hostel_type === 'Boys'
                        ? 'bg-blue-600 text-white'
                        : 'bg-pink-600 text-white'
                    }`}>
                      {hostel.hostel_type} Hostel
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-950/80 backdrop-blur-md text-slate-200 border border-navy-700">
                      {hostel.total_floors} Floors
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-navy-950/90 backdrop-blur-md border border-navy-700 text-xs font-bold text-cyan-400">
                    {availableBeds} Beds Available
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {hostel.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                      {hostel.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="border-t border-navy-800 pt-4">
                    <div className="text-xs font-semibold text-slate-400 mb-2">Key Amenities</div>
                    <div className="flex flex-wrap gap-1.5">
                      {hostel.facilities.split(',').map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-navy-800 text-[11px] font-medium text-slate-300 border border-navy-700"
                        >
                          {fac.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-navy-800">
                    <div className="text-xs text-slate-400">
                      <span>Total Capacity: </span>
                      <strong className="text-white">{hostelCapacity} Beds</strong>
                    </div>

                    <Link
                      to={`/hostel/${hostel.id}`}
                      className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-navy-950 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-navy-900/60 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Seamless Campus Housing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-navy-900 border border-navy-800 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Smart Allocation Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automated merit algorithm sorting by academic scores, distance from hometown, gender verification, and preferred room layouts.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900 border border-navy-800 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Role-Based Access Control</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Dedicated interfaces for Students, Wardens, and Administrators with strict boundary controls and data privacy.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900 border border-navy-800 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Digital Maintenance Desk</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instant student ticketing for electrical, plumbing, and housekeeping issues with warden tracking and resolution notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-800 border border-navy-700 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                SESD Project Specification
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                About SmartHostel System
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                The Smart Hostel Allocation and Management System replaces manual hostel allotment queues with a transparent, algorithm-driven student accommodation portal. Designed for real university campus residences.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Zero Bed Double-Booking</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Real-time Occupancy Auditing</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Instant CSV Data Export</span>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Register as Student Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
