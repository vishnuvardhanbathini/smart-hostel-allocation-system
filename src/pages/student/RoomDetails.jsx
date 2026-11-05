import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Bed, Building, Users, Shield, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function RoomDetails() {
  const { profile } = useAuth();
  const {
    getHostels,
    getRooms,
    getStudents,
    getAllocations,
    getActiveAllocationForStudent,
    getWardens
  } = useDatabase();

  const student = profile;
  const allocation = student ? getActiveAllocationForStudent(student.id) : null;

  if (!allocation) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-navy-900 border border-navy-800 text-center space-y-4">
        <Bed className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Room Allocated Yet</h2>
        <p className="text-xs text-slate-400">
          You do not have an active room allocation. Submit an application or check status.
        </p>
        <Link
          to="/student/apply"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold text-xs"
        >
          <span>Apply for Hostel</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const hostels = getHostels();
  const rooms = getRooms();
  const allStudents = getStudents();
  const allAllocations = getAllocations().filter(a => a.status === 'Active');
  const wardens = getWardens();

  const hostel = hostels.find(h => h.id === allocation.hostel_id);
  const room = rooms.find(r => r.id === allocation.room_id);
  const warden = wardens.find(w => w.hostel_id === hostel?.id);

  // Find roommates sharing this room
  const roommates = allAllocations
    .filter(a => a.room_id === room?.id && a.student_id !== student.id)
    .map(a => ({
      ...allStudents.find(s => s.id === a.student_id),
      bed_number: a.bed_number
    }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Bed className="w-6 h-6 text-cyan-400" />
          <span>My Allocated Room</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Residential details, allotted bed space, and assigned roommates
        </p>
      </div>

      {/* Main Room Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-900 to-navy-850 border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-navy-800">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              {hostel?.name}
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              Room {room?.room_number} &bull; <span className="text-cyan-400">{allocation.bed_number}</span>
            </h2>
          </div>

          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
            Active Allocation
          </span>
        </div>

        {/* Room Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800">
            <span className="text-slate-500">Floor Level</span>
            <div className="font-bold text-white text-sm mt-0.5">Floor {room?.floor}</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800">
            <span className="text-slate-500">Room Type</span>
            <div className="font-bold text-white text-sm mt-0.5">{room?.room_type} Room</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800">
            <span className="text-slate-500">Total Capacity</span>
            <div className="font-bold text-white text-sm mt-0.5">{room?.capacity} Beds</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800">
            <span className="text-slate-500">Semester Fee</span>
            <div className="font-bold text-cyan-400 text-sm mt-0.5">₹{room?.price_per_semester?.toLocaleString()}</div>
          </div>
        </div>

        {/* Facilities */}
        <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Room Facilities & Features
          </div>
          <div className="flex flex-wrap gap-2">
            {(room?.facilities || 'Attached Bath, Study Desk, Balcony').split(',').map((fac, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-navy-900 border border-navy-700 text-xs font-medium text-slate-200 flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>{fac.trim()}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Roommates Section */}
        <div className="pt-2 border-t border-navy-800 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Roommates in Room {room?.room_number}</h3>
          </div>

          {roommates.length === 0 ? (
            <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 text-xs text-slate-400">
              No other roommates currently assigned to this room (single occupancy or remaining beds vacant).
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roommates.map((rm, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{rm.full_name}</div>
                    <div className="text-[10px] text-slate-400">{rm.department} &bull; {rm.phone}</div>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 text-xs px-2 py-1 rounded bg-navy-900 border border-navy-700">
                    {rm.bed_number}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warden Support Contact */}
        <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800/80 flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-400">Hostel Warden In-Charge</div>
            <div className="font-bold text-white mt-0.5">{warden?.full_name || 'Dr. Rajesh Sharma'}</div>
          </div>
          <div className="text-right text-slate-300">
            <div>{warden?.phone || '+91 98765 43210'}</div>
            <div className="text-[10px] text-slate-400">{warden?.email || 'warden@university.edu'}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
