import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, MapPin, ShieldCheck, CheckCircle } from 'lucide-react';

export default function StudentProfile() {
  const { user, profile, updateCurrentProfile } = useAuth();
  const { updateStudent } = useDatabase();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    address: profile?.address || '',
    parent_name: profile?.parent_name || '',
    parent_phone: profile?.parent_phone || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile) return;

    const updated = updateStudent(profile.id, formData);
    updateCurrentProfile(updated);
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-cyan-400" />
          <span>My Student Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Keep your contact information and emergency guardian details up to date
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-6">
        
        {/* Read-Only Academic Identity */}
        <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Verified University Identity
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Full Name</span>
              <div className="font-bold text-white text-sm mt-0.5">{profile?.full_name}</div>
            </div>
            <div>
              <span className="text-slate-500">Student ID</span>
              <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">{profile?.student_id}</div>
            </div>
            <div>
              <span className="text-slate-500">Department</span>
              <div className="font-semibold text-slate-300 mt-0.5">{profile?.department}</div>
            </div>
            <div>
              <span className="text-slate-500">Gender & Year</span>
              <div className="font-semibold text-slate-300 mt-0.5">{profile?.gender} &bull; Year {profile?.year_of_study}</div>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Student Contact Phone *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Parent / Guardian Name</label>
            <input
              type="text"
              value={formData.parent_name}
              onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Parent / Emergency Contact Phone</label>
            <input
              type="text"
              value={formData.parent_phone}
              onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Permanent Hometown Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-md transition"
            >
              Save Profile Updates
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
