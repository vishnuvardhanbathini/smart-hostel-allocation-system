import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, CheckCircle, Clock, X, Check } from 'lucide-react';

export default function WardenComplaints() {
  const { profile } = useAuth();
  const { getHostels, getStudents, getComplaints, updateComplaint, createNotification } = useDatabase();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);
  const [status, setStatus] = useState('Resolved');
  const [remarks, setRemarks] = useState('');

  const hostels = getHostels();
  const assignedHostel = hostels.find(h => h.id === profile?.hostel_id) || hostels[0];
  const complaints = getComplaints().filter(c => c.hostel_id === assignedHostel.id);
  const students = getStudents();

  const handleOpenModal = (comp) => {
    setSelectedComp(comp);
    setStatus(comp.status === 'Resolved' ? 'Resolved' : 'Resolved');
    setRemarks(comp.warden_remarks || '');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedComp) return;

    const wardenName = profile?.full_name || 'Warden';
    const formattedRemarks = `[${wardenName}]: ${remarks.trim() || 'Ticket inspected and status updated.'}`;

    updateComplaint(selectedComp.id, {
      status,
      warden_remarks: formattedRemarks
    });

    // Notify student
    const student = students.find(s => s.id === selectedComp.student_id);
    if (student?.user_id) {
      createNotification({
        user_id: student.user_id,
        title: `Complaint #${selectedComp.id} Updated`,
        message: `Your complaint "${selectedComp.title}" has been updated to "${status}". Remarks: ${remarks || 'Resolved.'}`,
        type: status === 'Resolved' ? 'success' : 'info',
        link: '/student/complaints'
      });
    }

    addToast(`Complaint #${selectedComp.id} updated!`, 'success');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          <span>Hostel Maintenance Desk &bull; {assignedHostel.name}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review student complaints, assign technician tasks, and record resolution notes
        </p>
      </div>

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 rounded-3xl bg-navy-900 border border-navy-800">
            No complaints logged for this hostel. All facilities operational.
          </div>
        ) : (
          complaints.map(comp => {
            const student = students.find(s => s.id === comp.student_id);
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
                    <button
                      onClick={() => handleOpenModal(comp)}
                      className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-navy-950 border border-cyan-500/30 text-xs font-bold transition"
                    >
                      Update Ticket
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {comp.description}
                </p>

                {comp.warden_remarks && (
                  <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 text-xs text-cyan-300/90">
                    <span className="font-bold text-slate-400">Resolution Remarks: </span>
                    {comp.warden_remarks}
                  </div>
                )}

                <div className="pt-2 border-t border-navy-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div>
                    Student: <strong className="text-white">{student?.full_name}</strong> ({student?.student_id}) &bull; Room <strong className="text-white">{comp.room_number || 'N/A'}</strong>
                  </div>
                  <div>
                    Logged {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="text-base font-bold text-white">
                Update Complaint #{selectedComp?.id}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress (Electrician / Plumber Assigned)</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Warden Resolution Notes</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Electrician inspected and replaced the 16A modular circuit socket."
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
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
