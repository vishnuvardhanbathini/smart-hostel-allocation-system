import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';

export default function AdminComplaints() {
  const { getComplaints, getStudents, getHostels, updateComplaint } = useDatabase();
  const { addToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const complaints = getComplaints();
  const students = getStudents();
  const hostels = getHostels();

  const filtered = complaints.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const handleResolve = (id) => {
    updateComplaint(id, { status: 'Resolved', warden_remarks: '[Administrator]: Inspected and marked as resolved.' });
    addToast(`Complaint #${id} marked as resolved.`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          <span>Campus Maintenance Tickets & Complaints</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor student grievances, maintenance requests, and warden resolution workflows
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800 flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Pending', 'In Progress', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                statusFilter === st
                  ? 'bg-cyan-500 text-navy-950 shadow-md'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Water supply">Water Supply</option>
            <option value="Internet">Internet / Wi-Fi</option>
            <option value="Cleaning">Housekeeping</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 rounded-3xl bg-navy-900 border border-navy-800">
            No complaints match the filter.
          </div>
        ) : (
          filtered.map(comp => {
            const student = students.find(s => s.id === comp.student_id);
            const hostel = hostels.find(h => h.id === comp.hostel_id);

            let statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            if (comp.status === 'Resolved') statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            else if (comp.status === 'In Progress') statusBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/30';

            return (
              <div
                key={comp.id}
                className="p-5 sm:p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-400">#{comp.id}</span>
                    <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-navy-700 text-[11px] font-bold text-cyan-400">
                      {comp.category}
                    </span>
                    <h3 className="font-bold text-sm text-white">{comp.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge}`}>
                      {comp.status}
                    </span>
                    {comp.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolve(comp.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {comp.description}
                </p>

                {comp.warden_remarks && (
                  <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 text-xs text-cyan-300/90">
                    <span className="font-bold text-slate-400">Resolution Log: </span>
                    {comp.warden_remarks}
                  </div>
                )}

                <div className="pt-2 border-t border-navy-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div>
                    Student: <strong className="text-white">{student?.full_name}</strong> ({student?.student_id}) &bull; {hostel?.name} &bull; Room <strong className="text-white">{comp.room_number || 'N/A'}</strong>
                  </div>
                  <div>
                    Submitted on {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
