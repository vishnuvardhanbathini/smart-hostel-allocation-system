import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { FileText, Building, Bed, CheckCircle, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export default function ApplyHostel() {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const {
    getHostels,
    getApplicationsByStudentId,
    getActiveAllocationForStudent,
    createApplication
  } = useDatabase();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const student = profile;
  const hostels = getHostels();

  // Filter hostels by gender matching
  const eligibleHostels = hostels.filter(h => {
    if (!student) return true;
    return student.gender === 'Male' ? h.hostel_type === 'Boys' : h.hostel_type === 'Girls';
  });

  const activeAllocation = student ? getActiveAllocationForStudent(student.id) : null;
  const existingApps = student ? getApplicationsByStudentId(student.id) : [];
  const activeApp = existingApps.find(a => a.status === 'Pending' || a.status === 'Approved');

  const preselectedHostelId = searchParams.get('hostel_id');

  const [formData, setFormData] = useState({
    preferred_hostel_id: preselectedHostelId ? Number(preselectedHostelId) : (eligibleHostels[0]?.id || 1),
    preferred_room_type: 'Double',
    academic_score: 8.5,
    distance_from_home_km: 250,
    special_remarks: ''
  });

  useEffect(() => {
    if (preselectedHostelId) {
      setFormData(prev => ({ ...prev, preferred_hostel_id: Number(preselectedHostelId) }));
    }
  }, [preselectedHostelId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!student) {
      addToast('Please login as a student to apply.', 'warning');
      return;
    }

    if (activeAllocation) {
      addToast('You already have an active room allocation.', 'warning');
      return;
    }

    if (activeApp) {
      addToast('You already have an application under review.', 'warning');
      return;
    }

    createApplication({
      student_id: student.id,
      preferred_hostel_id: Number(formData.preferred_hostel_id),
      preferred_room_type: formData.preferred_room_type,
      academic_score: Number(formData.academic_score),
      distance_from_home_km: Number(formData.distance_from_home_km),
      special_remarks: formData.special_remarks
    });

    addToast('Hostel application submitted successfully! It is now pending admin review.', 'success');
    navigate('/student/status');
  };

  if (activeAllocation) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-navy-900 border border-emerald-500/40 text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Room Already Allocated</h2>
        <p className="text-xs text-slate-300">
          You currently hold an active room allocation for the 2024-2025 academic semester.
        </p>
        <Link
          to="/student/room-details"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold text-xs"
        >
          <span>View Allotted Room</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (activeApp) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-navy-900 border border-amber-500/40 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Application Already Submitted</h2>
        <p className="text-xs text-slate-300">
          Your hostel accommodation application is currently in status: <strong className="text-amber-400 uppercase">{activeApp.status}</strong>.
        </p>
        <Link
          to="/student/status"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold text-xs"
        >
          <span>Track Application Status</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" />
          <span>Apply for Hostel Accommodation</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Submit your residence hall preferences and merit scores for smart allocation
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Select Preferred Residence Hall *
            </label>
            <select
              value={formData.preferred_hostel_id}
              onChange={(e) => setFormData({ ...formData, preferred_hostel_id: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
            >
              {eligibleHostels.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.hostel_type} &bull; {h.total_floors} Floors)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Preferred Room Type *</label>
              <select
                value={formData.preferred_room_type}
                onChange={(e) => setFormData({ ...formData, preferred_room_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
              >
                <option value="Single">Single Occupancy (1 Bed)</option>
                <option value="Double">Double Occupancy (2 Beds)</option>
                <option value="Triple">Triple Occupancy (3 Beds)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Academic Score (CGPA) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.academic_score}
                onChange={(e) => setFormData({ ...formData, academic_score: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Distance from Hometown to Campus (in Kilometers) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.distance_from_home_km}
              onChange={(e) => setFormData({ ...formData, distance_from_home_km: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Special Medical or Dietary Remarks</label>
            <textarea
              rows={3}
              value={formData.special_remarks}
              onChange={(e) => setFormData({ ...formData, special_remarks: e.target.value })}
              placeholder="e.g. Request ground floor room due to orthopedic injury, or quiet wing for research."
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 text-sm"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition"
            >
              <span>Submit Application for Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
