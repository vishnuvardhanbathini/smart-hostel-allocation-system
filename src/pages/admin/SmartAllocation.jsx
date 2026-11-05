import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { allocationEngine } from '../../services/allocationEngine';
import { Cpu, Sparkles, CheckCircle, AlertCircle, Building, Bed, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SmartAllocation() {
  const { getApplications, getStudents, getHostels, getRooms, getAllocations, refresh } = useDatabase();
  const { addToast } = useToast();

  const [executing, setExecuting] = useState(false);
  const [allocationResults, setAllocationResults] = useState(null);

  const applications = getApplications();
  const students = getStudents();
  const hostels = getHostels();
  const rooms = getRooms();
  const activeAllocations = getAllocations().filter(a => a.status === 'Active');

  const allocatedStudentIds = new Set(activeAllocations.map(a => a.student_id));
  const queueApplications = applications.filter(a => a.status === 'Approved' && !allocatedStudentIds.has(a.student_id));

  const totalAvailableBeds = rooms.reduce((sum, r) => sum + (r.capacity - r.occupied_beds), 0);

  const handleRunAlgorithm = () => {
    setExecuting(true);
    setTimeout(() => {
      try {
        const results = allocationEngine.runSmartAllocation();
        refresh();
        setAllocationResults(results);
        if (results.allocatedCount > 0) {
          addToast(`Smart Room Allocation completed: ${results.allocatedCount} students allocated!`, 'success');
        } else {
          addToast('No eligible students could be matched with available rooms.', 'warning');
        }
      } catch (err) {
        addToast(err.message, 'danger');
      } finally {
        setExecuting(false);
      }
    }, 600);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-800 border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <Cpu className="w-4 h-4" />
            <span>Merit-Based Automated Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Smart Room Allocation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Optimizes student bed assignments automatically based on CGPA merit, hometown distance, room capacity, and strict gender-wing segregation.
          </p>
        </div>

        <button
          onClick={handleRunAlgorithm}
          disabled={executing || queueApplications.length === 0}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {executing ? (
            <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-navy-950" />
              <span>Execute Smart Allocation</span>
            </>
          )}
        </button>
      </div>

      {/* Algorithm Rules & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Queue Status</div>
          <div className="text-2xl font-black text-white">{queueApplications.length} Students</div>
          <div className="text-xs text-slate-400">Approved applications ready to allocate</div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Free Beds Capacity</div>
          <div className="text-2xl font-black text-cyan-400">{totalAvailableBeds} Beds Free</div>
          <div className="text-xs text-slate-400">Across 4 university residences</div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Merit Formula</div>
          <div className="text-sm font-mono text-cyan-300 font-bold">(CGPA &times; 0.6) + (Dist &times; 0.4)</div>
          <div className="text-xs text-slate-400">Ensures transparent academic priority</div>
        </div>
      </div>

      {/* Allocation Execution Results Card */}
      {allocationResults && (
        <div className="p-6 rounded-3xl bg-navy-900 border border-cyan-500/50 shadow-2xl space-y-4 animate-slide-in">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Execution Batch Results</h3>
            </div>
            <span className="text-xs font-bold text-cyan-400">
              {allocationResults.allocatedCount} Allocated / {allocationResults.totalProcessed} Processed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allocationResults.details.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-xs ${
                  item.status === 'Allocated'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                }`}
              >
                <div className="font-bold text-white text-sm">{item.studentName}</div>
                {item.status === 'Allocated' ? (
                  <div className="mt-1 space-y-0.5 text-xs text-emerald-300">
                    <div>{item.hostelName}</div>
                    <div className="font-mono font-bold">Room {item.roomNumber} ({item.bedNumber})</div>
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-rose-300">{item.reason}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Queue Ready for Allocation */}
      <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-cyan-400" />
          <span>Students in Queue for Allocation</span>
        </h2>

        {queueApplications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No approved applications in queue. Either all students are already allocated, or new applications are pending approval.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider border-b border-navy-800">
                <tr>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Gender</th>
                  <th className="py-3 px-3">Preferred Hostel</th>
                  <th className="py-3 px-3">Room Type</th>
                  <th className="py-3 px-3">Merit (CGPA)</th>
                  <th className="py-3 px-3">Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {queueApplications.map(app => {
                  const student = students.find(s => s.id === app.student_id);
                  const hostel = hostels.find(h => h.id === app.preferred_hostel_id);

                  return (
                    <tr key={app.id} className="hover:bg-navy-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-white">
                        {student?.full_name}
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                        {student?.student_id}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {student?.gender}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {hostel?.name || 'Any Eligible'}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {app.preferred_room_type} Room
                      </td>
                      <td className="py-3 px-3 font-bold text-cyan-400">
                        {app.academic_score}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {app.distance_from_home_km} km
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
