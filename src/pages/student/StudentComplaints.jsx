import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function StudentComplaints() {
  const { profile } = useAuth();
  const {
    getComplaintsByStudentId,
    getActiveAllocationForStudent,
    getRooms,
    createComplaint
  } = useDatabase();
  const { addToast } = useToast();

  const student = profile;
  const allocation = student ? getActiveAllocationForStudent(student.id) : null;
  const rooms = getRooms();
  const allocatedRoom = allocation ? rooms.find(r => r.id === allocation.room_id) : null;
  const complaints = student ? getComplaintsByStudentId(student.id) : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Electricity',
    priority: 'Medium',
    title: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast('Title and description are required.', 'warning');
      return;
    }

    createComplaint({
      student_id: student.id,
      hostel_id: allocation?.hostel_id || null,
      room_number: allocatedRoom?.room_number || '',
      category: formData.category,
      priority: formData.priority,
      title: formData.title.trim(),
      description: formData.description.trim()
    });

    addToast('Complaint submitted successfully! Your warden will review it shortly.', 'success');
    setFormData({ category: 'Electricity', priority: 'Medium', title: '', description: '' });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <span>Hostel Maintenance & Grievance Desk</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submit repair requests for electrical, plumbing, Wi-Fi, or cleaning issues
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4 text-navy-950" />
          <span>New Maintenance Ticket</span>
        </button>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 rounded-3xl bg-navy-900 border border-navy-800 space-y-3">
            <p>No maintenance tickets submitted. Everything in your room is in working order!</p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-cyan-400 font-bold border border-navy-700"
            >
              Log an Issue
            </button>
          </div>
        ) : (
          complaints.map(comp => {
            let statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            if (comp.status === 'Resolved') statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            else if (comp.status === 'In Progress') statusBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/30';

            return (
              <div
                key={comp.id}
                className="p-5 sm:p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{comp.id}</span>
                    <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-navy-700 text-[10px] font-bold text-cyan-400">
                      {comp.category}
                    </span>
                    <h3 className="font-bold text-sm text-white">{comp.title}</h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge} w-fit`}>
                    {comp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {comp.description}
                </p>

                {comp.warden_remarks && (
                  <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 text-xs text-cyan-300/90">
                    <span className="font-bold text-slate-400">Warden Resolution Notes: </span>
                    {comp.warden_remarks}
                  </div>
                )}

                <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div>Room {comp.room_number || 'Room'} &bull; Priority: <strong className="text-white">{comp.priority}</strong></div>
                  <div>Submitted on {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Complaint Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="text-base font-bold text-white">Log Maintenance Ticket</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Issue Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Electricity">Electrical / Lighting</option>
                    <option value="Water supply">Plumbing / Water</option>
                    <option value="Internet">Wi-Fi / Internet</option>
                    <option value="Cleaning">Housekeeping</option>
                    <option value="Maintenance">Furniture / Carpentry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Urgency Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Issue Summary / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Geyser thermostat not heating properly"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain exactly what is malfunctioning and since when..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:bg-navy-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
