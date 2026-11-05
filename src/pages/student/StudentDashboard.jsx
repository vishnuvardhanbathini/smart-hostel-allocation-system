import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Hotel,
  Bed,
  FileText,
  MessageSquare,
  Megaphone,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  Phone,
  User,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const {
    getHostels,
    getRooms,
    getStudents,
    getActiveAllocationForStudent,
    getApplicationsByStudentId,
    getComplaintsByStudentId,
    getNotices
  } = useDatabase();

  const student = profile;
  const allocation = student ? getActiveAllocationForStudent(student.id) : null;
  const applications = student ? getApplicationsByStudentId(student.id) : [];
  const latestApp = applications[applications.length - 1];
  const complaints = student ? getComplaintsByStudentId(student.id) : [];
  const notices = getNotices().slice(0, 3);

  const hostels = getHostels();
  const rooms = getRooms();
  const allocatedHostel = allocation ? hostels.find(h => h.id === allocation.hostel_id) : null;
  const allocatedRoom = allocation ? rooms.find(r => r.id === allocation.room_id) : null;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-800 border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Student Residential Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome, {student?.full_name || user?.displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Student ID: <strong className="text-cyan-400">{student?.student_id}</strong> &bull; {student?.department} &bull; Year {student?.year_of_study}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!allocation && (
            <Link
              to="/student/apply"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold text-xs shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Apply for Hostel</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Allotted Room Status & Application State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Allotted Room or Application Card */}
        <div className="lg:col-span-7 space-y-6">
          {allocation ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-900 to-navy-850 border border-cyan-500/40 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Room Allocated & Active</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">Academic Year 2024-2025</span>
              </div>

              <div>
                <div className="text-xs text-slate-400">Allocated Residence Hall</div>
                <h3 className="text-2xl font-black text-white mt-0.5">{allocatedHostel?.name}</h3>
                <div className="text-sm font-mono text-cyan-400 font-bold mt-1">
                  Room {allocatedRoom?.room_number} &bull; {allocation.bed_number} ({allocatedRoom?.room_type} Room)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 text-xs">
                  <span className="text-slate-400">Floor Level</span>
                  <div className="text-sm font-bold text-white mt-0.5">Floor {allocatedRoom?.floor}</div>
                </div>
                <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 text-xs">
                  <span className="text-slate-400">Amenities</span>
                  <div className="text-xs font-semibold text-slate-300 mt-0.5 truncate">{allocatedRoom?.facilities}</div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-navy-800">
                <Link
                  to="/student/room-details"
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>View Roommates & Facilities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/student/complaints"
                  className="px-3.5 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold border border-navy-700 transition"
                >
                  Submit Maintenance Request
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Hostel Application Status</span>
              </h3>

              {latestApp ? (
                <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">App #{latestApp.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      latestApp.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      latestApp.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {latestApp.status}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Preferred: {hostels.find(h => h.id === latestApp.preferred_hostel_id)?.name || 'Any'} ({latestApp.preferred_room_type} Room)
                  </div>
                  {latestApp.admin_remarks && (
                    <div className="text-xs text-cyan-300/90 pt-1">
                      <strong>Admin Notes: </strong>{latestApp.admin_remarks}
                    </div>
                  )}
                  <div className="pt-2">
                    <Link
                      to="/student/status"
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Track Full Application Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 space-y-3">
                  <p>You have not submitted a hostel application for the 2024-2025 semester yet.</p>
                  <Link
                    to="/student/apply"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold text-xs"
                  >
                    <span>Submit Hostel Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Quick Profile Summary */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-navy-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>My Profile Summary</span>
              </h3>
              <Link to="/student/profile" className="text-xs text-cyan-400 hover:underline">
                Edit Profile
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-500">Full Name</span>
                <div className="font-semibold text-white mt-0.5">{student?.full_name}</div>
              </div>
              <div>
                <span className="text-slate-500">Student ID</span>
                <div className="font-semibold text-white mt-0.5">{student?.student_id}</div>
              </div>
              <div>
                <span className="text-slate-500">Email Address</span>
                <div className="font-semibold text-white mt-0.5">{student?.email}</div>
              </div>
              <div>
                <span className="text-slate-500">Phone Number</span>
                <div className="font-semibold text-white mt-0.5">{student?.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notices & Maintenance Quick List */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Hostel Notices */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-navy-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-cyan-400" />
                <span>Hostel Notice Board</span>
              </h3>
              <Link to="/student/notices" className="text-xs text-cyan-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notices.map(n => (
                <div key={n.id} className="p-3 rounded-2xl bg-navy-950 border border-navy-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[200px]">{n.title}</span>
                    <span className="text-[10px] text-cyan-400 font-semibold">{n.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Tickets */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-navy-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>My Maintenance Tickets</span>
              </h3>
              <Link to="/student/complaints" className="text-xs text-cyan-400 hover:underline">
                New Ticket
              </Link>
            </div>

            <div className="space-y-2">
              {complaints.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  No maintenance tickets submitted.
                </div>
              ) : (
                complaints.slice(0, 3).map(c => (
                  <div key={c.id} className="p-3 rounded-2xl bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white truncate max-w-[180px]">{c.title}</div>
                      <div className="text-[10px] text-slate-400">{c.category}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
