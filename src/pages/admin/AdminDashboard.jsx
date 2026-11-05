import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/StatCard';
import { exportStudentsCSV, exportAllocationsCSV, exportRoomsCSV } from '../../utils/exportCSV';
import { allocationEngine } from '../../services/allocationEngine';
import {
  Users,
  Building,
  Bed,
  FileText,
  MessageSquare,
  Cpu,
  Download,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    getHostels,
    getRooms,
    getStudents,
    getAllocations,
    getApplications,
    getComplaints,
    updateApplication,
    refresh
  } = useDatabase();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const hostels = getHostels();
  const rooms = getRooms();
  const students = getStudents();
  const allocations = getAllocations().filter(a => a.status === 'Active');
  const applications = getApplications();
  const complaints = getComplaints();

  const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupied_beds, 0);
  const availableBeds = totalBeds - occupiedBeds;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  const handleApprove = (appId) => {
    updateApplication(appId, { status: 'Approved', admin_remarks: 'Approved by Administrator. Queued for room allocation.' });
    addToast(`Application #${appId} approved!`, 'success');
  };

  const handleReject = (appId) => {
    updateApplication(appId, { status: 'Rejected', admin_remarks: 'Rejected by Administrator due to capacity or eligibility constraints.' });
    addToast(`Application #${appId} rejected.`, 'info');
  };

  const handleRunSmartAllocation = () => {
    const result = allocationEngine.runSmartAllocation();
    refresh();
    if (result.allocatedCount > 0) {
      addToast(`Smart Allocation Complete! Successfully allocated ${result.allocatedCount} student(s).`, 'success');
    } else {
      addToast('No approved applications were eligible for room allocation.', 'warning');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            System Administration Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time campus residential management & automated allocation controls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunSmartAllocation}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition transform hover:-translate-y-0.5"
          >
            <Cpu className="w-4 h-4 text-navy-950" />
            <span>Run Smart Allocation</span>
          </button>

          <button
            onClick={() => exportAllocationsCSV(allocations, students, hostels, rooms)}
            className="px-3.5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Allocations</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hostels"
          value={hostels.length}
          icon={Building}
          color="cyan"
          subtitle="4 Campus Residences"
        />
        <StatCard
          title="Bed Capacity"
          value={`${occupiedBeds} / ${totalBeds}`}
          icon={Bed}
          color="blue"
          subtitle={`${availableBeds} beds available`}
        />
        <StatCard
          title="Pending Applications"
          value={pendingApps}
          icon={FileText}
          color="amber"
          subtitle={`${approvedApps} approved in queue`}
        />
        <StatCard
          title="Open Complaints"
          value={pendingComplaints}
          icon={MessageSquare}
          color="rose"
          subtitle="Maintenance tickets"
        />
      </div>

      {/* Applications Review Queue & Quick Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Hostel Applications Queue</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Review student submissions and assign statuses</p>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View all ({applications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Student</th>
                  <th className="py-2.5 px-3">Preferred Hostel</th>
                  <th className="py-2.5 px-3">Room Type</th>
                  <th className="py-2.5 px-3">Merit (CGPA)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {applications.slice(0, 6).map(app => {
                  const student = students.find(s => s.id === app.student_id);
                  const hostel = hostels.find(h => h.id === app.preferred_hostel_id);

                  let badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                  if (app.status === 'Allocated') badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                  else if (app.status === 'Approved') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                  else if (app.status === 'Rejected') badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';

                  return (
                    <tr key={app.id} className="hover:bg-navy-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-white">
                        <div>{student?.full_name || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400">{student?.student_id} &bull; {student?.gender}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {hostel?.name || 'Any'}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {app.preferred_room_type} Room
                      </td>
                      <td className="py-3 px-3 font-bold text-cyan-400">
                        {app.academic_score || '8.0'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {app.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(app.id)}
                              title="Approve Application"
                              className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              title="Reject Application"
                              className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Hostel Occupancy Snapshot */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Residences Capacity</span>
            </h2>
            <Link to="/admin/hostels" className="text-xs text-cyan-400 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-4">
            {hostels.map(hostel => {
              const hRooms = rooms.filter(r => r.hostel_id === hostel.id);
              const cap = hRooms.reduce((sum, r) => sum + r.capacity, 0);
              const occ = hRooms.reduce((sum, r) => sum + r.occupied_beds, 0);
              const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0;

              return (
                <div key={hostel.id} className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white truncate max-w-[180px]">{hostel.name}</span>
                    <span className="text-cyan-400">{pct}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-navy-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{occ} occupied</span>
                    <span>{cap - occ} available</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
