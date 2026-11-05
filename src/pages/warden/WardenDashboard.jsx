import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import StatCard from '../../components/StatCard';
import {
  Building,
  Bed,
  Users,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  Phone,
  Mail
} from 'lucide-react';

export default function WardenDashboard() {
  const { user, profile } = useAuth();
  const { getHostels, getRooms, getStudents, getAllocations, getComplaints } = useDatabase();

  const hostels = getHostels();
  const allRooms = getRooms();
  const allStudents = getStudents();
  const allAllocations = getAllocations().filter(a => a.status === 'Active');
  const allComplaints = getComplaints();

  // Find warden's assigned hostel
  const assignedHostel = hostels.find(h => h.id === profile?.hostel_id) || hostels[0];
  const hostelRooms = allRooms.filter(r => r.hostel_id === assignedHostel.id);
  const hostelCapacity = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
  const hostelOccupied = hostelRooms.reduce((sum, r) => sum + r.occupied_beds, 0);
  const hostelAllocations = allAllocations.filter(a => a.hostel_id === assignedHostel.id);
  const hostelComplaints = allComplaints.filter(c => c.hostel_id === assignedHostel.id);
  const pendingComplaints = hostelComplaints.filter(c => c.status !== 'Resolved');

  const occupancyRate = hostelCapacity > 0 ? Math.round((hostelOccupied / hostelCapacity) * 100) : 0;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-800 border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Shield className="w-4 h-4" />
            <span>Assigned Warden Residence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {assignedHostel.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Warden In-Charge: <strong className="text-white">{profile?.full_name || user?.displayName}</strong> ({profile?.warden_id || 'WRD-101'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/warden/complaints"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
          >
            <MessageSquare className="w-4 h-4 text-navy-950" />
            <span>Resolve Complaints ({pendingComplaints.length})</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Rooms"
          value={hostelRooms.length}
          icon={Bed}
          color="cyan"
          subtitle={`${assignedHostel.total_floors} Floors`}
        />
        <StatCard
          title="Occupied Beds"
          value={`${hostelOccupied} / ${hostelCapacity}`}
          icon={Users}
          color="emerald"
          subtitle={`${occupancyRate}% Occupancy`}
        />
        <StatCard
          title="Resident Students"
          value={hostelAllocations.length}
          icon={Building}
          color="blue"
          subtitle="Currently Allocated"
        />
        <StatCard
          title="Open Complaints"
          value={pendingComplaints.length}
          icon={MessageSquare}
          color="amber"
          subtitle="Requiring Attention"
        />
      </div>

      {/* Grid: Resident Students Snapshot & Urgent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Resident Students */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Resident Students Roster</span>
            </h2>
            <Link to="/warden/students" className="text-xs text-cyan-400 hover:underline">
              View All ({hostelAllocations.length})
            </Link>
          </div>

          <div className="divide-y divide-navy-800/60">
            {hostelAllocations.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No active students allocated to this hostel yet.
              </div>
            ) : (
              hostelAllocations.slice(0, 5).map(alloc => {
                const student = allStudents.find(s => s.id === alloc.student_id);
                const room = hostelRooms.find(r => r.id === alloc.room_id);

                return (
                  <div key={alloc.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{student?.full_name}</div>
                      <div className="text-[10px] text-slate-400">
                        {student?.student_id} &bull; {student?.department}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-cyan-400 text-xs">
                        Room {room?.room_number} ({alloc.bed_number})
                      </div>
                      <div className="text-[10px] text-slate-400">{student?.phone}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Complaints Requiring Attention */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Recent Hostel Complaints</span>
            </h2>
            <Link to="/warden/complaints" className="text-xs text-cyan-400 hover:underline">
              Desk
            </Link>
          </div>

          <div className="space-y-3">
            {hostelComplaints.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No complaints logged for this hostel. All good!
              </div>
            ) : (
              hostelComplaints.slice(0, 4).map(comp => (
                <div key={comp.id} className="p-3 rounded-2xl bg-navy-950 border border-navy-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[180px]">{comp.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      comp.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Room {comp.room_number || 'N/A'} &bull; {comp.category}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
