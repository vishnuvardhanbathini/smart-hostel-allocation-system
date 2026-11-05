import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { FileText, CheckCircle, XCircle, Search, Clock, Check, X } from 'lucide-react';

export default function Applications() {
  const { getApplications, getStudents, getHostels, updateApplication } = useDatabase();
  const { addToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [remarks, setRemarks] = useState('');

  const applications = getApplications();
  const students = getStudents();
  const hostels = getHostels();

  const filteredApps = applications.filter(app => {
    const student = students.find(s => s.id === app.student_id);
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch = !searchTerm || (
      (student?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.student_id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (appId) => {
    updateApplication(appId, { status: 'Approved', admin_remarks: 'Approved by Administrator. Ready for room allocation.' });
    addToast(`Application #${appId} approved!`, 'success');
  };

  const handleReject = (appId) => {
    updateApplication(appId, { status: 'Rejected', admin_remarks: 'Rejected by Administrator.' });
    addToast(`Application #${appId} rejected.`, 'info');
  };

  const handleOpenRemarks = (app) => {
    setSelectedApp(app);
    setRemarks(app.admin_remarks || '');
    setRemarksModalOpen(true);
  };

  const handleSaveRemarks = (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    updateApplication(selectedApp.id, { admin_remarks: remarks });
    addToast('Admin remarks updated.', 'success');
    setRemarksModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Hostel Accommodation Applications</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total {applications.length} applications submitted by university students
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800 flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Pending', 'Approved', 'Allocated', 'Rejected'].map(st => (
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

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-3xl bg-navy-900 border border-navy-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">App ID</th>
                <th className="py-3 px-4">Applicant Student</th>
                <th className="py-3 px-4">Preferences</th>
                <th className="py-3 px-4">Merit Factors</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Admin Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No applications match the current criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => {
                  const student = students.find(s => s.id === app.student_id);
                  const hostel = hostels.find(h => h.id === app.preferred_hostel_id);

                  let badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                  if (app.status === 'Allocated') badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                  else if (app.status === 'Approved') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                  else if (app.status === 'Rejected') badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';

                  return (
                    <tr key={app.id} className="hover:bg-navy-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        #{app.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{student?.full_name || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400">
                          {student?.student_id} &bull; {student?.gender} &bull; {student?.department}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="font-medium text-white">{hostel?.name || 'Any Eligible'}</div>
                        <div className="text-[10px] text-slate-400">{app.preferred_room_type} Room</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>CGPA: <strong className="text-cyan-400">{app.academic_score || 'N/A'}</strong></div>
                        <div className="text-[10px] text-slate-400">{app.distance_from_home_km} km away</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        {app.admin_remarks || (
                          <span className="italic text-slate-600">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {app.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(app.id)}
                                title="Approve Application"
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleReject(app.id)}
                                title="Reject Application"
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleOpenRemarks(app)}
                            title="Edit Admin Remarks"
                            className="px-2 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-[10px] font-semibold border border-navy-700 transition"
                          >
                            Remarks
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remarks Modal */}
      {remarksModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="text-base font-bold text-white">
                Admin Remarks (Application #{selectedApp?.id})
              </h3>
              <button onClick={() => setRemarksModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRemarks} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Remarks & Decision Notes</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter administrator notes visible to student..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRemarksModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:bg-navy-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold"
                >
                  Save Remarks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
