import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Phone, Mail, MapPin, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Smart<span className="text-cyan-400">Hostel</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated, merit-based smart hostel allocation & campus residence management system for universities and institutions.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-cyan-400 font-semibold">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Client-Side Persistent Demo Mode</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login?role=admin" className="hover:text-cyan-400 transition-colors">Admin Management</Link>
              </li>
              <li>
                <Link to="/login?role=warden" className="hover:text-cyan-400 transition-colors">Warden Console</Link>
              </li>
              <li>
                <Link to="/login?role=student" className="hover:text-cyan-400 transition-colors">Student Resident Portal</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cyan-400 transition-colors">New Student Registration</Link>
              </li>
            </ul>
          </div>

          {/* Residences */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Residences</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/hostel/1" className="hover:text-cyan-400 transition-colors">SR Boys Hostel BH-05</Link>
              </li>
              <li>
                <Link to="/hostel/2" className="hover:text-cyan-400 transition-colors">SR Girls Hostel GH-05</Link>
              </li>
              <li>
                <Link to="/hostel/3" className="hover:text-cyan-400 transition-colors">Sumathi Reddy Girls Hall</Link>
              </li>
              <li>
                <Link to="/hostel/4" className="hover:text-cyan-400 transition-colors">KITS Boys Residence</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Campus Helpdesk</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Central Campus Housing, Admin Block</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+91 98765 43210 (24/7 Helpline)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>housing@university.edu</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-navy-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Smart Hostel Allocation and Management System &bull; University Residential Campus Services</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>SESD Academic Software Engineering Project</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
